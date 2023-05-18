import { fs } from 'zx';
import { Action as ListAction } from '../list/action';
import { Action as GenerateAction } from '../generate/action';
import chalk from 'chalk';
const boxen = require('boxen');
export const supportedTypes = [
  'json',
  'yaml',
  'plantuml',
  'api',
  'openai',
  'chatgpt',
  'puppeteer',
];
export class Action {
  static displayMessage(message: string, color = 'yellow') {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: color,
        borderStyle: 'round',
      })
    );
  }
  static async execute(_args: any) {
    try {
      const { type, source, kody, concepts } = _args;
      // Check if kody is installed
      const kodies = await ListAction.getInstalledKodies();
      // check if kody exists
      const currentKody: any = kodies.find(
        (k: any) => k.id === kody || k.name === kody
      );
      if (!currentKody) {
        this.displayMessage(
          `😞 The kody ${kody} is not installed.\nUse kody list to check your installed kodies`,
          'red'
        );
        process.exit(1);
      }

      // resolve the parser to be used for the source
      // @todo: every kody should provide the list of supported types
      // for now we check statically. An error will occur if the parser is not supported
      if (!['json', 'yaml', 'plantuml'].includes(type)) {
        if (supportedTypes.includes(type)) {
          this.displayMessage(
            `${type} parser not implemented yet. Please use yaml or plantuml (class diagram) for now.`,
            'red'
          );
        } else {
          this.displayMessage(
            `Unsupported type ${type}. Supported types are ${supportedTypes.join(
              ', '
            )}. Only json is implemented for now.`,
            'red'
          );
        }
        process.exit(1);
      }
      // we check if the file exists
      if (!fs.existsSync(source)) {
        this.displayMessage('File not found', 'red');
        process.exit(1);
      }

      let imports: any[] = [];
      let yaml: any;
      // @todo: refactor. Every kody is responsible for parsing the source
      switch (type) {
        case 'yaml': {
          const { load } = require('js-yaml');
          // @ts-ignore
          yaml = load(fs.readFileSync(source));
          imports = Object.keys(yaml.models).map(name => ({
            name,
            ...yaml.models[name],
          }));
          break;
        }
        case 'plantuml': {
          const { parse } = require('plantuml-parser');
          const plantuml = fs.readFileSync(_args.source, 'utf8').toString();
          const [uml] = parse(plantuml);
          // @ts-ignore
          imports = uml.elements.filter(
            (e: any) => e.constructor.name === 'Class'
          );
          break;
        }
        case 'json': {
          const json = fs.readFileSync(_args.source, 'utf8');
          // @ts-ignore
          imports = JSON.parse(json);
          break;
        }
      }
      // We loop through the _args.concepts list then the classes get the currentConcept based on the currentKody
      // and generate the concept
      for (const conceptName of concepts) {
        for (const c of imports) {
          const _concepts = await GenerateAction.getDependencyConcepts(
            currentKody.name
          );
          const currentConcept = _concepts[conceptName];
          const answers = await GenerateAction.getPropertiesAnswers(
            currentConcept,
            {
              name: c.name,
              ...c
            },
            currentKody.name,
            conceptName
          );
          answers.import = imports;
          answers.parser = type;
          answers.yaml = yaml;
          answers.currentImport = c;
          await GenerateAction.generateConcept(
            currentKody.name,
            conceptName,
            answers
          );
        }
      }

      this.displayMessage(
        chalk.green(
          `🙌 ${chalk.bold(source)} ${chalk.white('imported successfully')}`
        ),
        'green'
      );
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }
}
