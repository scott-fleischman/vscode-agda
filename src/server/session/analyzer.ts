import { types } from "../../shared";
import * as command from "../command";
import Session from "./index";
import * as _ from "lodash";
import * as url from "url";

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
    this.onDidChangeConfiguration();
  }

  public onDidChangeConfiguration(): void {
    this.refreshImmediate = this.refresh;
    this.refreshDebounced = _.debounce(this.refresh, 2000, { trailing: true });
  }

  public async refresh(id: types.TextDocumentIdentifier): Promise<void> {
    const uri = url.parse(id.uri);
    const fileName = uri.path;
    if (fileName) command.load(this.session, { fileName });
  }
}
