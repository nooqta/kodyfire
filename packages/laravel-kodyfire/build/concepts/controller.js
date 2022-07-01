"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
/* @ts-nocheck */
const core_1 = require("@angular-devkit/core");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
const kodyfire_core_1 = require("kodyfire-core");
const engine_1 = require("./engine");
/* @ts-ignore */
class Controller {
    constructor(concept, technology) {
        var _a, _b, _c;
        this.source = (_a = concept.source) !== null && _a !== void 0 ? _a : kodyfire_core_1.Source.Template;
        this.outputDir = (_b = concept.outputDir) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = concept.name) !== null && _c !== void 0 ? _c : '';
        this.template = concept.template;
        this.technology = technology;
    }
    setModel(_data) {
        this.model = this.technology.input.model.find((m) => m.name.toLowerCase() == _data.model.toLowerCase());
        this.model.controller = _data;
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setModel(_data);
            this.engine = new engine_1.Engine();
            const template = yield this.engine.read(this.template.path, _data.template);
            _data.methods = yield this.getControllerMethods(this.model);
            _data.name = _data.model;
            _data.controller = this.model.controller;
            const compiled = this.engine.compile(template, _data);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data.model), compiled);
        });
    }
    getFilename(name) {
        return `${(0, strings_1.classify)(name)}Controller.php`;
    }
    getWith(fields) {
        return fields && `$data->with(${fields});`;
    }
    getList(model) {
        let fieldsToLoad = model.load ? `${model.load}` : '';
        if (model.relationships.length > 0) {
            fieldsToLoad = [
                fieldsToLoad,
                ...model.relationships
                    .filter((relation) => relation.type != 'morphOne' &&
                    relation.type != 'morphTo' &&
                    relation.type != 'morphMany')
                    .map((field) => {
                    const relation = field['name'];
                    return `'${relation}'`;
                }),
            ]
                .filter(item => item.length > 0)
                .join(',');
        }
        const action = model.controller.actions.find((a) => a.name === 'getAll' || a.name === 'index');
        let load = '';
        if (!!action && !!action.load && Array.isArray(action.load)) {
            load =
                '$data->load(' +
                    action.load.map((l) => `'${l}'`).join(', ') +
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
    getPaginate(model, action) {
        if (action.useResource) {
            return `$data = new \\App\\Http\\Resources\\${core_1.strings.classify(model.name)}Collection($data->paginate($pageSize));`;
        }
        return `$data = $data->paginate($pageSize);`;
    }
    getWhereClause(action) {
        return action.searchBy
            .map((field) => `$q->orWhere('${field.name}', '${field.type}', "%{$search}%");`)
            .join(';\n ');
    }
    getFilters(action) {
        let filters = '';
        if (action.filterBy) {
            action.filterBy.forEach((filter) => {
                filters += filter.relation
                    ? `
        $${filter.relation} = $request->query('${filter.relation}');`
                    : `$${filter.field} = $request->query('${filter.field}');`;
            });
        }
        return filters;
    }
    getFilterWhereClause(action) {
        let whereClause = '';
        if (action.filterBy) {
            action.filterBy.forEach((filter) => {
                if (filter.relation) {
                    whereClause += `
        if($${filter.relation} != ""){
          $data->whereHas('${filter.relationName}', function ($q) use ($${filter.relation}) {
            $q->where('${filter.field}', '${filter.type}', "{$${filter.relation}}");
          });
        }\n`;
                }
                else {
                    whereClause += `
          if($${filter.field} != ""){
            $data->where('${filter.field}', '${filter.type}', "{$${filter.field}}");
          }\n`;
                }
            });
        }
        return whereClause;
    }
    getUserRelations(relations) {
        return relations.join('->');
    }
    getControllerMethods(model) {
        return __awaiter(this, void 0, void 0, function* () {
            let methods = '';
            for (const action of model.controller.actions) {
                switch (action.type) {
                    case 'getUserRelation':
                        methods += `${yield this.engine.getPartial(this.template.path, 'app/Controllers/getUserRelation.template', Object.assign(Object.assign({}, action), { model: model.name }))}\n`;
                        break;
                    case 'storeWithManyRelation':
                        methods += `${yield this.engine.getPartial(this.template.path, 'app/Controllers/storeWithManyRelation.template', Object.assign(Object.assign({}, action), { model: model.name }))}\n`;
                        break;
                    case 'updateWithManyRelation':
                        methods += `${yield this.engine.getPartial(this.template.path, 'app/Controllers/updateWithManyRelation.template', Object.assign(Object.assign({}, action), { model: model.name }))}\n`;
                        break;
                    case 'downloadPDF':
                        methods += `${yield this.engine.getPartial(this.template.path, 'app/Controllers/downloadPDF.template', Object.assign(Object.assign({}, action), { model: model.name }))}\n`;
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
        $${action.route.relations[action.route.relations.length - 1]} = $user->${this.getUserRelations(action.route.relations)};
        
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
        });
    }
    useResource(action, model) {
        if (action.useResource) {
            return `$data = new \\App\\Http\\Resources\\${core_1.strings.classify(model.name)}Resource($data);`;
        }
    }
    deleteAttachments(model) {
        let attachmentsToDelete = '';
        if (model.fields.filter((e) => e.faker_type == 'file').length > 0) {
            model.fields.forEach((element) => {
                if (element.faker_type == 'file') {
                    attachmentsToDelete += `
                  if($${model.name.toLowerCase()}->${element.name}){
                      $fileuri = str_replace('/storage', '', $${model.name.toLowerCase()}->${element.name});
                      Storage::disk('public')->delete($fileuri);
                  }\n`;
                }
            });
        }
        return attachmentsToDelete;
    }
    deleteManyAttachments(model) {
        let attachmentsToDelete = '';
        if (model.fields.filter((e) => e.faker_type == 'file').length > 0) {
            attachmentsToDelete = `
          foreach ($ids as $id) {
            $${model.name.toLowerCase()} = ${model.name}::find($id);
            ${this.deleteAttachments(model)}
          }`;
        }
        return attachmentsToDelete;
    }
    getGenerateDocumentMethod(action, model) {
        const content = `\npublic function ${action.name}(${model.name} $${model.name.toLowerCase()})
    {
      $data = $this->prepareData($${model.name.toLowerCase()});
      $template = resource_path('templates/${action.options.template}');
      $templateProcessor = new \\PhpOffice\\PhpWord\\TemplateProcessor($template);
  
      // Replace variables
      $templateProcessor->setValues($data);
  
      // Send the file
      $path = storage_path('app/public/uploads/${model.name.toLowerCase()}_' . $${model.name.toLowerCase()}->id . '.docx');
      $templateProcessor->saveAs($path);
  
      ${action.options.convert_to_pdf
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
                .save_on_disc});`}
    }
  
    public function prepareData(${model.name} $model)
    {
        return [
            ${this.prepareData(action)}
        ];
    }`;
        return content;
    }
    prepareData(action) {
        let content = '';
        content = action.options.data.map((element) => `'${element.placeholder}' => $model->${element.value},\n`);
        return content;
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map