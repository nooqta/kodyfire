/// <reference types="node" />
export declare class Action {
    static currentPrompt: string;
    static isCanceled: boolean;
    static attemps: number;
    static recorder: any;
    static whisperFileName: string;
    static DIRECTORY: string;
    static questions: {
        type: string;
        name: string;
        message: string;
        initial: string;
    }[];
    static onCancel(): Promise<boolean>;
    static displayMessage(message: string, borderColor?: string): void;
    static prompt(res: any, thread: any[], prompts: any, keepConversation: boolean, prompt: any): Promise<{
        keepConversation: boolean;
        prompt: any;
        thread: any[];
    }>;
    static generate(prompt?: string): Promise<void>;
    private static initOpenAI;
    static create(filename: any, content: string | Buffer): Promise<void>;
    static saveArtifact(thread: any[], prompts: any): Promise<void>;
    static getPrompt(): Promise<any>;
    static getArtifactInfo(): Promise<{}>;
    static createOrOverwrite(filename: any, content: string | Buffer): Promise<void>;
    static execute(prompt: any, opts: any): Promise<void>;
    static initAudioRecorder(): Promise<any>;
}
//# sourceMappingURL=action.d.ts.map