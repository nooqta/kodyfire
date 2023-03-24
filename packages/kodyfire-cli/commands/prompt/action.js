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
exports.Action = void 0;
const path_1 = require("path");
const zx_1 = require("zx");
const fs_1 = require("fs");
const prompts = require('prompts');
const boxen = require('boxen');
const dotenv = require('envfile');
const openai_1 = require("openai");
// process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
// import { Config } from 'kodyfire-config';
const esm_ts_1 = require("esm-ts");
class Action {
    static onCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            Action.isCanceled = true;
            process.exit(1);
            return true;
        });
    }
    static displayMessage(message, borderColor = 'yellow') {
        console.log(boxen(message, {
            padding: 1,
            margin: 1,
            align: 'center',
            borderColor,
            borderStyle: 'round',
        }));
    }
    static prompt(res, thread, prompts, keepConversation, prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentPrompt = prompt;
            const { choices: response } = res.data;
            const md = yield require('cli-md');
            thread.push(response);
            console.log(`${md(response[0].text)}\n`);
            const { value } = yield prompts({
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
            }, {
                onCancel: () => {
                    keepConversation = false;
                    this.onCancel();
                },
            });
            prompt = value;
            if (value == 'exit')
                process.exit(0);
            return { keepConversation, prompt, thread };
        });
    }
    static generate(prompt = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let thread = [];
                // process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
                // const config = new Config();
                const prompts = require('prompts');
                let keepConversation = true;
                if (prompt == '') {
                    const { value } = yield prompts({
                        type: 'text',
                        name: 'value',
                        message: this.currentPrompt || 'How can I help you?',
                    }, {
                        onCancel: () => {
                            keepConversation = false;
                            process.exit(0);
                        },
                    });
                    prompt = value;
                }
                this.currentPrompt = prompt;
                // We initialize the OpenAI API
                this.openai = Action.initOpenAI(this.openai);
                // send a message and wait for the response
                // @ts-ignore
                const { oraPromise } = yield (0, esm_ts_1.requiresm)('ora');
                let res = yield oraPromise(this.openai.createCompletion({
                    model: 'text-davinci-003',
                    prompt: prompt,
                    temperature: 0.7,
                    max_tokens: 4000,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                }), {
                    text: prompt,
                });
                ({ keepConversation, prompt, thread } = yield this.prompt(res, thread, prompts, keepConversation, prompt));
                while (keepConversation && prompt != 'save') {
                    if (prompt == 'continue') {
                        yield this.saveArtifact(thread, prompts);
                    }
                    prompt = this.currentPrompt = yield this.getPrompt();
                    res = yield oraPromise(this.openai.createCompletion({
                        model: 'text-davinci-003',
                        prompt: this.currentPrompt,
                        temperature: 0.7,
                        max_tokens: 4000,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0,
                    }), {
                        text: this.currentPrompt,
                    });
                    // @ts-ignore
                    ({ keepConversation, prompt, thread } = yield this.prompt(res, thread, prompts, keepConversation, prompt));
                }
                yield this.saveArtifact(thread, prompts);
            }
            catch (error) {
                console.log(error);
                if (this.attemps < 3) {
                    this.attemps++;
                    yield this.generate();
                }
            }
        });
    }
    static initOpenAI(openai) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('Make sure you provide an Openai api key in your .env file. \nie: OPENAI_API_KEY=your-openai-api-key');
        }
        if (!openai) {
            openai = new openai_1.OpenAIApi(new openai_1.Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            }));
        }
        return openai;
    }
    static create(filename, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.promises.writeFile(filename, content);
        });
    }
    static saveArtifact(thread, prompts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootDir, outputDir, filename } = yield this.getArtifactInfo();
            const pathname = (0, path_1.join)(rootDir, outputDir, filename);
            const content = thread[thread.length - 1][0].text;
            yield this.createOrOverwrite(pathname, content);
            this.displayMessage(`Artifact saved successfully at ${pathname}`, 'green');
        });
    }
    // ask the user for the prompt to use
    static getPrompt() {
        return __awaiter(this, void 0, void 0, function* () {
            const { prompt } = yield prompts({
                type: 'text',
                name: 'prompt',
                message: 'What is the prompt you want to use?',
                initial: this.currentPrompt,
            });
            return prompt;
        });
    }
    static getArtifactInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const answers = {};
            for (const question of this.questions) {
                const value = yield prompts(question);
                answers[question.name] = value[question.name];
            }
            return Object.assign({}, answers);
        });
    }
    static createOrOverwrite(filename, content) {
        return __awaiter(this, void 0, void 0, function* () {
            // We need to create the directory if it doesn't exist
            yield fs_1.promises.mkdir((0, path_1.dirname)(filename), { recursive: true });
            yield fs_1.promises.writeFile(filename, content);
        });
    }
    static execute(prompt, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (opts === null || opts === void 0 ? void 0 : opts.record) {
                    this.recorder = yield this.initAudioRecorder();
                    // Start recording.
                    this.recorder.start();
                    // Create file path with random name.
                    this.whisperFileName = (0, path_1.join)(process.cwd(), this.DIRECTORY, 'whisper'.concat('.wav'));
                    console.log('Writing new recording file at:', this.whisperFileName);
                    // Create write stream.
                    const fileStream = zx_1.fs.createWriteStream(this.whisperFileName, {
                        encoding: 'binary',
                    });
                    // Start and write to the file.
                    this.recorder.start().stream().pipe(fileStream);
                    // Log information on the following events.
                    this.recorder.on('error', () => {
                        console.warn('Recording error.');
                        process.exit(1);
                    });
                    this.recorder.on('close', (code) => __awaiter(this, void 0, void 0, function* () {
                        if (code == 0) {
                            this.recorder.stop();
                            this.openai = yield Action.initOpenAI(this.openai);
                            const { oraPromise } = yield (0, esm_ts_1.requiresm)('ora');
                            const res = yield oraPromise(this.openai.createTranscription((0, fs_1.createReadStream)(this.whisperFileName), 'whisper-1'), {
                                text: 'Transcribing audio...',
                            });
                            const { text: prompt } = res.data;
                            yield this.generate(prompt);
                        }
                    }));
                    process.stdin.resume();
                    console.log('Recording started...');
                }
                else {
                    yield this.generate(prompt);
                }
            }
            catch (error) {
                console.log(error);
                this.displayMessage(error.message);
            }
        });
    }
    static initAudioRecorder() {
        return __awaiter(this, void 0, void 0, function* () {
            // Import module.
            const AudioRecorder = require('node-audiorecorder');
            // Options is an optional parameter for the constructor call.
            // If an option is not given the default value, as seen below, will be used.
            const options = {
                program: process.platform === 'win32' ? 'sox' : 'rec',
                device: null,
                bits: 16,
                channels: 1,
                encoding: `signed-integer`,
                format: `S16_LE`,
                rate: 16000,
                type: `wav`,
                // Following options only available when using `rec` or `sox`.
                silence: 4,
                thresholdStart: 0.5,
                thresholdStop: 0.5,
                keepSilence: true, // Keep the silence in the recording.
            };
            // Optional parameter intended for debugging.
            // The object has to implement a log and warn function.
            const logger = console;
            // Create an instance.
            return new AudioRecorder(options, logger);
        });
    }
}
exports.Action = Action;
Action.isCanceled = false;
Action.attemps = 0;
Action.whisperFileName = '';
Action.DIRECTORY = '.kody';
// questions for rootDir, outputDir and filename
Action.questions = [
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
//# sourceMappingURL=action.js.map