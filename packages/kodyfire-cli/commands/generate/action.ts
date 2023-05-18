// @ts-nocheck
import chalk from 'chalk';
import { capitalize, IKody, Package } from 'kodyfire-core';
import { join } from 'path';
import { fs } from 'zx';
import { Action as InitAction } from '../init/action';
import { existsSync } from 'fs';
const prompts = require('prompts');
const boxen = require('boxen');
const dotenv = require('envfile');

export class Action {
  static kody: any;
  static concept: any;
  static properties: any;
  static isCanceled = false;

  static async onCancel(_prompt: any) {
    Action.isCanceled = true;
    process.exit(1);
    return true;
  }
  static async getDependencyConcepts(dependency: string) {
    const dep = await InitAction.getDependencyConcepts(dependency);
    return dep?.concepts;
  }
  // @todo: refactor into a Base Action class. used by init/action.ts
  static async getPackageDependencies(rootDir = process.cwd()): Promise<any> {
    const packageJsonFile = await fs.readFile(
      join(rootDir, 'package.json'),
      'utf8'
    );
    const packageJson = JSON.parse(packageJsonFile);
    const name = packageJson.name;
    let dependencies: string[] = [];
    if (
      packageJson.dependencies &&
      Object.keys(packageJson.dependencies).length > 0
    ) {
      dependencies = Object.keys(packageJson.dependencies);
    }

    if (
      packageJson.devDependencies &&
      Object.keys(packageJson.devDependencies).length > 0
    ) {
      dependencies = dependencies.concat(
        Object.keys(packageJson.devDependencies)
      );
    }

    dependencies = dependencies.filter(dep => dep.includes('-kodyfire'));
    return { name, dependencies };
  }

  static async prompter(_args: {
    addMore?: any;
    persist?: any;
    kody?: any;
    concept?: any;
    name?: any;
    includes?: any;
    defaults?: any;
  }): Promise<void | any> {
    process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
    let { addMore, includes } = _args;
    const { persist, kody: _kodyName, concept: _conceptName, defaults } = _args;
    let { name } = _args;
    (async () => {
      do {
        // @todo:move this logic to the index.ts
        // We check if a colon is present in the kody name
        // if so, we assume the user is trying to generate a concept
        // from a specific kody package
        let kodyName = _kodyName,
          conceptName = _conceptName;
        if (_kodyName && _kodyName.includes(':')) {
          // We update name as it has changed its position
          name = _conceptName;
          [kodyName, conceptName] = _kodyName.split(':');
        }
        // end @todo: move this logic to the index.ts
        if (kodyName) this.kody = `${kodyName}-kodyfire`;
        if (!this.kody) {
          const kodyQuestion = await this.getKodyQuestion();
          if (!kodyQuestion) {
            this.displayMessage(
              'No kodies installed. Please install at least a kody package first.'
            );
            process.exit(1);
          }
          const { kody } = await prompts(kodyQuestion, {
            onCancel: Action.onCancel,
          });

          this.kody = kody;
        }

        if (conceptName) this.concept = conceptName;
        let currentConcept = await this.getCurrentConcept();

        if (!this.concept || !currentConcept) {
          // set concept
          await Action.setConcept();
          currentConcept = await this.getCurrentConcept();
        }

        if (!this.properties) {
          // set properties
          const answers = await this.getPropertiesAnswers(currentConcept, {
            name,
            ...defaults,
          });

          if (answers) {
            // @todo validate answers
            await this.generateConcept(this.kody, this.concept, answers);
            // if persist is true we save the data
            if (includes && includes.length > 0) {
              includes = includes.filter(
                (include: string) => include !== this.concept
              );
              const concepts = await this.getDependencyConcepts(this.kody);
              const skipped = includes.filter(
                (include: string) => !concepts[include]
              );
              includes = includes.filter(
                (include: string) => concepts[include]
              );
              if (skipped.length > 0) {
                console.log(
                  `${chalk.dim(
                    `The following concepts were skipped: ${skipped.join(', ')}`
                  )}`
                );
              }
              await this.generateIncludes(this.kody, includes, {
                name: answers['name'],
              });
            }
            this.displayMessage(
              chalk.green(
                `🙌 ${chalk.bold(
                  [conceptName, ...includes].join(', ')
                )} ${chalk.white('created successfully')}`
              ),
              'green'
            );
            if (persist) {
              await this.addConcept(this.kody, this.concept, answers);
            }
          }
          if (addMore) {
            const question = {
              type: 'confirm',
              name: 'value',
              message: `Would you like to add more?`,
              initial: true,
            };
            const { value } = await prompts(question, {
              onCancel: Action.onCancel,
            });
            if (!value) {
              addMore = false;
            }
          }
          this.concept = null;
        }
      } while (addMore);
    })();
  }
  static async generateIncludes(kody: any, includes: any[], rootConcept: any) {
    // we iterate over the includes and set the include to the current concept
    // and the kody to the current kody
    for (const include of includes) {
      // eslint-disable-next-line prefer-const
      let [conceptName, name] = include.split(':');
      if (!name) name = rootConcept.name;
      this.concept = conceptName ?? include;
      const currentConcept = await this.getCurrentConcept();

      const answers = await this.getPropertiesAnswers(currentConcept, { name });
      await this.generateConcept(kody, include, answers);
    }
  }
  private static async setConcept() {
    const conceptQuestion = await this.getConceptQuestion();
    if (!conceptQuestion) {
      this.displayMessage(
        `No concept specified. Please provide a concept to proceed. \`kody g ${this.kody.replace(
          '-kodyfire',
          ''
        )} <your-concept>\`. \n to see available concepts, run \`kody ls ${this.kody.replace(
          '-kodyfire',
          ''
        )}\``
      );
      process.exit(1);
    }
    const { concept } = await prompts(conceptQuestion, {
      onCancel: Action.onCancel,
    });
    this.concept = concept;
  }

  static async getCurrentConcept() {
    const concepts = await this.getDependencyConcepts(this.kody);
    return concepts[this.concept];
  }

  static async getPropertiesAnswers(
    concept: any,
    answers: any = {},
    kody = this.kody,
    conceptName = this.concept
  ) {
    const schemaDefinition = this.getSchemaDefinition(kody);
    const conceptNames = Object.keys(concept || []);
    if (conceptNames.length == 0) {
      return [];
    }
    // We check the required argument for the concept
    let required = [];
    let schemaPath = join(process.cwd(), '.kody', kody);
    if (existsSync(schemaPath)) {
      schemaPath = join(schemaPath, 'schema');
    } else {
      schemaPath = join(process.cwd(), 'node_modules', kody);
    }
    const { schema } = await import(schemaPath);
    if (schema.properties[conceptName].items.required) {
      required = schema.properties[conceptName].items.required;
    }
    // allow prompting usage when requested. example kody g ... --prompts
    // if (answers['name'] !== undefined) {
      const props = conceptNames
      //.filter((name: string) => name !== 'name');
      for (let i = 0; i < props.length; i++) {
        if (answers[props[i]] === undefined && concept[props[i]].default !== undefined) {
          answers[props[i]] = concept[props[i]].default;
        }
      }
      
      // we return answers if all required fields are set
      let isReady = true;
      if (required.length > 0) {
        for (let i = 0; i < required.length; i++) {
          if (answers[required[i]] === undefined) {
            isReady = false;
            break;
          }
        }
        if (isReady) return answers;
      }
    // }

    for (let i = 0; i < conceptNames.length; i++) {
      const currentConcept = concept[conceptNames[i]];

      if (
        currentConcept.type !== 'array' &&
        currentConcept.items?.type !== 'object'
      ) {
        if (typeof currentConcept.condition != 'undefined') {
          const condition = currentConcept.condition;
          if (typeof condition == 'function') {
            if (!condition(answers)) {
              continue;
            }
          }
        }
        const question = await this.conceptToQuestion(
          conceptNames[i],
          concept[conceptNames[i]],
          schemaDefinition,
          false,
          false,
          `${conceptNames[i]}`,
          true
        );
        if (typeof question.value != 'undefined') {
          answers[conceptNames[i]] = question.value;
        } else if (question &&  typeof answers[conceptNames[i]]  == 'undefined') {
          const answer = await prompts(question, {
            onCancel: Action.onCancel,
          });
          answers[conceptNames[i]] = answer.value;
        }
      }
      if (
        currentConcept.type === 'array'
        // && currentConcept.items?.type === 'object'
      ) {
        const question = {
          type: 'confirm',
          name: 'value',
          message: `Would you like to add ${conceptNames[i]}?`,
          initial: true,
        };
        const { value } = await prompts(question);
        if (value) {
          let addMore = true;
          while (addMore) {
            let childConcept;
            if (currentConcept.items?.type !== 'string') {
              childConcept = await this.getPropertiesAnswers(
                currentConcept.items.properties
              );
            } else {
              const conceptQuestion = await this.conceptToQuestion(
                conceptNames[i],
                currentConcept.items
              );
              const currentAnswer = await prompts(conceptQuestion, {
                onCancel: Action.onCancel,
              });
              childConcept = currentAnswer[conceptNames[i]];
            }
            if (answers[conceptNames[i]]) {
              answers[conceptNames[i]].push(childConcept);
            } else {
              answers[conceptNames[i]] = [childConcept];
            }
            const question = {
              type: 'confirm',
              name: 'value',
              message: `Would you like to add more ${conceptNames[i]}?`,
              initial: true,
            };
            const { value } = await prompts(question);
            if (!value) {
              addMore = false;
            }
          }
        }
      }
    }
    return answers;
  }
  static async getConceptQuestion() {
    const concepts = await this.getDependencyConcepts(this.kody);
    const conceptNames = Object.keys(concepts || {});
    if (conceptNames.length == 0) {
      return false;
    }
    const question = {
      type: conceptNames.length < 4 ? 'select' : 'autocomplete',
      name: 'concept',
      message: `Select the concept you want to add?`,
      choices: conceptNames.map((concept: string) => ({
        title: capitalize(concept),
        value: concept,
      })),
    };
    return question;
  }
  static async getKodyQuestion() {
    const { dependencies } = await this.getPackageDependencies();
    if (dependencies.length == 0) {
      return false;
    }
    const question = {
      type: 'select',
      name: 'kody',
      message: `Select the kody package?`,
      choices: dependencies.map((dep: string) => ({
        title: capitalize(dep.replace('-kodyfire', '')),
        value: dep,
      })),
    };
    return question;
  }
  static displayMessage(message: string, borderColor = 'yellow') {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor,
        borderStyle: 'round',
      })
    );
  }
  static async execute(args: any) {
    try {
      args.addMore = args.multiple || false;
      args.persist = args.persist || false;
      await this.prompter(args);
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }

  static async getConceptAttributes(schema: any): Promise<any> {
    try {
      if (Object.prototype.hasOwnProperty.call(schema, 'properties')) {
        return schema.properties;
      }
      if (Object.prototype.hasOwnProperty.call(schema, 'items')) {
        return await this.getConceptAttributes(schema.items);
      }
    } catch (error: any) {
      this.displayMessage(error.message);
      process.exit(1);
    }
    return false;
  }

  static async addConcept(
    dependency: string,
    concept: string,
    data: any,
    rootDir: string = process.cwd()
  ) {
    try {
      let content = this.getSchemaDefinition(dependency, rootDir);
      if (!content) {
        content = await InitAction.getEntries(rootDir, dependency);
      }
      if (content[concept]) {
        content[concept] = [...content[concept], data];
      } else {
        content[concept] = [data];
      }
      content = JSON.stringify(content, null, '\t');
      fs.writeFileSync(
        join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
        content
      );
      this.displayMessage(
        chalk.green(
          `🙌 ${chalk.bold(concept)} ${chalk.white('created successfully')}`
        ),
        'green'
      );
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }
  static async readEnvFile(rootDir: string = process.cwd()) {
    try {
      const envFile = join(rootDir, '.env');
      if (fs.existsSync(envFile)) {
        const envContent = fs.readFileSync(envFile, 'utf8');
        const env = dotenv.parse(envContent);
        return env;
      }
    } catch (error: any) {
      this.displayMessage(error.message);
    }
    return false;
  }

  static async createEnvFile(rootDir: string = process.cwd()) {
    try {
      const envFile = join(rootDir, '.env');
      if (!fs.existsSync(envFile)) {
        fs.writeFileSync(envFile, '');
      }
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }

  static async addEnvVariable(
    key: string,
    value: string,
    rootDir: string = process.cwd()
  ) {
    try {
      const envFile = join(rootDir, '.env');
      if (!fs.existsSync(envFile)) {
        await Action.createEnvFile(rootDir);
      }
      const envContent = fs.readFileSync(envFile, 'utf8');
      const env = dotenv.parse(envContent);
      env[key] = value;
      const newEnvContent = Object.keys(env)
        .map((key: string) => `${key}=${env[key]}`)
        .join('\n');
      fs.writeFileSync(envFile, newEnvContent);
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }

  static getEnvVariable(key: string, rootDir: string = process.cwd()) {
    try {
      const envFile = join(rootDir, '.env');
      if (fs.existsSync(envFile)) {
        const envContent = fs.readFileSync(envFile, 'utf8');
        const env = dotenv.parse(envContent);
        return env[key];
      }
    } catch (error: any) {
      this.displayMessage(error.message);
    }
    return false;
  }

  static async generateConcept(
    dependency: string,
    concept: string,
    data: any,
    rootDir: string = process.cwd()
  ) {
    try {
      let path, currentKody;
      const kodyName = dependency.replace('-kodyfire', '');
      let content = await this.getSchemaDefinition(dependency, rootDir);

      if (!content) {
        content = await this.getDependencyConcepts(dependency);
      }

      Object.keys(content).forEach(key => {
        content[key] = [];
      });
      content[concept] = [data];
      const rootDirEnvVar = this.getEnvVariable(
        `${kodyName.toUpperCase()}_ROOT_DIR`
      );

      if (rootDirEnvVar) {
        content.rootDir = rootDirEnvVar;
      } else {
        // Ask if the user want to overwrite rootDir
        const question = {
          type: 'text',
          name: 'value',
          description: 'Enter the root directory',
          message: `What is the root directory?`,
          initial: rootDir,
        };
        const { value } = await prompts(question, {
          onCancel: Action.onCancel,
        });
        Action.addEnvVariable(`${kodyName.toUpperCase()}_ROOT_DIR`, value);
        content.rootDir = value;
      }
      if (fs.existsSync(join(process.cwd(), 'node_modules', dependency))) {
        path = join(process.cwd(), 'node_modules', dependency);
        const packages = await Package.getInstalledKodies();
        currentKody = packages.find((kody: any) => kody.id === kodyName);
      } else {
        this.displayMessage(`${dependency} does not exist. Install it first.`);
        process.exit(1);
        // @todo: try a globally installed kody
        path = join(
          InitAction.getNpmGlobalPrefix(),
          'lib',
          'node_modules',
          dependency
        );
        currentKody = { id: kodyName };
      }

      const m = await import(path);
      // Add env variables to current kody
      const env = await this.readEnvFile(content.rootDir);

      if (env) {
        currentKody.env = env;
      }
      const kody: IKody = new m.Kody(currentKody);
      // Run a simple MySQL query
      // @ts-ignore
      // await kody.technology.initDatabase();
      // // @ts-ignore
      // const { connection: db } = kody.technology.db;
      // const [rows] = await db.query('select * from users');
      // db.end();
      // console.log(rows);
      // generate artifacts | execute actions
      // @ts-ignore
      const output = await kody.generate(content);
    } catch (error: any) {
      console.log(error);
      this.displayMessage(error.message);
      process.exit(1);
    }
  }
  static async addConceptProperty(
    dependency: string,
    concept: string,
    property: string,
    data: any,
    rootDir: string = process.cwd()
  ) {
    try {
      let content = this.getSchemaDefinition(dependency, rootDir);
      const currentConcept = data['concept'];
      // tweak the data for array for now
      delete data['concept'];
      data = data[property] ? data[property] : data;
      if (typeof content[concept][currentConcept][property] !== 'undefined') {
        content[concept][currentConcept][property] = [
          ...content[concept][currentConcept][property],
          data,
        ];
      } else {
        content[concept][currentConcept][property] = [data];
      }
      content = JSON.stringify(content, null, '\t');
      fs.writeFileSync(
        join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
        content
      );
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }
  static getSchemaDefinition(dependency: string, rootDir = process.cwd()) {
    const path = join(
      rootDir,
      `kody-${dependency.replace('-kodyfire', '')}.json`
    );
    if (!fs.existsSync(path)) {
      return false;
    }
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }
  static async conceptToQuestion(
    name: string,
    concept: {
      description: string;
      default?: any;
      type?: string;
      enum?: any;
      items?: any;
    },
    _concepts: any = {},
    message: boolean | string = false,
    _useIndex = false,
    label = '',
    useValueAsName = false
  ): Promise<any | void> {
    message = concept.description || message;
    label = label || name;

    if (typeof concept.enum !== 'undefined') {
      if (concept.enum.length == 1) return { value: concept.enum[0] }; // if only one option, return it as default answer
      const choices = concept.enum.map((c: any) => ({ title: c, value: c }));
      return {
        type: choices.length < 5 ? 'select' : 'autocomplete',
        name: useValueAsName ? 'value' : name,
        message: message || `Select the value for ${label}?`,
        ...(concept.description && { description: concept.description }),
        choices: choices,
      };
    }
    if (concept.type === 'boolean') {
      return {
        type: 'toggle',
        name: useValueAsName ? 'value' : name,
        ...(concept.default && { initial: concept.default }),
        initial: concept.default,
        ...(concept.description && { description: concept.description }),
        message: message || `What is the value for ${label}?`,
        active: 'Yes',
        inactive: 'No',
      };
    }
    if (concept.type === 'string') {
      return {
        type: 'text',
        name: useValueAsName ? 'value' : name,
        ...(concept.default && { initial: concept.default }),
        ...(concept.description && { description: concept.description }),
        message: message || `What is the value for ${label}?`,
      };
    }
    if (concept.type === 'number') {
      return {
        type: 'number',
        name: useValueAsName ? 'value' : name,
        ...(concept.default && { initial: concept.default }),
        ...(concept.description && { description: concept.description }),
        message: message || `What is the value for ${label}?`,
      };
    }
    if (concept.type === 'array') {
      if (concept.items.type == 'string') {
        return {
          type: 'text',
          name: useValueAsName ? 'value' : name,
          ...(concept.description && { description: concept.description }),
          message: message || `What is the value for ${label}?`,
        };
      }
    }
    if (concept.type === 'boolean') {
      return {
        type: 'select',
        name: useValueAsName ? 'value' : name,
        ...(concept.description && { description: concept.description }),
        message: message || `What is the value for ${label}?`,
        ...(concept.default && { initial: concept.default }),
        choices: [
          { title: 'true', value: true },
          { title: 'false', value: false },
        ],
      };
    }
    return false;
  }
}
