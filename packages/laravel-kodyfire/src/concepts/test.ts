import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';

export class Test extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  setModel(_data: any) {
    this.model = this.technology.input.model.find(
      (m: any) => m.name.toLowerCase() == _data.model.toLowerCase()
    );
    const controller = this.technology.input.controller.find(
      (c: any) => c.model == _data.model
    );
    this.model.controller = controller;
  }

  initEngine(_data: any) {
    this.engine = new Engine();

    this.engine.builder.registerHelper('getTests', () => {
      return this.getTests();
    });
  }

  async generate(_data: any) {
    this.setModel(_data);
    this.initEngine(_data);
    const template = await this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, this.model);

    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFileName(_data.model),
      compiled
    );
  }

  getFileName(name: string) {
    return `Feature/${name}Test.php`;
  }

  getTests(): string {
    if (this.model.controller.routeType == 'detailed') {
      return this.getDetailedTests(this.model);
    } else {
      return this.getResourceTests(this.model);
    }
  }

  generateFaker(el: any, faker: any = '$this->faker') {
    if (!el.name.includes('_id')) {
      if (el.type == 'enum') {
        return `'${el.arguments[0]}'`;
      }
      if (
        el.extra_type == 'file' ||
        el.extra_type == 'image' ||
        el.extra_type == 'video'
      ) {
        return `${faker}->url()`;
      }
      if (el.extra_type != 'password') {
        if (el.options.includes('unique')) {
          return `${faker}->unique()->${el.extra_type}`;
        } else {
          return `${faker}->${el.extra_type}`;
        }
      } else {
        return `bcrypt('password')`;
      }
    } else {
      return 1;
    }
  }

  getTestData(model: any) {
    let data = '';
    model.fields.forEach((el: any) => {
      data += `'${el.name}' => ${this.generateFaker(el, '$this->faker')},\n`;
    });

    if (model.isMorph) {
      data += `'${model.name.toLowerCase()}able_id' => 1,
        '${model.name.toLowerCase()}able_type' => 'App\\Models\\${
        model.name
      }',\n`;
    }

    return data;
  }

  getDetailedTests(model: any): string {
    let tests = '';
    model.controller.actions.forEach((action: any) => {
      switch (action.type) {
        case 'index':
          tests += `
                public function testListSucceed() {
                    $response = $this->get('/api/v1/${model.name.toLowerCase()}');
                    $response->assertStatus(200);
                }\n`;
          break;
        case 'store':
          tests += `
                public function testCreateSucceed() {
                    $data = [
                        ${this.getTestData(model)}
                    ];
            
                    $response = $this->post('/api/v1/${model.name.toLowerCase()}', $data);
                    $response->assertStatus(200);
                }\n`;
          break;
        case 'show':
          tests += `
                public function testGetDetailsSucceed() {
                    $response = $this->get('/api/v1/${model.name.toLowerCase()}/1');
                    $response->assertStatus(200);
                }\n`;
          break;
        case 'update':
          tests += `
                public function testUpdateSucceed() {
                    $data = [
                        ${this.getTestData(model)}
                    ];
            
                    $response = $this->put('/api/v1/${model.name.toLowerCase()}/1', $data);
                    $response->assertStatus(200);
                }\n`;
          break;
        case 'destroy':
          tests += `
                public function testDeleteSucceed() {
                    $response = $this->get('/api/v1/${model.name.toLowerCase()}/1');
                    $response->assertStatus(200);
                }\n`;
          break;
        default:
      }
    });
    return tests;
  }

  getResourceTests(model: any): string {
    return `
    public function testListSucceed() {
        $response = $this->get('/api/v1/${model.name.toLowerCase()}');
        $response->assertStatus(200);
    }

    public function testGetDetailsSucceed() {
        $response = $this->get('/api/v1/${model.name.toLowerCase()}/1');
        $response->assertStatus(200);
    }

    public function testCreateSucceed() {
        $data = [
            ${this.getTestData(model)}
        ];

        $response = $this->post('/api/v1/${model.name.toLowerCase()}', $data);
        $response->assertStatus(200);
    }

    public function testUpdateSucceed() {
        $data = [
            ${this.getTestData(model)}
        ];

        $response = $this->put('/api/v1/${model.name.toLowerCase()}/1', $data);
        $response->assertStatus(200);
    }

    public function testDeleteSucceed() {
        $response = $this->get('/api/v1/${model.name.toLowerCase()}/1');
        $response->assertStatus(200);
    }`;
  }
}
