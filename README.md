[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

*Kody is a command-line tool for generating artifact files, powered by both classic and AI code generation techniques. It can be used by both technical and non-technical users to generate files across a wide range of technologies.*

The code generation feature in Kody relies on [OpenAI GPT](https://openai.com/), a language model that uses deep learning to generate human-like text, and ChatGPT to provide natural language processing capabilities.

Table of Contents
-----------------

*   [Installation](#installation)
*   [Usage](#usage)
*   [Getting Started](#Getting%20Started)
*   [Terminology](#terminology)
*   [Contributing](#contributing)
*   [License](#license)

Installation
------------

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (version 14 or later)

To install `kody`, use `npm` with the following command:

```bash
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

Usage
-----

```bash
kody [options] [command]
```

### Options

*   `-v, --version`: Output the current version
*   `-h, --help`: Display help for command

### Commands

*   `prompt|ai [options] [prompt...]`: AI powered prompt assistant to quickly generate an artifact
*   `batch [options]`: Generate multiple digital artifact
*   `create [options] <name> <technology>`: Generate a new blank kody project
*   `generate|g [options] [kody] [concept]`: Prompt assistant to quickly generate an artifact
*   `import|in [options] <kody> <concepts>`: Mass create artifacts from a source.
*   `init`: Initialize a new kodyfire project
*   `install|i [kody]`: Prompt user to choose to install
*   `list|ls [options] [kodyName]`: List installed kodies within your current project.
*   `publish <kody> [template]`: Publish the templates of the kody along with the assets.json and schema.ts files
*   `ride|↻`: Prompt assistant to help build your kody.json file
*   `run [options]`: Generate a digital artifact based on the selected technology
*   `run-script|rs`: Run scripts
*   `search|s [keywords...]`: Search kodyfire packages from npm registry
*   `watch|w [options]`: Watch for file changes and run kody
*   `help [command]`: Display help for command


Getting Started
----------------


Open the project you are willing to work on using vscode or your prefered editor.
### Generate artifacts using AI
In case you want to exclusivly rely on AI to generate your artifacts. I don't need to install any additional kodies. Run the `kody ai [prompt]` command and follow the prompts.

```sh
kody ai create a Laravel Controller named SampleController under API/V1. Add a comment on top saying Hello Kodyfire!
```
You can use the experimental speech to text (STT) option to pass your prompt using your voice.
```sh
kody ai create a Laravel Controller named SampleController under API/V1. Add a comment on top saying Hello Kodyfire! -r
```
The transcription relies on [Whisper](https://openai.com/research/whisper) and requires [SoX](http://sox.sourceforge.net/) installed and available in your \$PATH. for the audio recording.
### For Linux

```
sudo apt-get install sox libsox-fmt-all
```

### For MacOS

```
brew install sox
```

### For Windows

[Download the binaries](http://sourceforge.net/projects/sox/files/latest/download)
### Generate your artifact using the classical method

#### Search and install a kody

Based on your project, search [availables kodies](#Available%20kodies) and select the one that fits your need..

To search [availables kodies](#Available%20kodies) by keyword runthe following command. if you don't specify a keyword all available kodies will be listed.

```bash
kody search [keyword]
```

Install your kody of choice. For example, if you want to install the react kody

```bash
kody install react
```

or

```bash
npm install -s react-kodyfire
```

Please note you can install as many kodies in the same project as you wish.

#### Generate your artifact

There are 2 methods you can generate your artifacts with:

- The `generate` command
- The `run` command

##### Method 1: Generator mode `kody generate`

The recommended way of using kody is using the `generate` command. The command will assist you creating your artifact based on the chosen `concept`. For example, a react `component` is considered a `concept`.
In order to generate your artifacts, run the `generate` command. The syntax is `kody g|generate [kody] [concept]`. the assistant will prompt you to select the missing arguments. As an example, run the following command from your terminal:

```sh
kody generate react component
```

##### Method 2: Runner mode `kody run`

The `run` command is similar to the `generate` command. The `run` requires a definition file which is simply a json file containing all the concept definitions you have created using the `ride` command. The `generate` command on the other hand creates one or more concept definition on the run and process them on one run. Every command has its use cases.

###### Initialize kody

In order to start using kody, you need to initialize your project.

```bash
kody init
```

This will add the definition files required for kody runs.
<u>**Important**</u>: Please run the command **only once**. The command will override existing definition files. We will disable overriding in a future version.

###### Ride your kody

In order to update your definition, use the kody ride command to assist you populate the required fields

```bash
kody ride
```

###### Launch a kody run

Once you are satisified with your definition file, execute the run command to generate your artifacts.

```bash
kody run -s laravel-kody.json
```

To run all kodies defined within your project, run the following command:

```bash
kody batch
```
### Create your own kody

In most cases you might need a custom kody to suit your needs

#### Scaffold a new kody

Create a basic kody using the scaffold command. Follow the prompts to setup your kody

```bash
kody scaffold
```

This will create a folder containing the basic structure for a kody. You can start using right away within your project.

#### Setup your kody

##### Install npm dependencies

```bash
npm i
```

##### Build your kody

```bash
npm run build
```

#### Add your concepts and related templates

//TODO
This will build your kody and export the basic templates files.

##### Add your kody as an NPM dependency to a test project

In order to be able to use it within your test project run the following command

```bash
npm i -s ./yourkody-kodyfire
```

### Publish your kody

Please remember that Kody is still in exploration phase and things will change frequently. Contribution is always highly requested.

#### Prepare your kody

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

#### Publish to Github

Intialize your project as a git repository and push to a public Github repo

To do so, kindly follow these steps:-

1. Intitialize a new Github repository and make it public.
2. Open your project root folder locally from terminal and run the following commands:-

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial Commit!"
```

3. Link your project to your Github repository.

```bash
git remote add origin <copied URL>
```

```bash
git push origin main
```

#### Publish to npm

Once you are satisfied with your kody and you would to like to share it with the community. Run the following command.

```bash
npm Publish
```

<u>Note</u>: <i>You'll need an NPM account</i>

#### Share with community

Congratulation publishing your first kody. Don't forget to share your kody repo link by opening an issue on Kody's github repository.

Terminology
-----------

*   **Kody**: Refers to the code generation command-line tool that generates digital artifacts.
*   **Artifacts**: Refers to the various digital products generated by Kody based on the input provided.

**Note:** Kody uses classical code generation techniques in addition to AI-powered code generation using OpenAI Codex and ChatGPT.

Available kodies
----------------

| Name                                                                             | Description                                                                                                                                                      |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [basic-kodyfire](https://github.com/nooqta/kodyfire)                             | A general purpose code generator that should handle most of the generation use cases                                                                             |
| [typescript-kodyfire](https://github.com/nooqta/typescript-kodyfire)             | Generate typescript related artifacts                                                                                                                            |
| [tsconfig-kodyfire](https://github.com/nooqta/tsconfig-kodyfire)                 | Generate tsconfig files for your typescript projects                                                                                                             |
| [nextjs-kodyfire](https://github.com/nooqta/nextjs-kodyfire)                     | Generate nextJs components and related artifacts                                                                                                                 |
| [react-kodyfire](https://github.com/nooqta/react-kodyfire)                       | Generate react components                                                                                                                                        |
| [laravel-kodyfire](https://github.com/nooqta/laravel-kodyfire)                   | Laravel artifacts generation                                                                                                                                     |
| [uml-kodyfire](https://github.com/nooqta)                                        | Uml diagrams generation using plantuml                                                                                                                           |
| [readme-kodyfire](https://github.com/nooqta/readme-kodyfire)                     | Readme file generation                                                                                                                                           |
| [word-kodyfire](https://github.com/nooqta/word-kodyfire)                         | Generate ms word document based on a template                                                                                                                    |
| [pdf-kodyfire](https://github.com/nooqta/pdf-kodyfire)                           | Generate PDF document from HTML templates                                                                                                                        |
| [social-image-kodyfire](https://github.com/anis-marrouchi/social-image-kodyfire) | Generate dynamic images for social sharing based on HTML templates                                                                                               |
| [social-gif-kodyfire](https://github.com/anis-marrouchi/social-gif-kodyfire)     | Generate dynamic gif images for social sharing based on HTML templates                                                                                           |
| [linkedin-quizzes-kodyfire](https://github.com/nooqta/linkedin-quizzes-kodyfire) | Practice Linkedin skill assessement tests from your terminal                                                                                                     |
| [chatgpt-kodyfire](https://github.com/nooqta/chatgpt-kodyfire)                   | Use chatgpt from the terminal. Allows you provide additional data from various sources (not implemented yet) and export to serveral outputs (markdown only now). |

Contributing
------------

If you encounter any issues while using Kody or have suggestions for new features, feel free to open an issue or submit a pull request.

Please read our [contributing guidelines](CONTRIBUTING.md) before making contributions.

License
-------

Kody is [MIT licensed](LICENSE).