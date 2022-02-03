import { IConcept, ITechnology } from "kodyfire-core";
import { Concept } from "./concept";
import { Engine } from "./engine";
import { strings } from "@angular-devkit/core";

const moment = require('moment')

const pluralize = require('pluralize')

export class Migration extends  Concept{
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology) {
        super(concept, technology)  
    }
    
    initEngine() {
        this.engine = new Engine();
        
        this.engine.builder.registerHelper("class", () => {
            return this.getMigrationName(this.model);
        });

        this.engine.builder.registerHelper("attributes", () => {
            return this.getMigrationAttributes(this.model);
        });
  
    }
    setModel(_data: any) {
        // @todo find a better way to get the model
        if(!this.technology.input.model.some((m: any) => m.name == _data.model)) {
            throw new Error("Make sure the model exists and is not mispelled.");
        }
        this.model = this.technology.input.model.find((m: any) => m.name == _data.model);
    }
    generate(_data: any) {
        this.setModel(_data);
        this.initEngine();
        const template = this.engine.read(this.template.path, _data.template);
        const compiled = this.engine.compile(template, this.model);
        this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(this.model.name), compiled)

    }

    wait(ms: number)
    {
        const now  = moment();
        const afterXms = moment().add(ms, 'ms')
        do {
            now.add(1, 'ms')
        }while(!afterXms.isSame(now));
    }
      
    getFilename(name: any) {
        
        var date = new Date();
        var m = date.getMonth();
        var d = date.getDate();
        var y = date.getFullYear();
        var s = date.getTime()
        this.wait(1000)
        var ms = moment(date).add(300, 'milliseconds').toDate().getMilliseconds();
        return `${y}_${m}_${d}_${s}${ms}_create_${strings.dasherize(pluralize(name))}_table.php`
    }

    getMigrationName (model: any) {
        return this.underscorize(pluralize(model.name))

    }

    underscorize(word:any) {
        return word.replace(/[A-Z]/g, function(char:any, index:any) {
          return (index !== 0 ? '_' : '') + char.toLowerCase()
        })
    }

    getMigrationAttributes(model: any) {
        let data = ''
        model.fields.forEach((el: any) => {
            if (el.name.includes('_id')) {
                data += `$table->unsignedBigInteger('${el.name}')${this.getCommonOptions(el)};\n`
            } else {
                if (el.type == 'enum') {
                    data += `$table->${el.type}('${el.name}', ${JSON.stringify(el.arguments)})${this.getCommonOptions(el)};\n`
                    // data += `$table->${el.type}('${el.name}',collect(config('${name}.${el.config}'))->pluck('value')->toArray())${this.getCommonOptions(el)};\n`
                    // $table->enum('diploma', config('tanmiah.diplomas'))->nullable();
                } 
                else if(el.type == 'decimal'){
                    data += `$table->${el.type}('${el.name}', ${el.arguments.join(', ')})${this.getCommonOptions(el)};\n`
                }
                else {
                    data += `$table->${el.type}('${el.name}')${this.getCommonOptions(el)};\n`
                }
            }
        });
    
        model.foreign_keys.forEach((el: any) => {
            data += `$table->foreign('${el.column}')->references('${el.references}')->on('${el.on}')${this.getCascade(el)};\n`
        });
    
        if(model.isMorph){
            data += `$table->morphs('${model.name.toLowerCase()}able');\n`
        }
        if(model.name == 'User'){
            data += `$table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();`
        }
    
        return data;
    }

    getCommonOptions(field: any) {
        let commonOptions = '';
        field.options.forEach((op:any) => {
            if(['unique', 'nullable', 'unsigned'].includes(op.key)){
                commonOptions += `->${op.key}()`;
            }
            if(op.key == 'default'){
                if(field.type == 'boolean'){
                    commonOptions += `->default(${op.value})`;
                }
                else{
                    commonOptions += `->default("${op.value}")`;
                }
            }
        });
    
        return commonOptions;
    }

    getCascade(element: any) {
        let cascade = '';
        if (element.onDelete == 'cascade') {
            cascade += `->onDelete('cascade')`
        }
        if (element.onUpdate == 'cascade') {
            cascade += `->onUpdate('cascade')`
        }
    
        return cascade;
    }

}