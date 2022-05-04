import { classify } from '@angular-devkit/core/src/utils/strings';
import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';
const pluralize = require('pluralize');
export class Repository extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine() {
    this.engine = new Engine();

    this.engine.builder.registerHelper('hasUplodableMorph', () => {
      return this.hasUplodableMorph(this.model);
    });
    this.engine.builder.registerHelper(
      'hasBeforeEvent',
      (action: string, options: any) => {
        const currentAction = this.model.controller.actions.find(
          (a: any) => a.name == action
        );
        if (currentAction && typeof currentAction.beforeEvent != 'undefined')
          return options.fn(this);
        return null;
      }
    );
    this.engine.builder.registerHelper('beforeEvent', (action: string) => {
      const currentAction = this.model.controller.actions.find(
        (a: any) => a.name == action
      );
      return `\\App\\Events\\${currentAction.beforeEvent.name}::dispatch(${currentAction.beforeEvent.args});`;
    });
    this.engine.builder.registerHelper(
      'hasAfterEvent',
      (action: string, options: any) => {
        const currentAction = this.model.controller.actions.find(
          (a: any) => a.name == action
        );
        if (currentAction && typeof currentAction.afterEvent != 'undefined')
          return options.fn(this);
        return null;
      }
    );
    this.engine.builder.registerHelper('afterEvent', (action: string) => {
      const currentAction = this.model.controller.actions.find(
        (a: any) => a.name == action
      );
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
  setModel(_data: any) {
    this.model = this.technology.input.model.find(
      (m: any) => m.name.toLowerCase() == _data.model.toLowerCase()
    );
  }
  async generate(_data: any) {
    this.setModel(_data);
    this.initEngine();
    const template = await this.engine.read(this.template.path, _data.template);
    this.model.attachments = this.getAttachments(this.model);
    this.model.morphAttachments = this.getMorphAttachments(this.model);
    this.model.additionalMethods = this.getAdditionalMethods(this.model);
    this.model.updateAttachments = this.getUpdateAttachments(this.model);
    this.model.uploadAttachment = this.uploadAttachment(this.model);
    const compiled = this.engine.compile(template, this.model);

    if (!this.model) {
      const filename =
        _data.template === 'repositoryParent.php.template'
          ? 'Repository.php'
          : 'Repositories.php';
      this.engine.createOrOverwrite(
        this.technology.rootDir,
        this.outputDir,
        filename,
        compiled
      );
    }
    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(this.model.name),
      compiled
    );
  }

  getFilename(name: any) {
    return `${classify(name)}Repository.php`;
  }

  hasUplodableMorph(model: any) {
    return model.relationships.some(
      (r: any) => ['morphOne', 'morphMany'].includes(r.type) && !!r.uploadable
    );
  }

  getAdditionalMethods(model: any) {
    let content = '';
    if (
      model.controller &&
      model.controller != '' &&
      model.controller.with_additional_relations &&
      model.controller.with_additional_relations != '' &&
      model.controller.with_additional_relations.length > 0
    ) {
      model.controller.with_additional_relations.forEach((element: any) => {
        content += this.getMethod(element);
      });
    }
    return content;
  }

  getMethod(relation: any) {
    let content = '';
    switch (Object.keys(relation)[0]) {
      case 'hasMany':
        content = `if(isset($data['${this.underscorize(
          Object.values(relation)[0]
        )}'])){
                      $model->${
                        Object.values(relation)[0]
                      }()->createMany($data['${this.underscorize(
          Object.values(relation)[0]
        )}']);
                  }\n`;
        break;

      default:
        break;
    }
    return content;
  }

  getMorphAttachments(model: any) {
    let attachments = '';
    model.relationships.forEach((element: any) => {
      if (
        ['morphOne', 'morphMany'].includes(element.type) &&
        !!element.uploadable
      ) {
        model.fields.forEach((f: any) => {
          if (
            f.faker_type == 'file' ||
            f.faker_type == 'image' ||
            f.faker_type == 'video'
          ) {
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

  getAttachments(model: any) {
    let attachments = '';
    model.fields.forEach((element: any) => {
      if (
        element.faker_type == 'file' ||
        element.faker_type == 'image' ||
        element.faker_type == 'video'
      ) {
        attachments += `
                if(isset($data['${element.name}']) && $data['${element.name}']){
                    $data['${element.name}'] = $this->addAttachment($data['${element.name}'], '${element.faker_type}');
                }\n`;
      }
    });
    return attachments;
  }

  getUpdateAttachments(model: any) {
    let attachments = '';
    model.fields.forEach((element: any) => {
      if (element.faker_type == 'file') {
        attachments += `
                if(isset($data['${element.name}']) && $data['${element.name}']){
                    $data['${element.name}'] = $this->updateAttachment($model, $data['${element.name}'], '${element.name}');
                }\n`;
      }
    });
    return attachments;
  }

  uploadAttachment(model: any) {
    let uploadMethods = '';
    if (model.fields.filter((e: any) => e.faker_type == 'file').length > 0) {
      uploadMethods = `
            public function addAttachment($file, $type)
            {
                $filePath = ('public/uploads/${pluralize(
                  model.name.toLowerCase()
                )}/');
                $filename = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $newFilename = $filename . '-' . uniqid();
                $fullPath = $filePath . $newFilename . '.' . $extension;
        
                if ($file->storeAs($filePath, $newFilename . '.' . $extension)) {
                    $path = $this->disk()->url($fullPath);
                }
        
                return $path;
            }
      
            public function updateAttachment(${
              model.name
            } $model, $file, $field)
              {
                  //Delete old attachment
                  if($model->{$field}){
                          $fileuri = str_replace('/storage', '', $model->{$field});
                          Storage::disk('public')->delete($fileuri);
                  }
      
                  $filePath = ('public/uploads/${pluralize(
                    model.name.toLowerCase()
                  )}/');
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
