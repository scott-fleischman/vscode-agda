import Session from "./index";

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
    this.session.connection.onDidCloseTextDocument((event) => {
      this.session.analyzer.clear(event.textDocument);
    });

    this.session.connection.onDidOpenTextDocument(async (event): Promise<void> => {
      this.session.analyzer.refreshImmediate(event.textDocument);
    });

    this.session.connection.onDidChangeTextDocument(async (event): Promise<void> => {
      for (const change of event.contentChanges) {
        if (change && change.range) {
        };
      }
      this.session.analyzer.refreshDebounced(event.textDocument);
    });

    this.session.connection.onDidSaveTextDocument(async (event): Promise<void> => {
      this.session.analyzer.refreshImmediate(event.textDocument);
    });
  }

  public onDidChangeConfiguration(): void {
    return;
  }
}
