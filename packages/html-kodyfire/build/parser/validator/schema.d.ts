export declare const page: {
    type: string;
    properties: {
        title: {
            type: string;
        };
        content: {
            type: string;
        };
        template: {
            enum: string[];
        };
    };
    required: string[];
};
export declare const pagesArray: {
    type: string;
    items: {
        type: string;
        properties: {
            title: {
                type: string;
            };
            content: {
                type: string;
            };
            template: {
                enum: string[];
            };
        };
        required: string[];
    };
};
export declare const schema: {
    type: string;
    properties: {
        pages: {
            type: string;
            items: {
                type: string;
                properties: {
                    title: {
                        type: string;
                    };
                    content: {
                        type: string;
                    };
                    template: {
                        enum: string[];
                    };
                };
                required: string[];
            };
        };
    };
};
