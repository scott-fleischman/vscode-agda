import Session from "./session";
import * as vs from "vscode";

type DecorationTypes = { [face: string]: vs.TextEditorDecorationType };

export default class Window implements vs.Disposable {
  public static createDecorationTypes(): DecorationTypes {
    return {
      bound: vs.window.createTextEditorDecorationType({ color: "purple" }),
      coinductiveconstructor: vs.window.createTextEditorDecorationType({ color: "firebrick" }),
      comment: vs.window.createTextEditorDecorationType({}),
      datatype: vs.window.createTextEditorDecorationType({ color: "mediumblue" }),
      dotted: vs.window.createTextEditorDecorationType({}),
      error: vs.window.createTextEditorDecorationType({ color: "red", textDecoration: "underline" }),
      field: vs.window.createTextEditorDecorationType({ color: "deeppink" }),
      function: vs.window.createTextEditorDecorationType({ color: "darkgreen" }),
      incompletepattern: vs.window.createTextEditorDecorationType({ backgroundColor: "purple", color: "black" }),
      inductiveconstructor: vs.window.createTextEditorDecorationType({ color: "firebrick" }),
      keyword: vs.window.createTextEditorDecorationType({}),
      macro: vs.window.createTextEditorDecorationType({ color: "aquamarine" }),
      module: vs.window.createTextEditorDecorationType({ color: "mediumblue" }),
      number: vs.window.createTextEditorDecorationType({ color: "firebrick" }),
      operator: vs.window.createTextEditorDecorationType({ color: "darkgreen" }),
      positivityproblem: vs.window.createTextEditorDecorationType({ backgroundColor: "peru", color: "black" }),
      postulate: vs.window.createTextEditorDecorationType({ color: "darkgreen" }),
      primitive: vs.window.createTextEditorDecorationType({ color: "darkgreen" }),
      primitivetype: vs.window.createTextEditorDecorationType({ color: "mediumblue" }),
      record: vs.window.createTextEditorDecorationType({ color: "mediumblue" }),
      string: vs.window.createTextEditorDecorationType({ color: "firebrick" }),
      symbol: vs.window.createTextEditorDecorationType({ color: "grey" }),
      terminationproblem: vs.window.createTextEditorDecorationType({ backgroundColor: "lightsalmon", color: "black" }),
      typechecks: vs.window.createTextEditorDecorationType({ backgroundColor: "lightblue", color: "black" }),
      unsolvedconstraint: vs.window.createTextEditorDecorationType({ backgroundColor: "yellow", color: "black" }),
      unsolvedmeta: vs.window.createTextEditorDecorationType({ backgroundColor: "yellow", color: "black" }),
    };
  }

  public static createStatusBarItem(): vs.StatusBarItem {
    const statusBarItem = vs.window.createStatusBarItem(vs.StatusBarAlignment.Right, 0);
    statusBarItem.text = "$(server) [loading]";
    statusBarItem.show();
    return statusBarItem;
  }

  public readonly decorationTypes: DecorationTypes = Window.createDecorationTypes();
  public readonly statusBarItem: vs.StatusBarItem = Window.createStatusBarItem();
  private readonly session: Session;

  constructor(session: Session) {
    this.session = session;
    return this;
  }

  public dispose() {
    this.statusBarItem.dispose();
  }
}
