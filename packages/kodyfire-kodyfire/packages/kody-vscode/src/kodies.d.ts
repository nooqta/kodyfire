import * as vscode from 'vscode';
export declare class KodiesProvider implements vscode.TreeDataProvider<Kody> {
  private kodies;
  private _onDidChangeTreeData;
  readonly onDidChangeTreeData: vscode.Event<Kody | undefined | void>;
  constructor(kodies: any[]);
  refresh(): void;
  getTreeItem(element: Kody): vscode.TreeItem;
  getChildren(element?: Kody): Thenable<Kody[]>;
  private getKodiesAsTreeItems;
}
export declare class Kody extends vscode.TreeItem {
  readonly label: string;
  private readonly version;
  readonly collapsibleState: vscode.TreeItemCollapsibleState;
  readonly command?: vscode.Command | undefined;
  constructor(
    label: string,
    version: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command | undefined
  );
  iconPath: {
    light: string;
    dark: string;
  };
  contextValue: string;
}
//# sourceMappingURL=kodies.d.ts.map
