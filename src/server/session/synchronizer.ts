import { remote, types } from "../../shared";
import Session from "./index";
import * as assert from "assert";

export class TextDocumentState {
  public annotations: remote.client.IAnnotation[] = [];
  public diagnostics: types.Diagnostic[] = [];
}

export default class Synchronizer {
  private session: Session;
  private textDocuments: Map<string, TextDocumentState> = new Map();

  constructor(session: Session) {
    this.session = session;
    return this;
  }

  public dispose(): void {
    return;
  }

  public async initialize(): Promise<void> {
    return;
  }

  public listen(): void {
    this.session.connection.onDidCloseTextDocument(({ textDocument }) => {
      // this.session.connection.console.log(`onDidCloseTextDocument: ${textDocument.uri}`);
      // this.session.log(`onDidCloseTextDocument: ${Array.from(this.textDocuments.entries())}`);
      this.textDocuments.delete(textDocument.uri);
      this.session.analyzer.clear(textDocument);
    });

    this.session.connection.onDidOpenTextDocument(async ({ textDocument }): Promise<void> => {
      // this.session.connection.console.log(`onDidOpenTextDocument: ${textDocument.uri}`);
      // this.session.connection.console.log(`onDidOpenTextDocument: ${JSON.stringify(Array.from(this.textDocuments.entries()))}`);
      this.textDocuments.set(textDocument.uri, new TextDocumentState());
      this.session.analyzer.refreshImmediate(textDocument);
    });

    this.session.connection.onDidChangeTextDocument(async ({}): Promise<void> => {
      // this.session.connection.console.log(`onDidChangeTextDocument: ${textDocument.uri}`);
      // for (const change of event.contentChanges) {
      //   if (change && change.range) {
      //   };
      // }
      // this.session.analyzer.refreshDebounced(event.textDocument);
    });

    this.session.connection.onDidSaveTextDocument(async ({ textDocument }): Promise<void> => {
      // this.session.connection.console.log(`onDidSaveTextDocument: ${textDocument.uri}`);
      this.session.analyzer.refreshImmediate(textDocument);
    });
  }

  public onDidChangeConfiguration(): void {
    return;
  }

  public pushDiagnostics(fileName: string, diagnostics: types.Diagnostic[]): void {
    const textDocument = { uri: `file://${fileName}` };
    assert (this.textDocuments.has(textDocument.uri));
    const state = this.textDocuments.get(textDocument.uri) as TextDocumentState;
    Array.prototype.push.apply(state.diagnostics, diagnostics);
    this.session.connection.sendDiagnostics({ diagnostics: state.diagnostics, uri: textDocument.uri });
  }

  public setAnnotations(fileName: string, annotations: remote.client.IAnnotation[]): void {
    const textDocument = { uri: `file://${fileName}` };
    assert (this.textDocuments.has(textDocument.uri));
    (this.textDocuments.get(textDocument.uri) as TextDocumentState).annotations = annotations;
    this.session.connection.sendNotification(remote.client.highlightAnnotations, { fileName, annotations });
  }
}
