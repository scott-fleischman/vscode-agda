import * as command from "./command";
import ErrorHandler from "./errorHandler";
import * as request from "./request";
import Window from "./window";
import * as path from "path";
import * as vs from "vscode";
import * as client from "vscode-languageclient";

export default class Session implements vs.Disposable {
  public readonly context: vs.ExtensionContext;
  public readonly languageClient: client.LanguageClient;
  public readonly subscriptions: vs.Disposable[] = [];
  public readonly window: Window;

  constructor(context: vs.ExtensionContext) {
    const reasonConfig = vs.workspace.getConfiguration("agda");
    const module = context.asAbsolutePath(path.join("out", "src", "server", "index.js"));
    const transport = client.TransportKind.ipc;
    const run = { module, transport, options: {} };
    const debug = { module, transport, options: { execArgv: [ "--nolazy", "--debug=6004" ] } };
    const serverOptions = { run, debug };
    const clientOptions: client.LanguageClientOptions = {
      diagnosticCollectionName: "Agda",
      documentSelector: [ "agda" ],
      errorHandler: new ErrorHandler(),
      initializationOptions: reasonConfig,
      outputChannelName: "Agda",
      stdioEncoding: "utf8",
      synchronize: {
        configurationSection: "agda",
        fileEvents: [
        ],
      },
    };
    this.context = context;
    this.languageClient = new client.LanguageClient("Agda", serverOptions, clientOptions);
    command.registerAll(this);
    request.registerAll(this);
    this.window = new Window(this);
    this.subscriptions.push((vs.window as any).onDidChangeVisibleTextEditors(this.window.onDidChangeVisibleTextEditors.bind(this.window)));
    this.subscriptions.push(this.window);
    this.subscriptions.push(this.languageClient.start());
  }

  public dispose() {
    for (const item of this.subscriptions) item.dispose();
  }

  public async onReady(): Promise<void> {
    await this.languageClient.onReady();
    this.window.updateStatusBarItem({ text: "agda", tooltip: "agda server online" });
  }
}
