[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

_The one tool that will rule them all. By developers for technical experts and non-technical experts._

> Kody, a general-purpose terminal based, low-code no-code tool that helps you generate artifacts.

# getting Started

<sub>[Video Demo](https://youtube.com/playlist?list=PLK2Evxcrq571vj0UjWtO7KnR29JkMN13L)</sub>
Getting started with Kodyfire is as easy as 1,2,3.

```sh
npm install -g kodyfire-cli
# from your project root folder
npm i react-kodyfire
kody g react component
```

## Install the CLI

Install the kody cli by running

```sh
npm install -g kodyfire-cli
```

or

```sh
yarn global add kodyfire-cli
```

You can check the documentation with

```bash
kody --help
```

## Open your project

<u>**Note**</u>: <i>If you are looking for more customization, we recommend you to create your own kody locally. [Instructions below](#create-your-kody). Don't forget to share your [kody](https://github.com/nooqta/kodyfire/issues) with us if you have made it public. </i>

Open the project you are willing to work on using vscode. If you are starting a project from scratch, you can start our experimental project installer `kody install` (not required). It will prompt you to choose the project type and the destination folder.

## Install a kody

Based on your project, select the kody that works for you or customize your own. There are [13 kody packages](#Available kodies) available at the moment.

To list available kodies. (The search command simply displays available kodies and no keyword are required.

```bash
kody search
```

The command will list available kodies.
Install your kody of choice. For example, if you want to install the react kody

```bash
npm install -s react-kodyfire
```

or

```bash
yarn add react-kodyfire
```

Please note you can install as many kodies in the same project as you wish.

## Generate your artifact

There are 2 methods you can generate your artifacts with:

- The `generate` command
- The `run` command

### Method 1: Generator mode `kody generate`

The recommended way of using kody is using the `generate` command. The command will assist you creating your artifact based on the chosen `concept`. For example, a react `component` is considered a `concept`.
In order to generate your artifacts, run the `generate` command. The syntax is `kody g|generate [kody] [concept]`. If you ommit `kody` and/or `concept` the assistant will prompt you to select the missing. As an example, run the following command from your terminal:

```sh
kody generate react component
```

### Method 2: Runner mode `kody run`

The `run` command is similar to the `generate` command. The `run` requires a definition file which is simply a json file containing all the concept definitions you have created using the `ride` command. The `generate` command on the other hand creates one or more concept definition on the run and process them on one run. Every command has its use cases.

#### Initialize kody

In order to start using kody, you need to initialize your project.

```bash
kody init
```

This will add the definition files required for kody runs.
<u>**Important**</u>: Please run the command **only once**. The command will override existing definition files. We will disable overriding in a future version.

#### Ride your kody

In order to update your definition, use the kody ride command to assist you populate the required fields

```bash
kody ride
```

#### Launch a kody run

Once you are satisified with your definition file, execute the run command to generate your artifacts.

```bash
kody run -s laravel-kody.json
```

To run all kodies defined within your project, run the following command:

```bash
kody batch
```

# Available kodies

| Name                                                                             | Description                                                                          |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [basic-kodyfire](https://github.com/nooqta/kodyfire)                             | A general purpose code generator that should handle most of the generation use cases |
| [typescript-kodyfire](https://github.com/nooqta/typescript-kodyfire)             | Generate typescript related artifacts                                                |
| [tsconfig-kodyfire](https://github.com/nooqta/tsconfig-kodyfire)                 | Generate tsconfig files for your typescript projects                                 |
| [nextjs-kodyfire](https://github.com/nooqta/nextjs-kodyfire)                     | Generate nextJs components and related artifacts                                     |
| [react-kodyfire](https://github.com/nooqta/react-kodyfire)                       | Generate react components                                                            |
| [laravel-kodyfire](https://github.com/nooqta/kodyfire)                           | Laravel artifacts generation                                                         |
| [vuexy-kodyfire](https://github.com/nooqta/kodyfire)                             | Vuexy theme artifacts generation                                                     |
| [uml-kodyfire](https://github.com/nooqta)                                        | Uml diagrams generation using plantuml                                               |
| [readme-kodyfire](https://github.com/nooqta/readme-kodyfire)                     | Readme file generation                                                               |
| [word-kodyfire](https://github.com/nooqta/word-kodyfire)                         | Generate ms word document based on a template                                        |
| [pdf-kodyfire](https://github.com/nooqta/pdf-kodyfire)                           | Generate PDF document from HTML templates                                            |
| [social-image-kodyfire](https://github.com/anis-marrouchi/social-image-kodyfire) | Generate dynamic images for social sharing based on HTML templates                   |
| [social-gif-kodyfire](https://github.com/anis-marrouchi/social-gif-kodyfire)     | Generate dynamic gif images for social sharing based on HTML templates               |

# What is Kody

Kody is a general-purpose terminal based, low-code no-code tool that helps you generate artifacts.

Kody should integrate within your development cycle flawlessly

Kody is extensible and aims to be highly customizable

Kodyfire or kody, is embeddable into existing systems like vscode, Google Chrome and all extensible system offering a Javascript/Typescript api

Third-party systems like webapps can build on top of it to further accelerate the process of generating artifacts.

We are in experimental phase and the current project is a POC for demonstration purposes

Kody is technology agnostic and can be used to generate code into your programming language and framework of choice

Here are few examples of what kody can/will do

- A REST API based on x framework (example: Laravel)
- A frontend using x framework/library (example: Vue.js)
- A fullstack web app
- A mobile app using x framework (flutter)
- A browser extension
- An editor/ IDE extension
- A Word extension
- A UML diagram using x library
- A Word document based on a model
- A PDF invoice
- Mailing
- Third-party API interactions
- Cron jobs
- Deploy an application to a web server
- Automate git commits by specifying when and what each commit includes
- Migrate from one framework to another framework
- Migrate from one database schema to another database schema
- Upgrade an x framework from version y to version z
- And much more…
- Imagination is the limit

# Objectives

- Low code benefit
- Code convention
- Increased productivity
- //TODO

# Create a kody

In most cases you might need a custom kody to suit your needs

### Scaffold a new kody

Create a basic kody using the scaffold command. Follow the prompts to setup your kody

```bash
kody scaffold
```

This will create a folder containing the basic structure for a kody. You can start using right away within your project.

### Setup your kody

#### Install npm dependencies

```bash
npm i
```

#### Build your kody

```bash
npm run build
```

### Override defaults

//TODO

### Add concepts

//TODO
This will build your kody and export the basic templates files.

#### Add as an NPM dependency

In order to be able to use it within your project run the following command

```bash
npm i -s ./yourkody-kodyfire
```

## Publish your kody

Please remember that Kody is still in exploration phase and things will change frequently. Contribution is always highly requested.

### Prepare your kody

Add the required kodyfire metadata to your package.json

```jsonc
{
  // A command for handling this part will be added in a future version
  "kodyfire": {
    "id": "your-id", // must be unique.
    "type": "kodyfire", // Example of valid technology names: laravel, express, react, angular, flutter, html, css. Default: kodyfire
    "version": "0.0.1"
  }
}
```

### Publish to Github

Intialize your project as a git repository and push to a public Github repo

### Publish to npm

Once you are satisfied with your kody and you would to like to share it with the community. Run the following command.

```bash
npm Publish
```

<u>Note</u>: <i>You'll need an NPM account</i>

### Share with community

Congratulation publishing your first kody. Don't forget to share your kody repo link by opening an issue on Kody's github repository.

# Philosophy

Single source of truth model SSOT: shared data between 2 kodies should be moved to the ssot.

Use any available third-party library that will help us achieve our goal

Continuously reduce human intervention

Gradually eliminate human introduced errors when automation is possible

Adopt a build, evaluate, and restart mindset in developing the project. Kody does not depend on the language it’s made of or the environment it lives in. Kody should adapt and mutate.

Experimental phase

# Concepts and technologies used / to be used

AST

Transducer

Transformer

Plugin & Play architecture

# Architecture

Plugin & Play architecture

# Comparison

//TODO

- Schematics
- Yoaman
- Bubble
- n8n
- appsmith
- Tooljet
- Others

# Milestones

## Low-code

//TODO

## No-code

Provide a web app for building kodies

# Future Objectives

- Intelligent Kody using AI
- Use AST to update an existing artifact
- Reverse engineering: From code to Kody definition. Possible use cases: Migrate from one technology to another
- Use as a benchmark tool
- Kodies as a node within a network
- Aggressive automation: Pushing the boundaries of what automation can do for us
- Kody endless run

# Packages

**Kodyfire**: The main repo. Hold the documentation and all kody related packages. Uses lerna to handle npm package management.

**Kodyfire-core**: Contains the things that are common to all other kody package.

**Laravel-kodyfire**: A kody package to generate Laravel related artifact. This a ported package from an existing and requires refactoring to make simpler. Documentation to be added.

**Vuexy-kodyfire**: A kody package to generate vuexy theme related artifact. A valid license and your own copy of vuexy theme is required. Documentation to be added.

**Kodyfire-cli**: The command line tool to run kody runs

# Credits

- Typescript
- Angular schematics
- Commander
- Prompts
- Handlebars
- xz
- Ajv
- php-parser
- Boxen
- //TODO: List all third-party libraries

# Glossary/Terminology

//TODO

- SSOT: // TODO
- Artifact: // TODO
- Template: // TODO
- Definition file: // TODO
- Definition source: // TODO
- Resolver: // TODO
- Transformer: // TODO
- Recipe: // TODO
- Domino: // TODO
- Ride: // TODO
- Schema: // TODO
- Technology: // TODO
- Kody: // TODO
- Concept: // TODO
- Command: // TODO
- Kodyfire: // TODO
- Run: // TODO
- Root source: // TODO
