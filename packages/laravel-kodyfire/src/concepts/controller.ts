/* @ts-nocheck */
import { strings } from '@angular-devkit/core';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { IConcept, ITechnology, Source, TemplateSchema } from 'kodyfire-core';
import { Engine } from './engine';

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
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    this.source = concept.source ?? Source.Template;
    this.outputDir = concept.outputDir ?? '';
    this.name = concept.name ?? '';
    this.template = concept.template as TemplateSchema;
    this.technology = technology;
  }

  setModel(_data: any) {
    this.model = this.technology.input.model.find(
      (m: any) => m.name.toLowerCase() == _data.model.toLowerCase()
    );
    this.model.controller = _data;
  }
  async generate(_data: any) {
    this.setModel(_data);
    this.engine = new Engine();
    console.log(_data);

    const template = await this.engine.read(this.template.path, _data.template);
    _data.methods = await this.getControllerMethods(this.model);
    _data.name = _data.model;
    _data.controller = this.model.controller;
    const compiled = this.engine.compile(template, _data);
    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data.model),
      compiled
    );
  }

  getFilename(name: any) {
    return `${classify(name)}Controller.php`;
  }

  getWith(fields: any) {
    return fields && `$data->with(${fields});`;
  }
  getList(model: any): string {
    let fieldsToLoad = model.load ? `${model.load}` : '';
    if (model.relationships.length > 0) {
      fieldsToLoad = [
        fieldsToLoad,
        ...model.relationships
          .filter(
            (relation: any) =>
              relation.type != 'morphOne' &&
              relation.type != 'morphTo' &&
              relation.type != 'morphMany'
          )
          .map((field: any) => {
            const relation: string = field['name'];
            return `'${relation}'`;
          }),
      ]
        .filter(item => item.length > 0)
        .join(',');
    }
    const action = model.controller.actions.find(
      (a: any) => a.name === 'getAll' || a.name === 'index'
    );

    let load = '';

    if (!!action && !!action.load && Array.isArray(action.load)) {
      load =
        '$data->load(' +
        action.load.map((l: any) => `'${l}'`).join(', ') +
        ');';
    }

    const data = `$pageSize = $request->query('pageSize');
    $currentPage = $request->query('currentPage');
    $search = $request->query('q');
    ${this.getFilters(action)}
    Paginator::currentPageResolver(function () use ($currentPage) {
      return $currentPage;
    });
    
    $data = ${model.name}::query();
    ${this.getFilterWhereClause(action)}
    if($search != ""){
      $data = $data->where(function($q) use($search) {
        ${this.getWhereClause(action)}
        }
      );
    }
    ${this.getWith(fieldsToLoad)}
    ${load}
    ${this.getPaginate(model, action)}
    `;

    return data;
  }
  getPaginate(model: any, action: any) {
    if (action.useResource) {
      return `$data = new \\App\\Http\\Resources\\${strings.classify(
        model.name
      )}Collection($data->paginate($pageSize));`;
    }
    return `$data = $data->paginate($pageSize);`;
  }

  getWhereClause(action: any) {
    return action.searchBy
      .map(
        (field: any) =>
          `$q->orWhere('${field.name}', '${field.type}', "%{$search}%");`
      )
      .join(';\n ');
  }

  getFilters(action: any) {
    let filters = '';
    if (action.filterBy) {
      action.filterBy.forEach((filter: any) => {
        filters += filter.relation
          ? `
        $${filter.relation} = $request->query('${filter.relation}');`
          : `$${filter.field} = $request->query('${filter.field}');`;
      });
    }
    return filters;
  }

  getFilterWhereClause(action: any) {
    let whereClause = '';
    if (action.filterBy) {
      action.filterBy.forEach((filter: any) => {
        if (filter.relation) {
          whereClause += `
        if($${filter.relation} != ""){
          $data->whereHas('${filter.relationName}', function ($q) use ($${filter.relation}) {
            $q->where('${filter.field}', '${filter.type}', "{$${filter.relation}}");
          });
        }\n`;
        } else {
          whereClause += `
          if($${filter.field} != ""){
            $data->where('${filter.field}', '${filter.type}', "{$${filter.field}}");
          }\n`;
        }
      });
    }
    return whereClause;
  }
  getUserRelations(relations: Array<string>) {
    return relations.join('->');
  }

  async getControllerMethods(model: any): Promise<string> {
    let methods = '';
    for (const action of model.controller.actions) {
      switch (action.type) {
        case 'getUserRelation':
          methods += `${await this.engine.getPartial(
            this.template.path,
            'app/Controllers/getUserRelation.template',
            { ...action, model: model.name }
          )}\n`;
          break;
        case 'storeWithManyRelation':
          methods += `${await this.engine.getPartial(
            this.template.path,
            'app/Controllers/storeWithManyRelation.template',
            { ...action, model: model.name }
          )}\n`;
          break;
        case 'updateWithManyRelation':
          methods += `${await this.engine.getPartial(
            this.template.path,
            'app/Controllers/updateWithManyRelation.template',
            { ...action, model: model.name }
          )}\n`;
          break;
        case 'downloadPDF':
          methods += `${await this.engine.getPartial(
            this.template.path,
            'app/Controllers/downloadPDF.template',
            { ...action, model: model.name }
          )}\n`;
          break;
        case 'index':
          methods += `
public function ${action.name}(Request  $request) {
  try {
    ${this.getList(model)}
  } catch (\\Throwable $th) {
    return response()->json([
    'error' => config('app.env') == 'local'? $th->getMessage(): __('app.errorMsg'),
    ], 500);
  }
  return response()->json($data);
}\n`;
          break;
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
    }\n`;
          break;
        case 'show':
          methods += `
    public function ${action.name}(${model.name} $${model.name.toLowerCase()})
    {
      try {
        $data = $${model.name.toLowerCase()};
      } catch (\\Throwable $th) {
        Log::error($th->getMessage());
          return response()->json([
              'error' => __('app.errorMsg'),
          ], 500);
      }
      ${action.useResource ? this.useResource(action, model) : ''}
      return response()->json(['data' => $data]);
    }\n`;
          break;
        case 'getByUser':
          methods += `
    public function getByUser()
    {
      try {
        $user = auth()->user();
        $${
          action.route.relations[action.route.relations.length - 1]
        } = $user->${this.getUserRelations(action.route.relations)};
        
        $data = $${model.name.toLowerCase()};
      } catch (\\Throwable $th) {
        Log::error($th->getMessage());
          return response()->json([
              'error' => __('app.errorMsg'),
          ], 500);
      }
      return response()->json(['data' => $data]);
    }\n`;
          break;
        case 'update':
          methods += `
    public function ${action.name}(Update${model.name}Request $request, ${
            model.name
          } $${model.name.toLowerCase()}, ${model.name}Repository $repository) {
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
      }\n`;
          break;
        case 'destroy':
          methods += `
    public function ${action.name}(${model.name} $${model.name.toLowerCase()}) {
    try {
        ${this.deleteAttachments(model)}
        $${model.name.toLowerCase()}->delete();
    } catch (\\Exception $e) {
        Log::error($e->getMessage());
            return response()->json([
        'error' => __('app.errorMsg'),
        ], 500);
    }
    $message = trans('app.deleteSuccessMsg');
    return response()->json(['message' => $message], 200);
    }\n`;
          break;
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
          break;
        case 'generate':
          methods += this.getGenerateDocumentMethod(action, model);
          break;
        default:
      }
    }
    return methods;
  }
  useResource(action: any, model: any) {
    if (action.useResource) {
      return `$data = new \\App\\Http\\Resources\\${strings.classify(
        model.name
      )}Resource($data);`;
    }
  }

  deleteAttachments(model: any): string {
    let attachmentsToDelete = '';
    if (model.fields.filter((e: any) => e.faker_type == 'file').length > 0) {
      model.fields.forEach((element: any) => {
        if (element.faker_type == 'file') {
          attachmentsToDelete += `
                  if($${model.name.toLowerCase()}->${element.name}){
                      $fileuri = str_replace('/storage', '', $${model.name.toLowerCase()}->${
            element.name
          });
                      Storage::disk('public')->delete($fileuri);
                  }\n`;
        }
      });
    }
    return attachmentsToDelete;
  }

  deleteManyAttachments(model: any): string {
    let attachmentsToDelete = '';
    if (model.fields.filter((e: any) => e.faker_type == 'file').length > 0) {
      attachmentsToDelete = `
          foreach ($ids as $id) {
            $${model.name.toLowerCase()} = ${model.name}::find($id);
            ${this.deleteAttachments(model)}
          }`;
    }
    return attachmentsToDelete;
  }

  getGenerateDocumentMethod(action: any, model: any) {
    const content = `\npublic function ${action.name}(${
      model.name
    } $${model.name.toLowerCase()})
    {
      $data = $this->prepareData($${model.name.toLowerCase()});
      $template = resource_path('templates/${action.options.template}');
      $templateProcessor = new \\PhpOffice\\PhpWord\\TemplateProcessor($template);
  
      // Replace variables
      $templateProcessor->setValues($data);
  
      // Send the file
      $path = storage_path('app/public/uploads/${model.name.toLowerCase()}_' . $${model.name.toLowerCase()}->id . '.docx');
      $templateProcessor->saveAs($path);
  
      ${
        action.options.convert_to_pdf
          ? `// Set the PDF Engine Renderer Path
      $domPdfPath = base_path('vendor/dompdf/dompdf');
      \\PhpOffice\\PhpWord\\Settings::setPdfRendererPath($domPdfPath);
      \\PhpOffice\\PhpWord\\Settings::setPdfRendererName('DomPDF');
            
      // Load word file
      $Content = \\PhpOffice\\PhpWord\\IOFactory::load($path); 
    
      // Save it into PDF
      $PDFWriter = \\PhpOffice\\PhpWord\\IOFactory::createWriter($Content,'PDF');
      $PDFWriter->save(storage_path('app/public/uploads/${model.name.toLowerCase()}_' . $${model.name.toLowerCase()}->id . '.pdf'));
      unlink($path);
      return response()->download(storage_path('app/public/uploads/${model.name.toLowerCase()}_' . $${model.name.toLowerCase()}->id . '.pdf'))->deleteFileAfterSend(${!action
              .options.save_on_disc});`
          : `ob_end_clean();
      return response()->download($path)->deleteFileAfterSend(${!action.options
        .save_on_disc});`
      }
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
    content = action.options.data.map(
      (element: any) =>
        `'${element.placeholder}' => $model->${element.value},\n`
    );
    return content;
  }
}
