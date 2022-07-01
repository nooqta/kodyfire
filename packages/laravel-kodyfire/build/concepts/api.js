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
exports.Api = void 0;
const core_1 = require("@angular-devkit/core");
const concept_1 = require("./concept");
const engine_1 = require("./engine");
class Api extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine() {
        this.engine = new engine_1.Engine();
        this.engine.builder.registerHelper('namespaces', () => {
            return this.getNameSpaces(this.technology.input.controller);
        });
        this.engine.builder.registerHelper('routes', () => {
            return this.getGroupsList(this.technology.input.model);
        });
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initEngine();
            const template = yield this.engine.read(this.template.path, _data.template);
            const compiled = this.engine.compile(template, this.model);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(), compiled);
        });
    }
    getFilename() {
        return `api.php`;
    }
    getGroupsList(models) {
        let groups = '';
        const middlewares = [];
        models.forEach((el) => {
            if (el.controller) {
                if (el.controller.routeType == 'detailed') {
                    el.controller.actions.forEach((action) => {
                        if (action.middleware != '') {
                            middlewares.push(action.middleware);
                        }
                    });
                }
                else {
                    middlewares.push(el.controller.middleware);
                }
            }
        });
        const unique = [...new Set(middlewares)];
        Array.from(unique).forEach((el) => {
            groups += `Route::group([
          'prefix' => 'v1',
          'namespace' => 'API\\V1',
          'middleware' => ${el}
        ], function () {
            Route::get('user/current', [UserController::class, 'me']);
${this.getRoutesList(el, models)}
});\n`;
        });
        return groups;
    }
    getRoutesList(group, models) {
        const routesArray = [];
        let routes = '';
        models.forEach((model) => {
            if (model.controller.routeType == 'detailed') {
                const filtredRoutes = model.controller.actions.filter((action) => action.middleware == group);
                filtredRoutes.forEach((item) => {
                    item.modelName = model.name;
                    item.routeType = model.controller.routeType;
                });
                routesArray.push(...filtredRoutes);
            }
            else {
                if (model.controller.middleware == group) {
                    routesArray.push({
                        modelName: model.name,
                        routeType: model.controller.routeType,
                    });
                }
            }
        });
        routesArray.forEach((r) => {
            if (r.routeType == 'resource') {
                routes += `Route::resource('${r.modelName.toLowerCase()}', ${r.modelName}Controller::class);\n`;
            }
            else {
                if (r.routeName) {
                    routes += `Route::${this.getRouteType(r.type)}('${r.routeName}', [${r.modelName}Controller::class, '${r.name}']);\n`;
                }
                else {
                    routes += `Route::${this.getRouteType(r.type)}('${this.getRouteUrl(r.type, r.modelName)}', [${r.modelName}Controller::class, '${r.name}']);\n`;
                }
            }
        });
        return routes;
    }
    getRouteUrl(routeType, modelName) {
        let url = '';
        switch (routeType) {
            case 'index':
            case 'store':
            case 'storeWithManyRelation':
                url = core_1.strings.dasherize(modelName);
                break;
            case 'getByUser':
                url = `${core_1.strings.dasherize(modelName)}/me`;
                break;
            case 'show':
            case 'destroy':
            case 'update':
            case 'updateWithManyRelation':
                url = `${core_1.strings.dasherize(modelName)}/{${modelName.toLowerCase()}}`;
                break;
            case 'deleteMany':
                url = `${core_1.strings.dasherize(modelName)}/many/{data}`;
                break;
            default:
                url = `${core_1.strings.dasherize(modelName)}/{${modelName.toLowerCase()}}/${routeType}`;
                break;
        }
        return url;
    }
    getRouteType(routeType) {
        let type = '';
        switch (routeType) {
            case 'index':
            case 'getByUser':
            case 'show':
                type = 'get';
                break;
            case 'store':
            case 'storeWithManyRelation':
                type = 'post';
                break;
            case 'destroy':
            case 'deleteMany':
                type = 'delete';
                break;
            case 'update':
            case 'updateWithManyRelation':
                type = 'put';
                break;
            default:
                type = 'get';
                break;
        }
        return type;
    }
    getNameSpaces(controllers) {
        let imports = '';
        controllers.forEach((el) => {
            imports += `use ${el.namespace}\\${el.model}Controller;\n`;
        });
        return imports;
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map