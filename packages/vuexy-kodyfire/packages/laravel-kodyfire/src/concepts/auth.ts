import { IConcept, ITechnology } from "kodyfire-core";
import { Concept } from "./concept";
import { Engine } from "./engine";

export class Auth extends Concept{
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology) {
        super(concept, technology)  
    }
    
    initEngine() {
        this.engine = new Engine();

        this.engine.builder.registerHelper("configs", () => {
            return this.getProjectConfigs();
        });

        this.engine.builder.registerHelper("project", () => {
            return this.technology.input.project;
        });

    }

    async generate(_data: any) {
        this.initEngine();
        const template = await this.engine.read(this.template.path, _data.template);
        const compiled = this.engine.compile(template, this.model);
        let outputDir
        let filename

        if (
            [
                'fortify.php.template',
                'sanctum.php.template',
                'cors.php.template',
                'app.php.template',
                'auth.php.template',
                'config.php.template',
            ].includes(_data.template)
        ) {
            outputDir = 'config'
            filename = `${(_data.template as string).replace('.php.template', '')}.php`
            if (filename === 'config') {
                filename = `${this.technology.input.project}.php`
            }

        } else if (_data.template === 'provider.php.template') {
            outputDir = 'app/Providers'
            filename = 'AppServiceProvider.php'
        } else if (_data.template === 'reset.php.template') {
            outputDir = 'app/Actions/Fortify'
            filename = 'ResetUserPassword.php'
        } else {
            outputDir = 'app/Http/Middleware'
            filename = 'RedirectIfAuthenticated.php'
        }

        this.engine.createOrOverwrite(this.technology.rootDir, outputDir, filename, compiled)
    }
      
    getProjectConfigs(): string {
        return this.technology.input.config.map(({ key, value }: { key: string, value: string }) => {
            return `'${key}' => ${value},`
        }).join('\n')
    }

}