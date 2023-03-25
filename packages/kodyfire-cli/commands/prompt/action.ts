// @ts-nocheck
import chalk from 'chalk';
import { capitalize, IKody, Package } from 'kodyfire-core';
import { join, dirname } from 'path';
import { fs } from 'zx';
import { Action as InitAction } from '../init/action';
import { createReadStream, existsSync, promises as fsPromises } from 'fs';
const prompts = require('prompts');
const boxen = require('boxen');
const dotenv = require('envfile');
import { Configuration, OpenAIApi } from 'openai';
// process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
// import { Config } from 'kodyfire-config';
import { requiresm } from 'esm-ts';

export class Action {
  static currentPrompt: string;
  static isCanceled = false;
  static attemps = 0;
  static recorder: any;
  static whisperFileName = '';
  static DIRECTORY = '.kody';
  // questions for rootDir, outputDir and filename
  static questions = [
    {
      type: 'text',
      name: 'rootDir',
      message: 'What is the root directory of your project?',
      initial: process.cwd(),
    },
    {
      type: 'text',
      name: 'outputDir',
      message: 'What is the output directory of your artifact?',
      initial: '',
    },
    {
      type: 'text',
      name: 'filename',
      message: 'What is the filename of your artifact?',
      initial: '',
    },
  ];
  static async onCancel() {
    Action.isCanceled = true;
    process.exit(1);
    return true;
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

  static async prompt(
    res: any,
    thread: any[],
    prompts: any,
    keepConversation: boolean,
    prompt: any
  ) {
    this.currentPrompt = prompt;
    const { choices: response } = res.data;
    const md = await require('cli-md');
    thread.push(response);
    console.log(`${md(response[0].text)}\n`);
    const { value } = await prompts(
      {
        type: 'select',
        name: 'value',
        message: 'What would you like to do next?',
        choices: [
          { title: 'Save & Exit', value: 'save' },
          { title: 'Save & Continue', value: 'continue' },
          { title: 'Retry', value: 'retry' },
          { title: 'Exit', value: 'exit' },
        ],
        default: `save`,
      },
      {
        onCancel: () => {
          keepConversation = false;
          this.onCancel();
        },
      }
    );
    prompt = value;
    if (value == 'exit') process.exit(0);
    return { keepConversation, prompt, thread };
  }

  static async generate(prompt = '') {
    try {
      let thread: any[] = [];
      // process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
      // const config = new Config();
      const prompts = require('prompts');
      let keepConversation = true;
      if (prompt == '') {
        const { value } = await prompts(
          {
            type: 'text',
            name: 'value',
            message: this.currentPrompt || 'How can I help you?',
          },
          {
            onCancel: () => {
              keepConversation = false;
              process.exit(0);
            },
          }
        );
        prompt = value;
      }
      this.currentPrompt = prompt;

      // We initialize the OpenAI API
      this.openai = Action.initOpenAI(this.openai);

      // send a message and wait for the response
      // @ts-ignore
      const { oraPromise }: any = await requiresm('ora');

      let res = await oraPromise(
        this.openai.createCompletion({
          model: 'text-davinci-003',
          prompt: prompt,
          temperature: 0.7,
          max_tokens: 4000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
        {
          text: prompt,
        }
      );
      ({ keepConversation, prompt, thread } = await this.prompt(
        res,
        thread,
        prompts,
        keepConversation,
        prompt
      ));

      while (keepConversation && prompt != 'save') {
        if (prompt == 'continue') {
          await this.saveArtifact(thread, prompts);
        }
        prompt = this.currentPrompt = await this.getPrompt();

        res = await oraPromise(
          this.openai.createCompletion({
            model: 'text-davinci-003',
            prompt: this.currentPrompt,
            temperature: 0.7,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
          {
            text: this.currentPrompt,
          }
        );
        // @ts-ignore
        ({ keepConversation, prompt, thread } = await this.prompt(
          res,
          thread,
          prompts,
          keepConversation,
          prompt
        ));
      }
      await this.saveArtifact(thread, prompts);
    } catch (error) {
      console.log(error);
      if (this.attemps < 3) {
        this.attemps++;
        await this.generate();
      }
    }
  }

  private static initOpenAI(openai: any) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        'Make sure you provide an Openai api key in your .env file. \nie: OPENAI_API_KEY=your-openai-api-key'
      );
    }

    if (!openai) {
      openai = new OpenAIApi(
        new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        })
      );
    }
    return openai;
  }

  static async create(filename: any, content: string | Buffer) {
    await fsPromises.writeFile(filename, content);
  }

  static async saveArtifact(thread: any[], prompts: any) {
    const { rootDir, outputDir, filename } = await this.getArtifactInfo();
    const pathname = join(rootDir, outputDir, filename);
    const content = thread[thread.length - 1][0].text;
    await this.createOrOverwrite(pathname, content);
    this.displayMessage(`Artifact saved successfully at ${pathname}`, 'green');
  }
  // ask the user for the prompt to use
  static async getPrompt() {
    const { prompt } = await prompts({
      type: 'text',
      name: 'prompt',
      message: 'What is the prompt you want to use?',
      initial: this.currentPrompt,
    });
    return prompt;
  }
  static async getArtifactInfo() {
    const answers = {};
    for (const question of this.questions) {
      const value = await prompts(question);
      answers[question.name] = value[question.name];
    }
    return { ...answers };
  }

  static async createOrOverwrite(filename: any, content: string | Buffer) {
    // We need to create the directory if it doesn't exist
    await fsPromises.mkdir(dirname(filename), { recursive: true });
    await fsPromises.writeFile(filename, content);
  }
  static async execute(prompt: any, opts) {
    try {
      if (opts?.record) {
        this.recorder = await this.initAudioRecorder();
        // Start recording.
        this.recorder.start();
        // Create file path with random name.
        this.whisperFileName = join(
          process.cwd(),
          this.DIRECTORY,
          'whisper'.concat('.wav')
        );

        if (!fs.existsSync(this.DIRECTORY)) {
          fs.mkdirSync(this.DIRECTORY);
        }
        // Create write stream.
        const fileStream = fs.createWriteStream(this.whisperFileName, {
          encoding: 'binary',
        });

        // Start and write to the file.
        this.recorder.start().stream().pipe(fileStream);
        // Log information on the following events.
        this.recorder.on('error', () => {
          console.warn('Recording error.');
          process.exit(1);
        });

        this.recorder.on('close', async code => {
          if (code == 0) {
            this.recorder.stop();
            this.openai = await Action.initOpenAI(this.openai);
            const { oraPromise }: any = await requiresm('ora');

            const res = await oraPromise(
              this.openai.createTranscription(
                createReadStream(this.whisperFileName),
                'whisper-1'
              ),
              {
                text: 'Transcribing audio...',
              }
            );
            
            const { text: prompt } = res.data;
            await this.generate(prompt);
          }
        });

        process.stdin.resume();
        console.log('Recording started...');
      } else {
        await this.generate(prompt);
      }
    } catch (error: any) {
      console.log(error);
      this.displayMessage(error.message);
    }
  }
  static async initAudioRecorder() {
    // Import module.
    const AudioRecorder = require('node-audiorecorder');

    // Options is an optional parameter for the constructor call.
    // If an option is not given the default value, as seen below, will be used.
    const options = {
      program: process.platform === 'win32' ? 'sox' : 'rec', // Which program to use, either `arecord`, `rec`, or `sox`.
      device: null, // Recording device to use, e.g. `hw:1,0`

      bits: 16, // Sample size. (only for `rec` and `sox`)
      channels: 1, // Channel count.
      encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
      format: `S16_LE`, // Encoding type. (only for `arecord`)
      rate: 16000, // Sample rate.
      type: `wav`, // Format type.

      // Following options only available when using `rec` or `sox`.
      silence: 4, // Duration of silence in seconds before it stops recording.
      thresholdStart: 0.5, // Silence threshold to start recording.
      thresholdStop: 0.5, // Silence threshold to stop recording.
      keepSilence: true, // Keep the silence in the recording.
    };
    // Optional parameter intended for debugging.
    // The object has to implement a log and warn function.
    // const logger = console;

    // Create an instance.
    return new AudioRecorder(options);
  }
}
