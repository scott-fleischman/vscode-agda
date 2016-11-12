import { types } from "../../shared";
import * as command from "../command";
import Session from "./index";
import * as _ from "lodash";

export default class Analyzer {
  public refreshImmediate: ((event: types.TextDocumentIdentifier) => Promise<void>);
  public refreshDebounced: ((event: types.TextDocumentIdentifier) => Promise<void>) & _.Cancelable;
  private diagnostics: Map<string, types.Diagnostic[]> = new Map();
  private session: Session;

  constructor(session: Session) {
    this.session = session;
    return this;
  }

  public clear(textDocument: types.TextDocumentIdentifier): boolean {
    const status = this.diagnostics.delete(textDocument.uri);
    this.setDiagnostics(textDocument, []);
    return status;
  }

  public dispose(): void {
    return;
  }

  public getDiagnostics(id: types.TextDocumentIdentifier): types.Diagnostic[] {
    return this.diagnostics.get(id.uri) || [];
  }

  public async initialize(): Promise<void> {
    this.onDidChangeConfiguration();
  }

  public onDidChangeConfiguration(): void {
    this.refreshImmediate = this.refresh;
    this.refreshDebounced = _.debounce(this.refresh, 2000, { trailing: true });
  }

  public async refresh(textDocument: types.TextDocumentIdentifier): Promise<void> {
    this.setDiagnostics(textDocument, []);
    await command.loadFile(this.session, textDocument);
  }

  public pushDiagnostics({ uri }: types.TextDocumentIdentifier, rest: types.Diagnostic[]): void {
    if (!this.diagnostics.has(uri)) this.diagnostics.set(uri, []);
    const diagnostics = this.diagnostics.get(uri) as types.Diagnostic[];
    Array.prototype.push.apply(diagnostics, rest);
    this.session.connection.sendDiagnostics({ uri, diagnostics });
  }

  public setDiagnostics({ uri }: types.TextDocumentIdentifier, diagnostics: types.Diagnostic[]): void {
    this.diagnostics.set(uri, diagnostics);
    this.session.connection.sendDiagnostics({ uri, diagnostics });
  }
}
