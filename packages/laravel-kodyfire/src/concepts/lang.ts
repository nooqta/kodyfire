import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';

export class Lang extends Concept {
  texts: any[];
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  setTexts(_data: any) {
    this.texts = _data.texts;
  }

  initEngine(_data: any) {
    this.engine = new Engine();

    this.engine.builder.registerHelper('getTranslations', () => {
      return this.getTranslations();
    });
  }

  async generate(_data: any) {
    this.setTexts(_data);
    this.initEngine(_data);
    const template = await this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, _data);

    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFileName(_data.model, _data.language),
      compiled
    );
  }

  getFileName(name: string, lng: string) {
    return `${lng}/${name.toLowerCase()}.php`;
  }

  getTranslations() {
    let translations = '';
    this.texts.forEach((translation: any) => {
      translations += `'${translation.key}' => '${translation.value}',\n`;
    });
    return translations;
  }
}
