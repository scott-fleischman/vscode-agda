import * as vscode from "vscode";

interface IDecorationTypes {
  bound: vscode.TextEditorDecorationType;
  coinductiveconstructor: vscode.TextEditorDecorationType;
  comment: vscode.TextEditorDecorationType;
  datatype: vscode.TextEditorDecorationType;
  dotted: vscode.TextEditorDecorationType;
  error: vscode.TextEditorDecorationType;
  field: vscode.TextEditorDecorationType;
  function: vscode.TextEditorDecorationType;
  keyword: vscode.TextEditorDecorationType;
  incompletepattern: vscode.TextEditorDecorationType;
  inductiveconstructor: vscode.TextEditorDecorationType;
  macro: vscode.TextEditorDecorationType;
  module: vscode.TextEditorDecorationType;
  number: vscode.TextEditorDecorationType;
  operator: vscode.TextEditorDecorationType;
  positivityproblem: vscode.TextEditorDecorationType;
  postulate: vscode.TextEditorDecorationType;
  primitive: vscode.TextEditorDecorationType;
  primitivetype: vscode.TextEditorDecorationType;
  record: vscode.TextEditorDecorationType;
  string: vscode.TextEditorDecorationType;
  symbol: vscode.TextEditorDecorationType;
  terminationproblem: vscode.TextEditorDecorationType;
  typechecks: vscode.TextEditorDecorationType;
  unsolvedconstraint: vscode.TextEditorDecorationType;
  unsolvedmeta: vscode.TextEditorDecorationType;
}

export default class ClientWindow implements vscode.Disposable {
  public readonly statusBarItem: vscode.StatusBarItem;
  public readonly decorationTypes: IDecorationTypes;

  constructor() {
    this.statusBarItem = this.initStatusBarItem();
    this.decorationTypes = this.initDecorationTypes();
    return this;
  }

  public dispose() {
    this.statusBarItem.dispose();
  }

  public initDecorationTypes(): IDecorationTypes {
    return {
      bound: vscode.window.createTextEditorDecorationType({ color: "purple" }),
      coinductiveconstructor: vscode.window.createTextEditorDecorationType({ color: "firebrick" }),
      comment: vscode.window.createTextEditorDecorationType({}),
      datatype: vscode.window.createTextEditorDecorationType({ color: "mediumblue" }),
      dotted: vscode.window.createTextEditorDecorationType({}),
      error: vscode.window.createTextEditorDecorationType({ color: "red", textDecoration: "underline" }),
      field: vscode.window.createTextEditorDecorationType({ color: "deeppink" }),
      function: vscode.window.createTextEditorDecorationType({ color: "darkgreen" }),
      incompletepattern: vscode.window.createTextEditorDecorationType({ backgroundColor: "purple", color: "black" }),
      inductiveconstructor: vscode.window.createTextEditorDecorationType({ color: "firebrick" }),
      keyword: vscode.window.createTextEditorDecorationType({}),
      macro: vscode.window.createTextEditorDecorationType({ color: "aquamarine" }),
      module: vscode.window.createTextEditorDecorationType({ color: "mediumblue" }),
      number: vscode.window.createTextEditorDecorationType({ color: "firebrick" }),
      operator: vscode.window.createTextEditorDecorationType({ color: "darkgreen" }),
      positivityproblem: vscode.window.createTextEditorDecorationType({ backgroundColor: "peru", color: "black" }),
      postulate: vscode.window.createTextEditorDecorationType({ color: "darkgreen" }),
      primitive: vscode.window.createTextEditorDecorationType({ color: "darkgreen" }),
      primitivetype: vscode.window.createTextEditorDecorationType({ color: "mediumblue" }),
      record: vscode.window.createTextEditorDecorationType({ color: "mediumblue" }),
      string: vscode.window.createTextEditorDecorationType({ color: "firebrick" }),
      symbol: vscode.window.createTextEditorDecorationType({ color: "grey" }),
      terminationproblem: vscode.window.createTextEditorDecorationType({ backgroundColor: "lightsalmon", color: "black" }),
      typechecks: vscode.window.createTextEditorDecorationType({ backgroundColor: "lightblue", color: "black" }),
      unsolvedconstraint: vscode.window.createTextEditorDecorationType({ backgroundColor: "yellow", color: "black" }),
      unsolvedmeta: vscode.window.createTextEditorDecorationType({ backgroundColor: "yellow", color: "black" }),
    };
  }

  public initStatusBarItem(): vscode.StatusBarItem {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
    statusBarItem.text = "$(hubot) [loading]";
    statusBarItem.show();
    return statusBarItem;
  }
}
