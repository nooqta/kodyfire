/// <reference types="node" />
import EventEmitter from 'events';
import { BaseKody, IGenerator, IKody, IParser, ITechnology } from 'kodyfire-core';
import { Technology } from '.';
export declare class Kody extends BaseKody implements IKody {
    [x: string]: any;
    parser: IParser;
    generator: IGenerator;
    technology: ITechnology;
    events: EventEmitter;
    constructor(params: any, _schema?: {
        type: string;
        properties: {
            project: {
                type: string;
            };
            model: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                            description: string;
                        };
                        namespace: {
                            type: string;
                            default: string;
                        };
                        isMorph: {
                            type: string;
                            default: boolean;
                        };
                        template: {
                            enum: string[];
                            default: string;
                        };
                        softDelete: {
                            type: string;
                            default: boolean;
                        };
                        relationships: {
                            type: string;
                            description: string;
                            items: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                    model: {
                                        type: string;
                                    };
                                };
                            };
                        };
                        fields: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                    faker_type: {
                                        type: string;
                                        description: string;
                                        enum: string[];
                                    };
                                    arguments: {
                                        type: string;
                                        items: {
                                            description: string;
                                            type: string;
                                        };
                                    };
                                    options: {
                                        type: string;
                                        items: {
                                            type: string;
                                            properties: {
                                                key: {
                                                    type: string;
                                                };
                                                value: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        foreign_keys: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    model: {
                                        type: string;
                                    };
                                    column: {
                                        type: string;
                                    };
                                    reference: {
                                        type: string;
                                        default: string;
                                    };
                                    on: {
                                        type: string;
                                    };
                                    onUpdate: {
                                        type: string;
                                        default: string;
                                    };
                                    onDelete: {
                                        type: string;
                                        default: string;
                                    };
                                };
                            };
                        };
                        fillable: {
                            type: string;
                            items: {
                                description: string;
                                type: string;
                            };
                        };
                    };
                    required: string[];
                };
            };
            controller: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        model: {
                            type: string;
                        };
                        namespace: {
                            type: string;
                            default: string;
                        };
                        template: {
                            enum: string[];
                        };
                        routeType: {
                            type: string;
                            enum: string[];
                        };
                        middleware: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        actions: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                    options: {
                                        type: string;
                                        properties: {
                                            template: {
                                                type: string;
                                            };
                                            data: {
                                                type: string;
                                                items: {
                                                    type: string;
                                                    properties: {
                                                        placeholder: {
                                                            type: string;
                                                        };
                                                        value: {
                                                            type: string;
                                                        };
                                                        convert_to_pdf: {
                                                            type: string;
                                                            default: boolean;
                                                        };
                                                        save_on_disc: {
                                                            type: string;
                                                            default: boolean;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                    routeName: {
                                        type: string;
                                    };
                                    relation: {
                                        type: string;
                                    };
                                    middleware: {
                                        type: string;
                                    };
                                    searchBy: {
                                        type: string;
                                        items: {
                                            type: string;
                                            properties: {
                                                name: {
                                                    type: string;
                                                };
                                                type: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                    filterBy: {
                                        type: string;
                                        items: {
                                            type: string;
                                            properties: {
                                                relation: {
                                                    type: string;
                                                };
                                                relationName: {
                                                    type: string;
                                                };
                                                field: {
                                                    type: string;
                                                };
                                                type: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    required: string[];
                };
            };
            test: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        model: {
                            type: string;
                        };
                        template: {
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            lang: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        model: {
                            type: string;
                        };
                        template: {
                            enum: string[];
                        };
                        language: {
                            type: string;
                            enum: string[];
                            default: string;
                        };
                        texts: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    key: {
                                        type: string;
                                    };
                                    value: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                    required: string[];
                };
            };
            request: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        model: {
                            type: string;
                        };
                        namespace: {
                            type: string;
                            default: string;
                        };
                        template: {
                            enum: string[];
                        };
                        prefix: {
                            type: string;
                            default: string;
                        };
                    };
                    required: string[];
                };
            };
            kernel: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        template: {
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            repository: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        model: {
                            type: string;
                        };
                        namespace: {
                            type: string;
                            default: string;
                        };
                        template: {
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            migration: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        model: {
                            type: string;
                        };
                        template: {
                            enum: string[];
                            default: string;
                        };
                    };
                    required: string[];
                };
            };
            api: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        template: {
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            web: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        template: {
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            factory: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        namespace: {
                            type: string;
                            default: string;
                        };
                        model: {
                            type: string;
                        };
                        template: {
                            enum: string[];
                            default: string;
                        };
                    };
                    required: string[];
                };
            };
            seed: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        namespace: {
                            type: string;
                            default: string;
                        };
                        model: {
                            anyOf: {
                                type: string;
                            }[];
                        };
                        template: {
                            enum: string[];
                            default: string;
                        };
                    };
                    required: string[];
                };
            };
            databaseSeed: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        template: {
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            auth: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        template: {
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            dependency: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        install: {
                            type: string;
                        };
                        template: {
                            type: string;
                        };
                        commands: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        middleware: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                    };
                    required: string[];
                };
            };
            databag: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        template: {
                            enum: string[];
                        };
                    };
                    required: string[];
                };
            };
            customConcept: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        model: {
                            anyOf: {
                                type: string;
                            }[];
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
            };
        };
    }, technology?: Technology);
    generate(_content: any): void;
    parse(content: any): any;
    read(source: any): any;
    write(source: string, content: any): any;
    get errors(): any;
    get data(): any;
    whereami(): string;
    whoami(): string;
}
