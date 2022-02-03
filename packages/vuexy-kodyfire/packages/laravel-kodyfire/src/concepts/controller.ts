/* @ts-nocheck */
import { classify } from "@angular-devkit/core/src/utils/strings";
import { IConcept, ITechnology, Source, TemplateSchema } from "kodyfire-core";
import { Engine } from "./engine";

/* @ts-ignore */
export class Controller implements IConcept {
    source?: Source;
  name: string;
  content: string;
  outputDir: string;
  template: TemplateSchema;
  defaultAction: string;
  technology: ITechnology;
  engine: Engine;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    this.source = concept.source ?? Source.Template;
    this.outputDir = concept.outputDir ?? "";
    this.name = concept.name ?? "";
    this.template = concept.template as TemplateSchema;
    this.technology = technology;
  }
  generate(_data: any) {
    this.engine = new Engine();
    this.engine.builder.registerHelper("getControllerMethods", () => {
      return this.getControllerMethods(_data);
    });
    const template = this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, _data);
    this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data.name), compiled)
  }
  
getFilename(name: any) {
  return `${classify(name)}Controller.php`;
}

getLoad(fields: any) {
    return fields && `$data->load(${fields});`
  }
  getList(model: any): string {
    let fieldsToLoad = ''
    if (model.relationships.length > 0) {
      fieldsToLoad = model.relationships
        .filter(
          (relation: any) =>
            relation.type != 'morphOne' &&
            relation.type != 'morphTo' &&
            relation.type != 'morphMany'
        )
        .map((field: any) => {
          const relation: string = field['name']
          return `'${relation}'`
        })
        .join(',')
    }
    const action = model.controller.actions.find((a: any) => a.name === 'getAll')
  
    let load = ''
  
    if (!!action && !!action.load && Array.isArray(action.load)) {
      load = '$data->load(' + action.load.map((l: any) => `'${l}'`).join(', ') + ');'
    }
  
    let data = `
  if (!$request->has('pagination')) {
    $data = ${model.name}::all();
    ${load}
  } else {

    $pageSize = $request->query('pageSize');
    $currentPage = $request->query('currentPage');
    $search = $request->query('search');

    Paginator::currentPageResolver(function () use ($currentPage) {
      return $currentPage;
    });

    $data = ${model.name}::paginate($pageSize);
    if($search != ""){
      $data = ${model.name}::search($search)->paginate($pageSize);
    }
    ${load}
  }`
    if (!model.hasPagination) {
      data = `
    if (!$request->has('pagination')) {
      $data = ${model.name}::all();
    } else {
      $search = $request->query('search');
      $data = ${model.name}::all();
      if($search != ""){
        $data = ${model.name}::search($search);
      }
      ${this.getLoad(fieldsToLoad)}
    }`
    }
    return data
  }
  
  getUserRelations(relations: Array<string>) {
    return relations.join('->')
  }
  
  getControllerMethods(model: any): string {
    let methods = ''
    model.controller.actions.forEach((action: any) => {
      switch (action.type) {
        case 'index':
          methods += `
public function ${action.name}(Request  $request) {
  try {
    ${this.getList(model)}
  } catch (\\Throwable $th) {
    return response()->json([
    'error' => 'Une erreur est parvenue',
    ], 500);
  }
  return response()->json(['data' => $data]);
}\n`
          break
        case 'store':
          methods += `
    public function ${action.name}(Create${model.name}Request $request, ${model.name}Repository $repository)
    {
        $data = new DataBag(['data' => $request->all()]);
        try {
            $model = $repository->create($data);
        } catch (\\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
        $message = trans('app.createSuccessMsg');
        return response()->json(['data' => $model, 'message' => $message, 'success' => true]);
    }\n`
          break
        case 'show':
          methods += `
    public function ${action.name}(${model.name} $${model.name.toLowerCase()})
    {
      try {
        $data = $${model.name.toLowerCase()};
      } catch (\\Throwable $th) {
        Log::error($th->getMessage());
          return response()->json([
              'error' => 'Une erreur est parvenue',
          ], 500);
      }
      return response()->json(['data' => $data]);
    }\n`
          break
        case 'getByUser':
          methods += `
    public function getByUser()
    {
      try {
        $user = auth()->user();
        $${action.route.relations[action.route.relations.length - 1]} = $user->${this.getUserRelations(action.route.relations)};
        
        $data = $${model.name.toLowerCase()};
      } catch (\\Throwable $th) {
        Log::error($th->getMessage());
          return response()->json([
              'error' => 'Une erreur est parvenue',
          ], 500);
      }
      return response()->json(['data' => $data]);
    }\n`
          break
        case 'update':
          methods += `
    public function ${action.name}(Update${model.name}Request $request, ${model.name} $${model.name.toLowerCase()}, ${model.name}Repository $repository) {
      $data = new DataBag(['data' => $request->all()]);
      try {
          $model = $repository->update($${model.name.toLowerCase()}, $data);
      } catch (\\Exception $e) {
          Log::error($e->getMessage());
          return response()->json([
              'error' => $e->getMessage(),
          ], 500);
      }
      $message = trans('app.updateSuccessMsg');
      return response()->json(['data' => $model, 'message' => $message, 'success' => true]);
      }\n`
          break
        case 'destroy':
          methods += `
    public function ${action.name}(${model.name} $${model.name.toLowerCase()}) {
    try {
        ${this.deleteAttachments(model)}
        $${model.name.toLowerCase()}->delete();
    } catch (\\Exception $e) {
        Log::error($e->getMessage());
            return response()->json([
        'error' => 'Une erreur est parvenue',
        ], 500);
    }
    $message = trans('app.deleteSuccessMsg');
    return response()->json(['message' => $message], 200);
    }\n`
          break
        case 'deleteMany':
          methods += `
    public function deleteMany(string $data)
    {
      try { 
        $ids = array_map('intval', explode(',', $data));
        ${this.deleteManyAttachments(model)}
        ${model.name}::whereIn('id', $ids)->delete();
      } catch (\\Exception $e) {
        Log::error($e);
        return response()->json([
          'error' => $e->getMessage(),
        ], 500);
      }
      $message = trans('app.deleteSuccessMsg');
      return response()->json(['message' => $message], 200);
    }\n`;
          break
        case 'generate':
          methods += this.getGenerateDocumentMethod(action, model)
          break
        default:
      }
    })
    return methods
  }
  
 deleteAttachments(model: any): string {
    let attachmentsToDelete = ''
    if (model.fields.filter((e: any) => e.extra_type == 'file').length > 0) {
      model.fields.forEach((element: any) => {
        if (element.extra_type == 'file') {
          attachmentsToDelete += `
                  if($${model.name.toLowerCase()}->${element.name}){
                      $fileuri = str_replace('/storage', '', $${model.name.toLowerCase()}->${element.name
            });
                      Storage::disk('public')->delete($fileuri);
                  }\n`
        }
      })
    }
    return attachmentsToDelete
  }
  
 deleteManyAttachments(model: any): string {
    let attachmentsToDelete = ''
    if (model.fields.filter((e: any) => e.extra_type == 'file').length > 0) {
      attachmentsToDelete = `
          foreach ($ids as $id) {
            $${model.name.toLowerCase()} = ${model.name}::find($id);
            ${this.deleteAttachments(model)}
          }`
    }
    return attachmentsToDelete
  }
  
 getGenerateDocumentMethod(action: any, model: any) {
    let content = `\npublic function ${action.name}(${model.name} $${model.name.toLowerCase()})
    {
      $data = $this->prepareData($${model.name.toLowerCase()});
      $template = storage_path('app/public/uploads/${action.options.template}');
      $templateProcessor = new \\PhpOffice\\PhpWord\\TemplateProcessor($template);
  
      // Replace variables
      $templateProcessor->setValues($data);
  
      // Send the file
      $path = storage_path('app/public/uploads/${model.name.toLowerCase()}_' . $${model.name.toLowerCase()}->id . '.docx');
      $templateProcessor->saveAs($path);
  
      ${!!action.options.convert_to_pdf ? `// Set the PDF Engine Renderer Path
      $domPdfPath = base_path('vendor/dompdf/dompdf');
      \\PhpOffice\\PhpWord\\Settings::setPdfRendererPath($domPdfPath);
      \\PhpOffice\\PhpWord\\Settings::setPdfRendererName('DomPDF');
            
      // Load word file
      $Content = \\PhpOffice\\PhpWord\\IOFactory::load($path); 
    
      // Save it into PDF
      $PDFWriter = \\PhpOffice\\PhpWord\\IOFactory::createWriter($Content,'PDF');
      $PDFWriter->save(storage_path('app/public/uploads/${model.name.toLowerCase()}_' . $${model.name.toLowerCase()}->id . '.pdf'));
      unlink($path);
      return response()->download(storage_path('app/public/uploads/${model.name.toLowerCase()}_' . $${model.name.toLowerCase()}->id . '.pdf'))->deleteFileAfterSend(${!!!action.options.save_on_disc});`
      : `ob_end_clean();
      return response()->download($path)->deleteFileAfterSend(${!!!action.options.save_on_disc});`}
    }
  
    public function prepareData(${model.name} $model)
    {
        return [
            ${this.prepareData(action)}
        ];
    }`;
    return content;
  }
  
 prepareData(action: any) {
    let content = '';
    content = action.options.data.map((element: any) => `'${element.placeholder}' => $model->${element.value},\n`);
    return content;
  }

}