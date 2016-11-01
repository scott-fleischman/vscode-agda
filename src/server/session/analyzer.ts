import { types } from "../../shared";
import Session from "./index";
import * as _ from "lodash";
import * as server from "vscode-languageserver";

export default class Analyzer {
  public refreshImmediate: ((event: types.TextDocumentIdentifier) => Promise<void>);
  public refreshDebounced: ((event: types.TextDocumentIdentifier) => Promise<void>) & _.Cancelable;
  private session: Session;

  constructor(session: Session) {
    this.session = session;
    return this;
  }

  public clear(event: types.TextDocumentIdentifier): void {
    this.session.connection.sendDiagnostics({
      diagnostics: [],
      uri: event.uri,
    });
  }

  public dispose(): void {
    return;
  }

  public async initialize(): Promise<void> {
    return;
  }

  public onDidChangeConfiguration(): void {
    return;
  }

  public refreshWithKind(syncKind: server.TextDocumentSyncKind): (id: types.TextDocumentIdentifier) => Promise<void> {
    return async (id) => {
      void syncKind;
      void id;
    };
  }
}
