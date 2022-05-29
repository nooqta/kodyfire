'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Kody = exports.Concept = exports.ConceptsProvider = void 0;
const vscode = __importStar(require('vscode'));
class ConceptsProvider {
  constructor(concepts) {
    this.concepts = concepts;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  refresh() {
    this._onDidChangeTreeData.fire();
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    const output = vscode.window.createOutputChannel('kodyfire');
    output.show();
    output.append(JSON.stringify(element));
    if (element) {
      const concept = this.concepts.find(c => c.name === element.label);
      if (!concept) {
        return Promise.resolve([]);
      }
      return Promise.resolve(
        this.getConceptsAsTreeItems(
          Object.keys(concept.concepts.concepts).map(c => ({
            name: c,
            dependency: element.label,
          })),
          vscode.TreeItemCollapsibleState.None
        )
      );
    }
    return Promise.resolve(this.getKodiesAsTreeItems(this.concepts));
  }
  getKodiesAsTreeItems(
    concepts,
    collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
  ) {
    const toTreeItem = moduleName => {
      const cmd = {
        command: 'kodyfire.install',
        title: `Install ${moduleName}`,
        arguments: [moduleName],
      };
      const command =
        collapsibleState === vscode.TreeItemCollapsibleState.None
          ? cmd
          : undefined;
      return new Kody(moduleName, collapsibleState, command);
    };
    const treeItems = concepts
      ? concepts.map(kody => toTreeItem(kody.name))
      : [];
    return treeItems;
  }
  getConceptsAsTreeItems(
    concepts,
    collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
  ) {
    const conceptToTreeItem = (dependency, concept) => {
      const cmd = {
        command: 'kodyfire.addConcept',
        title: `Add ${dependency}`,
        arguments: [dependency, concept],
      };
      const command =
        collapsibleState === vscode.TreeItemCollapsibleState.None
          ? cmd
          : undefined;
      return new Concept(concept, collapsibleState, command);
    };
    const treeItems = concepts
      ? concepts.map(kody => conceptToTreeItem(kody.dependency, kody.name))
      : [];
    return treeItems;
  }
}
exports.ConceptsProvider = ConceptsProvider;
class Concept extends vscode.TreeItem {
  constructor(label, collapsibleState, command) {
    super(label, collapsibleState);
    this.label = label;
    this.collapsibleState = collapsibleState;
    this.command = command;
    // iconPath = {
    //   light: path.join(__filename, '..', '..', 'resources', 'light', 'play.svg'),
    //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'play.svg'),
    // };
    this.contextValue = 'concept';
    this.tooltip = `${this.label}`;
  }
}
exports.Concept = Concept;
class Kody extends vscode.TreeItem {
  constructor(label, collapsibleState, command) {
    super(label, collapsibleState);
    this.label = label;
    this.collapsibleState = collapsibleState;
    this.command = command;
    // iconPath = {
    //   light: path.join(__filename, '..', '..', 'resources', 'light', 'play.svg'),
    //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'play.svg'),
    // };
    this.contextValue = 'kody';
    this.tooltip = `${this.label}`;
  }
}
exports.Kody = Kody;
//# sourceMappingURL=concepts.js.map
