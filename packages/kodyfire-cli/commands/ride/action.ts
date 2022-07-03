// import { $ } from "zx";
import { capitalize } from 'kodyfire-core';
import { join } from 'path';
import { fs } from 'zx';
import { Action as InitAction } from './../init/action';
const prompts = require('prompts');
const boxen = require('boxen');

export class Action {
  static kody: any;
  static concept: any;
  static properties: any;
  static isCanceled = false;

  static async onCancel(_prompt: any) {
    this.isCanceled = true;
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

  static async prompter(): Promise<void | any> {
    (async () => {
      if (!this.kody) {
        const kodyQuestion = await this.getKodyQuestion();
        if (!kodyQuestion) {
          this.displayMessage(
            'No kodies installed. Please install at least a kody package first.'
          );
          process.exit(1);
        }
        const { kody } = await prompts(kodyQuestion);
        this.kody = kody;
      }
      if (!this.concept) {
        // set concept
        const conceptQuestion = await this.getConceptQuestion();
        if (!conceptQuestion) {
          this.displayMessage(
            'No concepts selected. Please select a concept to proceed.'
          );
          process.exit(1);
        }
        const { concept } = await prompts(conceptQuestion);
        this.concept = concept;
      }
      if (!this.properties) {
        // set properties
        const currentConcept = await this.getCurrentConcept();
        const answers = await this.getPropertiesAnswers(currentConcept);
        // Prompt to add children-property if it has children-property of type array
        const childrenProps = Object.keys(currentConcept).filter(c =>
          ['array', 'object'].includes(currentConcept[c].type)
        );
        if (childrenProps.length > 0) {
          for (let k = 0; k < childrenProps.length; k++) {
            const question = {
              type: 'confirm',
              name: 'value',
              message: `Would like to add ${childrenProps[k]}?`,
              initial: true,
            };
            const { value } = await prompts(question);
            if (value) {
              if (currentConcept[childrenProps[k]].type === 'array') {
                let addMore = true;
                while (addMore) {
                  const currentProp = currentConcept[childrenProps[k]].items
                    .properties
                    ? currentConcept[childrenProps[k]].items.properties
                    : currentConcept[childrenProps[k]].items;
                  let moreAnswers: any = {};
                  if (currentConcept[childrenProps[k]].type == 'array') {
                    moreAnswers = await this.getPropertiesAnswers(currentProp);
                    if (answers[childrenProps[k]]) {
                      answers[childrenProps[k]].push(moreAnswers);
                    } else {
                      answers[childrenProps[k]] = [moreAnswers];
                    }
                  } else if (
                    currentConcept[childrenProps[k]].type == 'object'
                  ) {
                    const currentPropNames = Object.keys(currentProp);
                    for (let m = 0; m < currentPropNames.length; m++) {
                      const question = {
                        type: 'confirm',
                        name: 'value',
                        message: `Would like to add ${currentPropNames[m]}?`,
                        initial: true,
                      };
                      const { value } = await prompts(question);
                      if (value) {
                        let addMoreMore = true;
                        while (addMoreMore) {
                          if (
                            currentProp[currentPropNames[m]].type == 'array' &&
                            currentProp[currentPropNames[m]].items?.type ==
                              'object'
                          ) {
                            const currentPropItems =
                              await this.getPropertiesAnswers(
                                currentProp[currentPropNames[m]].items
                                  .properties
                              );
                            if (moreAnswers[currentPropNames[m]]) {
                              moreAnswers[currentPropNames[m]].push(
                                currentPropItems
                              );
                            } else {
                              moreAnswers[currentPropNames[m]] = [
                                currentPropItems,
                              ];
                            }
                          } else {
                            moreAnswers[currentPropNames[m]] =
                              await this.getPropertiesAnswers(currentProp);
                          }
                          const question = {
                            type: 'confirm',
                            name: 'value',
                            message: `Would like to add more ${currentPropNames[m]}?`,
                            initial: true,
                          };
                          const { value } = await prompts(question);
                          if (!value) {
                            addMoreMore = false;
                          }
                        }
                      }
                    }
                    if (answers[childrenProps[k]]) {
                      answers[childrenProps[k]] =
                        answers[childrenProps[k]].concat(moreAnswers);
                    } else {
                      answers[childrenProps[k]] = [moreAnswers];
                    }
                  }

                  const question = {
                    type: 'confirm',
                    name: 'value',
                    message: `Would like to add more ${childrenProps[k]}?`,
                    initial: true,
                  };
                  const { value } = await prompts(question);
                  if (!value) {
                    addMore = false;
                  }
                }
              } else {
                const currentProp = currentConcept[childrenProps[k]].properties;
                let moreAnswers: any = {};
                if (currentConcept[childrenProps[k]].type == 'array') {
                  moreAnswers = await this.getPropertiesAnswers(currentProp);
                  if (answers[childrenProps[k]]) {
                    answers[childrenProps[k]].push(moreAnswers);
                  } else {
                    answers[childrenProps[k]] = [moreAnswers];
                  }
                } else if (currentConcept[childrenProps[k]].type == 'object') {
                  const currentPropNames = Object.keys(currentProp);
                  for (let m = 0; m < currentPropNames.length; m++) {
                    const question = {
                      type: 'confirm',
                      name: 'value',
                      message: `Would like to add ${currentPropNames[m]}?`,
                      initial: true,
                    };
                    const { value } = await prompts(question);
                    if (value) {
                      let addMoreMore = true;
                      while (addMoreMore) {
                        if (
                          currentProp[currentPropNames[m]].type == 'array' &&
                          currentProp[currentPropNames[m]].items?.type ==
                            'object'
                        ) {
                          const currentPropItems =
                            await this.getPropertiesAnswers(
                              currentProp[currentPropNames[m]].items.properties
                            );
                          if (moreAnswers[currentPropNames[m]]) {
                            moreAnswers[currentPropNames[m]].push(
                              currentPropItems
                            );
                          } else {
                            moreAnswers[currentPropNames[m]] = [
                              currentPropItems,
                            ];
                          }
                        } else {
                          moreAnswers[currentPropNames[m]] =
                            await this.getPropertiesAnswers(currentProp);
                        }
                        const question = {
                          type: 'confirm',
                          name: 'value',
                          message: `Would like to add more ${currentPropNames[m]}?`,
                          initial: true,
                        };
                        const { value } = await prompts(question);
                        if (!value) {
                          addMoreMore = false;
                        }
                      }
                    }
                  }
                  if (answers[childrenProps[k]]) {
                    answers[childrenProps[k]] =
                      answers[childrenProps[k]].concat(moreAnswers);
                  } else {
                    answers[childrenProps[k]] = moreAnswers;
                  }
                }
              }
            }
          }
        }
        this.addConcept(this.kody, this.concept, answers);
      }
    })();
  }
  static async getCurrentConcept() {
    const concepts = await this.getDependencyConcepts(this.kody);
    return concepts[this.concept];
  }

  static async getPropertiesAnswers(concept: any) {
    const schemaDefinition = this.getSchemaDefinition(this.kody);

    const conceptNames = Object.keys(concept || {});

    if (conceptNames.length == 0) {
      return [];
    }
    const answers: any = {};
    for (let i = 0; i < conceptNames.length; i++) {
      const currentConcept = concept[conceptNames[i]];
      if (
        currentConcept.type !== 'array' &&
        currentConcept.items?.type !== 'object'
      ) {
        const question = await this.conceptToQuestion(
          conceptNames[i],
          concept[conceptNames[i]],
          schemaDefinition,
          false,
          false,
          `${conceptNames[i]}`,
          true
        );
        if (question) {
          const answer = await prompts(question);
          answers[conceptNames[i]] = answer.value;
        }
      }
      if (
        currentConcept.type === 'array' &&
        currentConcept.items?.type === 'object'
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
            const childConcept = await this.getPropertiesAnswers(
              currentConcept.items.properties
            );
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
      type: 'select',
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
  static displayMessage(message: string) {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      })
    );
  }
  static async execute() {
    try {
      await this.prompter();
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }

  static async addConcept(
    dependency: string,
    concept: string,
    data: any,
    rootDir: string = process.cwd()
  ) {
    try {
      let content = this.getSchemaDefinition(dependency, rootDir);
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
    } catch (error: any) {
      this.displayMessage(error.message);
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
    return JSON.parse(
      fs.readFileSync(
        join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
        'utf8'
      )
    );
  }
  static async conceptToQuestion(
    name: string,
    concept: {
      description: { description: any };
      default?: any;
      type?: string;
      enum?: any;
      items?: any;
    },
    concepts: any = {},
    message: boolean | string = false,
    useIndex = false,
    label = '',
    useValueAsName = false
  ): Promise<any | void> {
    label = label || name;
    if (concepts[name] && typeof concepts[name] != 'string') {
      const choices = concepts[name].map((c: any, index: any) => ({
        title: c.name || `${capitalize(name)} ${index}`,
        value: useIndex ? index : c.name,
      }));
      if (choices.length == 0) return false;
      return {
        type: 'select',
        name: useValueAsName ? 'value' : name,
        message: message || `Select the value for ${label}?`,
        choices: choices,
      };
    }
    if (typeof concept.enum !== 'undefined') {
      const choices = concept.enum.map((c: any) => ({ title: c, value: c }));
      return {
        type: 'select',
        name: useValueAsName ? 'value' : name,
        message: message || `Select the value for ${label}?`,
        ...(concept.description && { description: concept.description }),
        choices: choices,
      };
    }
    if (concept.type === 'string') {
      return concept.default
        ? {
            type: 'text',
            name: useValueAsName ? 'value' : name,
            initial: concept.default,
            ...(concept.description && { description: concept.description }),
            message: message || `What is the value for ${label}?`,
          }
        : {
            type: 'text',
            name: useValueAsName ? 'value' : name,
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
