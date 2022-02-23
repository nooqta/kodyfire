import { strings } from '@angular-devkit/core';
import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';

export class Api extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine() {
    this.engine = new Engine();

    this.engine.builder.registerHelper('namespaces', () => {
      return this.getNameSpaces(this.technology.input.model);
    });

    this.engine.builder.registerHelper('routes', () => {
      return this.getGroupsList(this.technology.input.model);
    });
  }

  async generate(_data: any) {
    this.initEngine();
    const template = await this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, this.model);
    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(),
      compiled
    );
  }

  getFilename() {
    return `api.php`;
  }

  getGroupsList(models: any[]) {
    let groups = '';
    let middlewares: any = [];
    models.forEach((el: any) => {
      if (el.hasController) {
        if (el.controller.routeType == 'detailed') {
          el.controller.actions.forEach((action: any) => {
            if (action.middleware != '') {
              middlewares.push(action.middleware);
            }
          });
        } else {
          middlewares.push(el.controller.middleware);
        }
      }
    });
    let unique = [...new Set(middlewares)];

    Array.from(unique).forEach((el: any) => {
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

  getRoutesList(group: any, models: any[]) {
    let routesArray: any = [];
    let routes: any = '';

    models.forEach((model: any) => {
      if (model.controller.routeType == 'detailed') {
        let filtredRoutes = model.controller.actions.filter(
          (action: any) => action.middleware == group
        );
        filtredRoutes.forEach((item: any) => {
          item.modelName = model.name;
          item.routeType = model.controller.routeType;
        });
        routesArray.push(...filtredRoutes);
      } else {
        if (model.controller.middleware == group) {
          routesArray.push({
            modelName: model.name,
            routeType: model.controller.routeType,
          });
        }
      }
    });

    routesArray.forEach((r: any) => {
      if (r.routeType == 'resource') {
        routes += `Route::resource('${r.modelName.toLowerCase()}', ${
          r.modelName
        }Controller::class);\n`;
      } else {
        routes += `Route::${this.getRouteType(r.type)}('${this.getRouteUrl(
          r.type,
          r.modelName
        )}', [${r.modelName}Controller::class, '${r.name}']);\n`;
      }
    });

    return routes;
  }

  getRouteUrl(routeType: any, modelName: any) {
    let url = '';
    switch (routeType) {
      case 'index':
      case 'store':
        url = strings.dasherize(modelName);
        break;
      case 'getByUser':
        url = `${strings.dasherize(modelName)}/me`;
        break;
      case 'show':
      case 'destroy':
      case 'update':
        url = `${strings.dasherize(modelName)}/{${modelName.toLowerCase()}}`;
        break;
      case 'deleteMany':
        url = `${strings.dasherize(modelName)}/many/{data}`;
        break;
      default:
        url = `${strings.dasherize(
          modelName
        )}/{${modelName.toLowerCase()}}/${routeType}`;
        break;
    }

    return url;
  }

  getRouteType(routeType: any) {
    let type = '';

    switch (routeType) {
      case 'index':
      case 'getByUser':
      case 'show':
        type = 'get';
        break;
      case 'store':
        type = 'post';
        break;
      case 'destroy':
      case 'deleteMany':
        type = 'delete';
        break;
      case 'update':
        type = 'put';
        break;
      default:
        type = 'get';
        break;
    }

    return type;
  }

  getNameSpaces(models: any[]) {
    let imports = '';
    models.forEach((el: any) => {
      if (el.hasController) {
        imports += `use App\\Http\\Controllers\\API\\V1\\${el.name}Controller;\n`;
      }
    });

    return imports;
  }
}
