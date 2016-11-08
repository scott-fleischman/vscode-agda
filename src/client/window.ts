import { remote } from "../shared";
import Session from "./session";
import * as vs from "vscode";
import * as client from "vscode-languageclient";

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

  public async applyAnnotations(textEditor: vs.TextEditor, annotations: remote.client.IAnnotation[]): Promise<void> {
    const collatedHighlights: Map<remote.client.HighlightFace, vs.Range[]> = new Map();
    for (const { startOff, endOff, face } of annotations) {
      const start = textEditor.document.positionAt(startOff);
      const end = textEditor.document.positionAt(endOff);
      if (!collatedHighlights.has(face)) collatedHighlights.set(face, []);
      const ranges = collatedHighlights.get(face) as vs.Range[];
      ranges.push(new vs.Range(start, end));
    }
    for (const face of Object.keys(this.decorationTypes) as remote.client.HighlightFace[]) {
      // NOTE: use [] if lookup fails since we need to clear stale (i.e., no longer used) faces too
      textEditor.setDecorations(this.decorationTypes[face], collatedHighlights.get(face) || []);
    }
  }

  public dispose() {
    this.statusBarItem.dispose();
  }

  public async onDidChangeVisibleTextEditors(textEditors: vs.TextEditor[]) {
    for (let i = 0; i < textEditors.length; i++) {
      const textEditor = textEditors[i];
      if (textEditor.document.languageId !== "agda") continue;
      if (textEditor.document.isDirty) continue;
      const annotations = await this.session.languageClient.sendRequest(remote.server.giveAnnotations, client.Code2Protocol.asTextDocumentIdentifier(textEditor.document));
      this.applyAnnotations(textEditor, annotations);
    }
  }
}
