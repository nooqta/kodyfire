declare const _default: {
    kody: {
        type: string;
    };
    recipes: {
        source: {
            type: string;
        };
        target: {
            type: string;
        };
        name: {
            type: string;
        };
        mapping: {
            type: string;
            properties: {
                name: {
                    type: string;
                };
                templateFolder: {
                    type: string;
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
                                    };
                                    rules: {
                                        type: string;
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
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    }[];
};
export default _default;
