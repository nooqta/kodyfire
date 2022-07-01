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
exports.Auth = void 0;
const concept_1 = require("./concept");
const engine_1 = require("./engine");
class Auth extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine() {
        this.engine = new engine_1.Engine();
        this.engine.builder.registerHelper('configs', () => {
            return this.getProjectConfigs();
        });
        this.engine.builder.registerHelper('project', () => {
            return this.technology.input.project;
        });
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initEngine();
            const template = yield this.engine.read(this.template.path, _data.template);
            const compiled = this.engine.compile(template, this.model);
            let outputDir;
            let filename;
            if ([
                'fortify.php.template',
                'sanctum.php.template',
                'cors.php.template',
                'app.php.template',
                'auth.php.template',
                'config.php.template',
            ].includes(_data.template)) {
                outputDir = 'config';
                filename = `${_data.template.replace('.php.template', '')}.php`;
                if (filename === 'config') {
                    filename = `${this.technology.input.project}.php`;
                }
            }
            else if (_data.template === 'provider.php.template') {
                outputDir = 'app/Providers';
                filename = 'AppServiceProvider.php';
            }
            else if (_data.template === 'reset.php.template') {
                outputDir = 'app/Actions/Fortify';
                filename = 'ResetUserPassword.php';
            }
            else {
                outputDir = 'app/Http/Middleware';
                filename = 'RedirectIfAuthenticated.php';
            }
            yield this.engine.createOrOverwrite(this.technology.rootDir, outputDir, filename, compiled);
        });
    }
    getProjectConfigs() {
        return this.technology.input.config
            .map(({ key, value }) => {
            return `'${key}' => ${value},`;
        })
            .join('\n');
    }
}
exports.Auth = Auth;
//# sourceMappingURL=auth.js.map