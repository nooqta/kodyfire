import { classify } from "@angular-devkit/core/src/utils/strings";
import { IConcept, ITechnology, Source, Technology, TemplateSchema } from "kodyfire-core";
import { Engine } from "./engine";

export class Model implements IConcept {
    name: string;
    defaultAction: string;
    source?: Source | undefined;
    template: TemplateSchema;
    outputDir: string;
    technology: Technology;
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
        this.engine.builder.registerHelper("getModelRelations", () => {
            return this.getModelRelations(_data);
        });
        this.engine.builder.registerHelper("getHiddenArray", () => {
            return this.getHiddenArray(_data);
        });

        this.engine.builder.registerHelper("fillable", () => {
            return this.getFillable(_data);
        });

        const template = this.engine.read(this.template.path, _data.template);
        const compiled = this.engine.compile(template, _data);
        this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir,this.getFilename(_data.name), compiled)
    }

    
  
    getFilename(name: any, ) {
        return `${classify(name)}.php`;
    }
    
    getModelRelations(model: any): string {
        let relations = '';
        model.relationships.forEach((rel: any) => {

            if (rel.type === 'morphTo') {
                relations += `
    public function ${rel.name}()
    {
        return $this->${rel.type}();
    }\n`;
            } else {

    relations += `
    public function ${rel.name}()
    {
        return $this->${rel.type}(${this.getRelationArgs(rel)});
    }\n`;
            }

        });
        return relations;
    }

    getFillable (model: any): string {
        return JSON.stringify(model.fillable)
    }

    getRelationArgs(rel: any): string {
        let args = '';
        if (rel.model != "" && rel.arguments != "" && rel.arguments && rel.arguments.length > 0) {
            args = `${rel.model}::class, '${rel.arguments}'`
        } else if (rel.model != "") {
            args = `${rel.model}::class`
        }
        return args;
    }

    getHiddenArray(model: any): string {
        let hidden = '';
        if (model.isMorph) {
            hidden = `'${model.name.toLowerCase()}able_id','${model.name.toLowerCase()}able_type'`
        }
        return hidden;
    }

}