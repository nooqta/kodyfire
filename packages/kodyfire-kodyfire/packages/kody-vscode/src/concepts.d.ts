import * as vscode from 'vscode';
export declare class ConceptsProvider
  implements vscode.TreeDataProvider<Concept>
{
  private concepts;
  private _onDidChangeTreeData;
  readonly onDidChangeTreeData: vscode.Event<Concept | undefined | void>;
  constructor(concepts: any[]);
  refresh(): void;
  getTreeItem(element: Concept): vscode.TreeItem;
  getChildren(element?: Concept | any): Thenable<any[]>;
  private getKodiesAsTreeItems;
  private getConceptsAsTreeItems;
  private getConceptPropsAsTreeItems;
}
export declare class Concept extends vscode.TreeItem {
  readonly label: string;
  readonly kody: string;
  readonly collapsibleState: vscode.TreeItemCollapsibleState;
  readonly command?: vscode.Command | undefined;
  constructor(
    label: string,
    kody: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command | undefined
  );
  contextValue: string;
}
export declare class ConceptProperty extends vscode.TreeItem {
  readonly label: string;
  readonly collapsibleState: vscode.TreeItemCollapsibleState;
  readonly command?: vscode.Command | undefined;
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command | undefined
  );
  contextValue: string;
}
export declare class Kody extends vscode.TreeItem {
  readonly label: string;
  readonly collapsibleState: vscode.TreeItemCollapsibleState;
  readonly command?: vscode.Command | undefined;
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command | undefined
  );
  contextValue: string;
}
//# sourceMappingURL=concepts.d.ts.map
