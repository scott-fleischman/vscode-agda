import { types } from "../../shared";
import Session from "./index";

export class TextDocumentState {
  public diagnostics: types.Diagnostic[] = [];
}

export default class Synchronizer {
  private session: Session;

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
      this.session.annotator.clear(textDocument);
      this.session.analyzer.clear(textDocument);
    });

    this.session.connection.onDidOpenTextDocument(async ({ textDocument }): Promise<void> => {
      this.session.analyzer.refreshImmediate(textDocument);
    });

    this.session.connection.onDidChangeTextDocument(async ({}): Promise<void> => {
      return;
    });

    this.session.connection.onDidSaveTextDocument(async ({ textDocument }): Promise<void> => {
      this.session.analyzer.refreshImmediate(textDocument);
    });
  }

  public onDidChangeConfiguration(): void {
    return;
  }
}
