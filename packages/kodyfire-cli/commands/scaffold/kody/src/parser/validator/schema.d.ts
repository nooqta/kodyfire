export declare const action: {
  type: string;
  properties: {
    name: {
      type: string;
    };
    type: {
      type: string;
    };
    midleware: {
      type: string;
    };
  };
};
export declare const model: {
  type: string;
};
export declare const controller: {
  type: string;
  properties: {
    model: {
      type: string;
    };
    namespace: {
      type: string;
    };
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const controllerArray: {
  type: string;
  items: {
    type: string;
    properties: {
      model: {
        type: string;
      };
      namespace: {
        type: string;
      };
      template: {
        enum: string[];
      };
    };
    required: string[];
  };
};
export declare const request: {
  type: string;
  properties: {
    model: {
      type: string;
    };
    namespace: {
      type: string;
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
export declare const requestArray: {
  type: string;
  items: {
    type: string;
    properties: {
      model: {
        type: string;
      };
      namespace: {
        type: string;
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
export declare const item: {
  type: string;
};
export declare const dependency: {
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
export declare const kernel: {
  type: string;
  properties: {
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const kernelArray: {
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
export declare const repository: {
  type: string;
  properties: {
    model: {
      type: string;
    };
    namespace: {
      type: string;
    };
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const migration: {
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
export declare const api: {
  type: string;
  properties: {
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const web: {
  type: string;
  properties: {
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const factory: {
  type: string;
  properties: {
    namespace: {
      type: string;
    };
    model: {
      type: string;
    };
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const seed: {
  type: string;
  properties: {
    namespace: {
      type: string;
    };
    model: {
      type: string;
    };
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const databaseSeed: {
  type: string;
  properties: {
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const databag: {
  type: string;
  properties: {
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const auth: {
  type: string;
  properties: {
    template: {
      enum: string[];
    };
  };
  required: string[];
};
export declare const repositoryArray: {
  type: string;
  items: {
    type: string;
    properties: {
      model: {
        type: string;
      };
      namespace: {
        type: string;
      };
      template: {
        enum: string[];
      };
    };
    required: string[];
  };
};
export declare const migrationArray: {
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
export declare const apiArray: {
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
export declare const webArray: {
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
export declare const factoryArray: {
  type: string;
  items: {
    type: string;
    properties: {
      namespace: {
        type: string;
      };
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
export declare const seedArray: {
  type: string;
  items: {
    type: string;
    properties: {
      namespace: {
        type: string;
      };
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
export declare const databaseSeedArray: {
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
export declare const authArray: {
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
export declare const dependencyArray: {
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
export declare const databagArray: {
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
export declare const schema: {
  type: string;
  properties: {
    project: {
      type: string;
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
          };
          template: {
            enum: string[];
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
          };
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
    seed: {
      type: string;
      items: {
        type: string;
        properties: {
          namespace: {
            type: string;
          };
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
  };
};
//# sourceMappingURL=schema.d.ts.map
