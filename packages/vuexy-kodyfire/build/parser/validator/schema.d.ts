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
        page: {
            type: string;
            items: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        template: {
                            enum: string[];
                        };
                    };
                };
            };
        };
        authPage: {
            type: string;
            items: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        template: {
                            enum: string[];
                        };
                    };
                };
            };
        };
        router: {
            type: string;
            items: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        template: {
                            enum: string[];
                        };
                    };
                };
            };
        };
        route: {
            type: string;
            items: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        description: string;
                        enum: string[];
                    };
                    template: {
                        type: string;
                        description: string;
                        enum: string[];
                    };
                    routes: {
                        type: string;
                        description: string;
                        items: {
                            type: string;
                            properties: {
                                path: {
                                    type: string;
                                    description: string;
                                };
                                name: {
                                    type: string;
                                    description: string;
                                };
                                component: {
                                    type: string;
                                    description: string;
                                };
                                meta: {
                                    description: string;
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: {
                                            key: {
                                                type: string;
                                                description: string;
                                            };
                                            value: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        navigation: {
            type: string;
            items: {
                type: string;
                properties: {
                    layout: {
                        type: string;
                        description: string;
                        enum: string[];
                    };
                    template: {
                        enum: string[];
                        default: string;
                    };
                    routes: {
                        description: string;
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                header: {
                                    type: string;
                                    description: string;
                                };
                                icon: {
                                    type: string;
                                    description: string;
                                    enum: string[];
                                };
                                routeName: {
                                    type: string;
                                    description: string;
                                };
                                resource: {
                                    type: string;
                                    description: string;
                                };
                                action: {
                                    type: string;
                                    description: string;
                                    enum: string[];
                                    default: string;
                                };
                                children: {
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: {
                                            title: {
                                                type: string;
                                            };
                                            routeName: {
                                                type: string;
                                            };
                                            resource: {
                                                type: string;
                                            };
                                            action: {
                                                type: string;
                                                enum: string[];
                                                default: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        asset: {
            type: string;
            items: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        template: {
                            enum: string[];
                        };
                    };
                };
            };
        };
        module: {
            type: string;
            items: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        description: string;
                    };
                    label: {
                        type: string;
                        description: string;
                    };
                    templateFolder: {
                        type: string;
                        enum: string[];
                        description: string;
                        default: string;
                    };
                    data: {
                        type: string;
                        properties: {
                            form_fields: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        name: {
                                            type: string;
                                        };
                                        label: {
                                            type: string;
                                        };
                                        type: {
                                            type: string;
                                            enum: string[];
                                        };
                                        rules: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                            form_groups: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        title: {
                                            type: string;
                                        };
                                        icon: {
                                            type: string;
                                            enum: string[];
                                        };
                                        fields: {
                                            type: string;
                                            items: {
                                                type: string;
                                                properties: {
                                                    name: {
                                                        type: string;
                                                    };
                                                    label: {
                                                        type: string;
                                                    };
                                                    type: {
                                                        type: string;
                                                        enum: string[];
                                                    };
                                                    rules: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            columns: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        name: {
                                            type: string;
                                        };
                                        label: {
                                            type: string;
                                        };
                                        type: {
                                            type: string;
                                            enum: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};
