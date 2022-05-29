import * as vscode from 'vscode';
import * as path from 'path';

export class KodiesProvider implements vscode.TreeDataProvider<Kody> {
  private _onDidChangeTreeData: vscode.EventEmitter<Kody | undefined | void> =
    new vscode.EventEmitter<Kody | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<Kody | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private kodies: any[]) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Kody): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Kody): Thenable<Kody[]> {
    const output = vscode.window.createOutputChannel('kodyfire');
    output.show();
    output.append(JSON.stringify(element));
    if (element) {
      return Promise.resolve([]);
    }
    return Promise.resolve(this.getKodiesAsTreeItems(this.kodies));
  }

  private getKodiesAsTreeItems(kodies: any[]): Kody[] {
    const toTreeItem = (moduleName: string, version: string): Kody => {
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

export class Kody extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private readonly version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = `${this.label}-${this.version}`;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'play.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'play.svg'),
  };

  contextValue = 'kody';
}
