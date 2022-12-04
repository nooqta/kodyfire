import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';
import { strings } from '@angular-devkit/core';

const moment = require('moment');

const pluralize = require('pluralize');

export class Migration extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine() {
    this.engine = new Engine();
    this.engine.builder.registerHelper('hasId', (value: any) => {
      return value.includes('_id');
    });
    this.engine.builder.registerHelper('options', (value: any) => {
      return this.getCommonOptions(value);
    });
  }
  setModel(_data: any) {
    // @todo find a better way to get the model
    if (!this.technology.input.model.some((m: any) => m.name == _data.model)) {
      throw new Error(
        `Make sure the model ${_data.model} exists and is not mispelled.`
      );
    }

    this.model = this.technology.input.model.find(
      (m: any) => m.name == _data.model
    );
  }
  async generate(_data: any) {
    this.initEngine();
    const template = await this.engine.read(this.template.path, _data.template);
    await this.appendData(_data);
    const compiled = await this.engine.compile(template, this.model);
    const filename = await this.getFilename(this.model);
    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      filename,
      compiled
    );
  }

  private async appendData(_data: any) {
    if (typeof _data.model === 'string') {
      this.setModel(_data);
      if (_data.filename) {
        this.model.filename = _data.filename;
      }
      this.model.className = this.getClassName(this.model.name);
      this.model.table = this.getMigrationName(this.model.name);
      this.model.attributes = await this.getMigrationAttributes(this.model);
      this.model._fields = await this.getFields(this.model);
    } else {
      _data.className = this.getClassName(_data.table);
      _data.attributes = this.getForeignKeysAttributes(_data.columns);
      this.model = _data;
    }
  }
  getForeignKeysAttributes(columns: any): any {
    let data = '';

    columns.forEach((el: any) => {
      data += `$table->foreignId('${el.column}')->references('${
        el.references
      }')->on('${el.on}')${this.getCascade(el)};\n`;
    });

    return data;
  }

  wait(ms: number) {
    const now = moment();
    const afterXms = moment().add(ms, 'ms');
    do {
      now.add(1, 'ms');
    } while (!afterXms.isSame(now));
  }

  async getFilename(model: any) {
    if (model.filename) return model.filename;
    // Check if a file exists in the migration folder
    const files = await this.engine.getFiles(
      this.technology.rootDir,
      this.outputDir
    );
    const suffix = `_create_${strings.dasherize(
      pluralize(model.name)
    )}_table.php`;
    const file = files.find((f: any) => f.includes(suffix));
    if (file) {
      return file;
    }
    const date = new Date();
    const m = date.getMonth().toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const y = date.getFullYear();
    const s = date.getTime();
    this.wait(1000);
    const ms = moment(date).add(300, 'milliseconds').toDate().getMilliseconds();
    return `${y}_${m}_${d}_${s}${ms}${suffix}`;
  }

  getMigrationName(model: any) {
    return this.underscorize(pluralize(model));
  }
  getClassName(model: any) {
    return `Create${strings.classify(model)}Table`;
  }

  underscorize(word: any) {
    return word.replace(/[A-Z]/g, function (char: any, index: any) {
      return (index !== 0 ? '_' : '') + char.toLowerCase();
    });
  }

  async getMigrationAttributes(model: any) {
    let data = '';
    // data += await this.getFields(model);
    if (model.foreign_keys) {
      model.foreign_keys.forEach((el: any) => {
        data += `$table->foreignId('${el.column}')->references('${
          el.references
        }')->on('${el.on}')${this.getCascade(el)};\n`;
      });
    }

    if (model.isMorph) {
      data += `$table->morphs('${model.name.toLowerCase()}able');\n`;
    }
    if (model.name == 'User') {
      data += `$table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();`;
    }

    return data;
  }
  async getFields(model: any) {
    const template = await this.engine.read(
      this.template.path,
      'migration/fields.template'
    );

    const compiled = await this.engine.compile(template, model);
    return compiled;
  }

  getCommonOptions(field: any) {
    let commonOptions = '';
    if (!field.options) {
      return commonOptions;
    }
    field.options.forEach((op: any) => {
      if (['unique', 'nullable', 'unsigned'].includes(op.key)) {
        commonOptions += `->${op.key}()`;
      }
      if (op.key == 'default') {
        if (['boolean', 'integer', 'decimal'].includes(field.type)) {
          commonOptions += `->default(${op.value})`;
        } else {
          commonOptions += `->default("${op.value}")`;
        }
      }
    });

    return commonOptions;
  }

  getCascade(element: any) {
    let cascade = '';
    if (element.onDelete == 'cascade') {
      cascade += `->onDelete('cascade')`;
    }
    if (element.onUpdate == 'cascade') {
      cascade += `->onUpdate('cascade')`;
    }

    return cascade;
  }
}
