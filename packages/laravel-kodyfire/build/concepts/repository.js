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
exports.Repository = void 0;
const strings_1 = require("@angular-devkit/core/src/utils/strings");
const path_1 = require("path");
const concept_1 = require("./concept");
const engine_1 = require("./engine");
const pluralize = require('pluralize');
class Repository extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine() {
        this.engine = new engine_1.Engine();
        this.engine.builder.registerHelper('hasUplodableMorph', () => {
            return this.hasUplodableMorph(this.model);
        });
        this.engine.builder.registerHelper('hasBeforeEvent', (action, options) => {
            const currentAction = this.model.controller.actions.find((a) => a.name == action);
            if (currentAction && typeof currentAction.beforeEvent != 'undefined')
                return options.fn(this);
            return null;
        });
        this.engine.builder.registerHelper('beforeEvent', (action) => {
            const currentAction = this.model.controller.actions.find((a) => a.name == action);
            return `\\App\\Events\\${currentAction.beforeEvent.name}::dispatch(${currentAction.beforeEvent.args});`;
        });
        this.engine.builder.registerHelper('hasAfterEvent', (action, options) => {
            const currentAction = this.model.controller.actions.find((a) => a.name == action);
            if (currentAction && typeof currentAction.afterEvent != 'undefined')
                return options.fn(this);
            return null;
        });
        this.engine.builder.registerHelper('afterEvent', (action) => {
            const currentAction = this.model.controller.actions.find((a) => a.name == action);
            return `\\App\\Events\\${currentAction.afterEvent.name}::dispatch(${currentAction.afterEvent.args});`;
        });
        this.engine.builder.registerHelper('getAttachments', () => {
            return this.getAttachments(this.model);
        });
        this.engine.builder.registerHelper('getUpdateAttachments', () => {
            return this.getUpdateAttachments(this.model);
        });
        this.engine.builder.registerHelper('uploadAttachment', () => {
            return this.uploadAttachment(this.model);
        });
        this.engine.builder.registerHelper('getMorphAttachments', () => {
            return this.getMorphAttachments(this.model);
        });
        this.engine.builder.registerHelper('getAdditionalMethods', () => {
            return this.getAdditionalMethods(this.model);
        });
    }
    setModel(_data) {
        this.model = this.technology.input.model.find((m) => m.name.toLowerCase() == _data.model.toLowerCase());
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setModel(_data);
            this.initEngine();
            const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
            this.model.attachments = this.getAttachments(this.model);
            this.model.morphAttachments = this.getMorphAttachments(this.model);
            this.model.additionalMethods = this.getAdditionalMethods(this.model);
            this.model.updateAttachments = this.getUpdateAttachments(this.model);
            this.model.uploadAttachment = this.uploadAttachment(this.model);
            this.model.methods = yield this.getMethods(this.model, _data);
            this.model.model = this.model.name;
            this.model.relations = _data.relations || [];
            const compiled = this.engine.compile(template, Object.assign(Object.assign({}, this.model), _data));
            if (!this.model) {
                const filename = _data.template === 'repositoryParent.php.template'
                    ? 'Repository.php'
                    : 'Repositories.php';
                this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, filename, compiled);
            }
            this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(this.model.name), compiled);
        });
    }
    getMethods(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let methods = '';
            for (const action of model.controller.actions) {
                switch (action.type) {
                    case 'storeWithManyRelation':
                        methods += `${yield this.engine.getPartial(this.template.path, 'app/Repositories/storeWithManyRelation.template', Object.assign(Object.assign({}, action), data))}\n`;
                        break;
                    case 'updateWithManyRelation':
                        methods += `${yield this.engine.getPartial(this.template.path, 'app/Repositories/updateWithManyRelation.template', Object.assign(Object.assign({}, action), data))}\n`;
                        break;
                    case 'store':
                        methods += `${yield this.engine.getPartial(this.template.path, 'app/Repositories/store.template', Object.assign(Object.assign({}, action), data))}\n`;
                        break;
                    case 'update':
                        methods += `${yield this.engine.getPartial(this.template.path, 'app/Repositories/update.template', Object.assign(Object.assign({}, action), data))}\n`;
                        break;
                }
            }
            return methods;
        });
    }
    getFilename(name) {
        return `${(0, strings_1.classify)(name)}Repository.php`;
    }
    hasUplodableMorph(model) {
        return model.relationships.some((r) => ['morphOne', 'morphMany'].includes(r.type) && !!r.uploadable);
    }
    getAdditionalMethods(model) {
        let content = '';
        if (model.controller.with_additional_relations &&
            model.controller.with_additional_relations.length > 0) {
            model.controller.with_additional_relations.forEach((relation) => {
                content += this.getMethod(relation);
            });
        }
        return content;
    }
    getMethod(relation) {
        let content = '';
        switch (relation.type) {
            case 'hasMany':
                content = `if(isset($data['${this.underscorize(relation.name)}'])){
                      $model->${relation.name}()->createMany($data['${this.underscorize(relation.name)}']);
                  }\n`;
                break;
            case 'hasOne':
                content = `if(isset($data['${this.underscorize(relation.name)}'])){
                      $model->${relation.name}()->create($data['${this.underscorize(relation.name)}']);
                  }\n`;
                break;
            default:
                break;
        }
        return content;
    }
    getMorphAttachments(model) {
        let attachments = '';
        model.relationships.forEach((element) => {
            if (['morphOne', 'morphMany'].includes(element.type) &&
                !!element.uploadable) {
                model.fields.forEach((f) => {
                    if (f.faker_type == 'file' ||
                        f.faker_type == 'image' ||
                        f.faker_type == 'video') {
                        attachments += `
                        if(request()->file('${f.name}')){
                            $path = $this->addAttachment(request()->file('${f.name}'), '${f.faker_type}');
                            $model->${element.name}()->create(['uri' => $path]);
                        }\n`;
                    }
                });
            }
        });
        return attachments;
    }
    getAttachments(model) {
        let attachments = '';
        model.fields.forEach((element) => {
            if (element.faker_type == 'file' ||
                element.faker_type == 'image' ||
                element.faker_type == 'video') {
                attachments += `
                if(isset($data['${element.name}']) && $data['${element.name}']){
                    $data['${element.name}'] = $this->addAttachment($data['${element.name}'], '${element.faker_type}');
                }\n`;
            }
        });
        return attachments;
    }
    getUpdateAttachments(model) {
        let attachments = '';
        model.fields.forEach((element) => {
            if (element.faker_type == 'file') {
                attachments += `
                if(isset($data['${element.name}']) && $data['${element.name}']){
                    $data['${element.name}'] = $this->updateAttachment($model, $data['${element.name}'], '${element.name}');
                }\n`;
            }
        });
        return attachments;
    }
    uploadAttachment(model) {
        let uploadMethods = '';
        if (model.fields.filter((e) => e.faker_type == 'file').length > 0) {
            uploadMethods = `
            public function addAttachment($file, $type)
            {
                $filePath = ('public/uploads/${pluralize(model.name.toLowerCase())}/');
                $filename = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $newFilename = $filename . '-' . uniqid();
                $fullPath = $filePath . $newFilename . '.' . $extension;
        
                if ($file->storeAs($filePath, $newFilename . '.' . $extension)) {
                    $path = $this->disk()->url($fullPath);
                }
        
                return $path;
            }
      
            public function updateAttachment(${model.name} $model, $file, $field)
              {
                  //Delete old attachment
                  if($model->{$field}){
                          $fileuri = str_replace('/storage', '', $model->{$field});
                          Storage::disk('public')->delete($fileuri);
                  }
      
                  $filePath = ('public/uploads/${pluralize(model.name.toLowerCase())}/');
                  $filename = $file->getClientOriginalName();
                  $extension = $file->getClientOriginalExtension();
                  $newFilename = $filename . '-' . uniqid();
                  $fullPath = $filePath . $newFilename . '.' . $extension;
      
                  if ($file->storeAs($filePath, $newFilename . '.' . $extension)) {
                      $path = $this->disk()->url($fullPath);
                  }
      
                  return $path;
              }
            
            `;
        }
        return uploadMethods;
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map