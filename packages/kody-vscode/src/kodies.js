'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
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
exports.Kody = exports.KodiesProvider = void 0;
const vscode = __importStar(require('vscode'));
const path = __importStar(require('path'));
class KodiesProvider {
  constructor(kodies) {
    this.kodies = kodies;
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
      return Promise.resolve([]);
    }
    return Promise.resolve(this.getKodiesAsTreeItems(this.kodies));
  }
  getKodiesAsTreeItems(kodies) {
    const toTreeItem = (moduleName, version) => {
      return new Kody(
        moduleName,
        version,
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'kodyfire.install',
          title: `Install ${moduleName}`,
          arguments: [moduleName],
        }
      );
    };
    const treeItems = kodies
      ? kodies.map(kody => toTreeItem(kody.name, kody.id))
      : [];
    return treeItems;
  }
}
exports.KodiesProvider = KodiesProvider;
class Kody extends vscode.TreeItem {
  constructor(label, version, collapsibleState, command) {
    super(label, collapsibleState);
    this.label = label;
    this.version = version;
    this.collapsibleState = collapsibleState;
    this.command = command;
    this.iconPath = {
      light: path.join(
        __filename,
        '..',
        '..',
        'resources',
        'light',
        'play.svg'
      ),
      dark: path.join(__filename, '..', '..', 'resources', 'dark', 'play.svg'),
    };
    this.contextValue = 'kody';
    this.tooltip = `${this.label}-${this.version}`;
  }
}
exports.Kody = Kody;
//# sourceMappingURL=kodies.js.map
