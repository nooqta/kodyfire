export declare const concept: {
    type: string;
    properties: {
        name: {
            type: string;
        };
        template: {
            type: string;
            enum: string[];
        };
        outputDir: {
            type: string;
        };
    };
};
export declare const conceptArray: {
    type: string;
    items: any;
};
export declare const schema: {
    type: string;
    properties: {
        project: {
            type: string;
        };
        name: {
            type: string;
        };
        rootDir: {
            type: string;
        };
        concept: {
            type: string;
            items: any;
        };
    };
    required: string[];
};
