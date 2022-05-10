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
      return this.getNameSpaces(this.technology.input.controller);
    });

    this.engine.builder.registerHelper('routes', () => {
      return this.getGroupsList(this.technology.input.model);
    });
  }

  async generate(_data: any) {
    this.initEngine();
    const template = await this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, this.model);
    await this.engine.createOrOverwrite(
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
    const middlewares: any = [];
    models.forEach((el: any) => {
      if (el.controller) {
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
    const unique = [...new Set(middlewares)];

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
    const routesArray: any = [];
    let routes: any = '';

    models.forEach((model: any) => {
      if (model.controller.routeType == 'detailed') {
        const filtredRoutes = model.controller.actions.filter(
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
        if (r.routeName) {
          routes += `Route::${this.getRouteType(r.type)}('${r.routeName}', [${
            r.modelName
          }Controller::class, '${r.name}']);\n`;
        } else {
          routes += `Route::${this.getRouteType(r.type)}('${this.getRouteUrl(
            r.type,
            r.modelName
          )}', [${r.modelName}Controller::class, '${r.name}']);\n`;
        }
      }
    });

    return routes;
  }

  getRouteUrl(routeType: any, modelName: any) {
    let url = '';
    switch (routeType) {
      case 'index':
      case 'store':
      case 'storeWithManyRelation':
        url = strings.dasherize(modelName);
        break;
      case 'getByUser':
        url = `${strings.dasherize(modelName)}/me`;
        break;
      case 'show':
      case 'destroy':
      case 'update':
      case 'updateWithManyRelation':
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

  getNameSpaces(controllers: any[]) {
    let imports = '';
    controllers.forEach((el: any) => {
      imports += `use ${el.namespace}\\${el.model}Controller;\n`;
    });

    return imports;
  }
}
