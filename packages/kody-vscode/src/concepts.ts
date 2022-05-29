import * as vscode from 'vscode';
import * as path from 'path';

export class ConceptsProvider implements vscode.TreeDataProvider<Concept> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    Concept | undefined | void
  > = new vscode.EventEmitter<Concept | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<Concept | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private concepts: any[]) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Concept): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Concept | any): Thenable<Concept[]> {
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
  private getKodiesAsTreeItems(
    concepts: any[],
    collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
  ): Kody[] {
    const toTreeItem = (moduleName: any): Concept => {
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
  private getConceptsAsTreeItems(
    concepts: any[],
    collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
  ): Concept[] {
    const conceptToTreeItem = (dependency: any, concept: string): Concept => {
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

export class Concept extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = `${this.label}`;
  }

  // iconPath = {
  //   light: path.join(__filename, '..', '..', 'resources', 'light', 'play.svg'),
  //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'play.svg'),
  // };

  contextValue = 'concept';
}
export class Kody extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    this.tooltip = `${this.label}`;
  }

  // iconPath = {
  //   light: path.join(__filename, '..', '..', 'resources', 'light', 'play.svg'),
  //   dark: path.join(__filename, '..', '..', 'resources', 'dark', 'play.svg'),
  // };

  contextValue = 'kody';
}
