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
exports.Test = void 0;
const concept_1 = require("./concept");
const engine_1 = require("./engine");
class Test extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    setModel(_data) {
        this.model = this.technology.input.model.find((m) => m.name.toLowerCase() == _data.model.toLowerCase());
        const controller = this.technology.input.controller.find((c) => c.model == _data.model);
        this.model.controller = controller;
    }
    initEngine(_data) {
        this.engine = new engine_1.Engine();
        this.engine.builder.registerHelper('getTests', () => {
            return this.getTests();
        });
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setModel(_data);
            this.initEngine(_data);
            const template = yield this.engine.read(this.template.path, _data.template);
            const compiled = this.engine.compile(template, this.model);
            this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFileName(_data.model), compiled);
        });
    }
    getFileName(name) {
        return `Feature/${name}Test.php`;
    }
    getTests() {
        if (this.model.controller.routeType == 'detailed') {
            return this.getDetailedTests(this.model);
        }
        else {
            return this.getResourceTests(this.model);
        }
    }
    generateFaker(el, faker = '$this->faker') {
        if (!el.name.includes('_id')) {
            if (el.type == 'enum') {
                return `'${el.arguments[0]}'`;
            }
            if (el.extra_type == 'file' ||
                el.extra_type == 'image' ||
                el.extra_type == 'video') {
                return `${faker}->url()`;
            }
            if (el.extra_type != 'password') {
                if (el.options.includes('unique')) {
                    return `${faker}->unique()->${el.extra_type}`;
                }
                else {
                    return `${faker}->${el.extra_type}`;
                }
            }
            else {
                return `bcrypt('password')`;
            }
        }
        else {
            return 1;
        }
    }
    getTestData(model) {
        let data = '';
        model.fields.forEach((el) => {
            data += `'${el.name}' => ${this.generateFaker(el, '$this->faker')},\n`;
        });
        if (model.isMorph) {
            data += `'${model.name.toLowerCase()}able_id' => 1,
        '${model.name.toLowerCase()}able_type' => 'App\\Models\\${model.name}',\n`;
        }
        return data;
    }
    getDetailedTests(model) {
        let tests = '';
        model.controller.actions.forEach((action) => {
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
    getResourceTests(model) {
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
exports.Test = Test;
//# sourceMappingURL=test.js.map