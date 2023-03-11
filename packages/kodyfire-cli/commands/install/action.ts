// import { $ } from "zx";
import { capitalize } from 'kodyfire-core';
import { join } from 'path';
import { $, cd, fs } from 'zx';

const prompts = require('prompts');
// import { $ } from 'zx';
const boxen = require('boxen');
// const { spawn } = require('child_process');
const kodies = async () => {
  const kodies = JSON.parse((await $`npm search kodyfire -j -l`).toString())
  return kodies.filter((kody:any) =>kody.name.includes('-kodyfire'));
}


export class Action {
  static async prompter(kody: string): Promise<void | any> {
    let path = './';
    const choices = await kodies()
    const questions = [
      {
        type: 'autocomplete',
        name: 'kody',
        message: `Which kody do want to install?`,
        choices: choices.map((project: any) => ({
          title: project.name,
          value: project.name,
        })),
      },
      {
        type: 'text',
        name: 'path',
        message: `Where do you want to save the kody?`,
        initial: './',
      },
    ];
    if(kody) {
      // we check if the kody exists within the kodies list
      const kodyExists = choices.find((choice: any) => choice.name.includes(kody));
      if(!kodyExists) {
        this.displayMessage(`😞 No kody found with the name ${kody}.`);
        return;
      }
      kody = kodyExists.name;
    } else {
    const response = await prompts(questions);
      kody = response.kody;
      path= response.path;
      // create project
      if (!kody || !path) {
        this.displayMessage('Missing required fields');
        return;
      }
    }
      await this.runCommand(kody, path);
  }

  static async runCommand(kody: string, path = './') {

    const dest = join(process.cwd(), path);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    // @todo: upgrade to latest zx
    cd(dest);
    $.verbose = true;
    $`npm i ${kody}`;
    // or spawn for zx version < 6.0.0
    // await spawn(project.command, project.args, { stdio: 'inherit' });
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
  static async execute(kody: string) {
    try {
      await this.prompter(kody);
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
  static getSchemaDefinition(dependency: string, rootDir: string) {
    return JSON.parse(
      fs.readFileSync(
        join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
        'utf8'
      )
    );
  }
  static async conceptToQuestion(
    name: string,
    concept: { type?: string; enum?: any },
    concepts: any = {},
    message: boolean | string = false,
    useIndex = false
  ): Promise<any | void> {
    if (concepts[name] && typeof concepts[name] != 'string') {
      const choices = concepts[name].map((c: any, index: any) => ({
        title: c.name || `${capitalize(name)} ${index}`,
        value: useIndex ? index : c.name,
      }));
      return {
        type: 'select',
        name: name,
        message: message || `Select the value for ${name}?`,
        choices: choices,
      };
    }
    if (typeof concept.enum !== 'undefined') {
      return {
        type: 'select',
        name: name,
        message: message || `Select the value for ${name}?`,
        choices: concept.enum.map((c: any) => ({ title: c, value: c })),
      };
    }
    if (concept.type === 'string') {
      return {
        type: 'text',
        name: name,
        message: message || `What is the value for ${name}?`,
      };
    }
    if (concept.type === 'array') {
      return {
        type: 'array',
        name: name,
        message: message || `What is the value for ${name}?`,
      };
    }
  }
}
