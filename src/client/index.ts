import * as command from "./command";
import * as request from "./request";
import * as path from "path";
import * as vscode from "vscode";
import * as client from "vscode-languageclient";

class ClientWindow implements vscode.Disposable {
  public readonly merlin: vscode.StatusBarItem;
  constructor() {
    this.merlin = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
    this.merlin.text = "$(hubot) [loading]";
    this.merlin.show();
    return this;
  }
  public dispose() {
    this.merlin.dispose();
  }
}

class ErrorHandler {
  public closed(): client.CloseAction {
    return client.CloseAction.DoNotRestart;
  }
  public error(): client.ErrorAction {
    return client.ErrorAction.Shutdown;
  }
}

export async function launch(context: vscode.ExtensionContext): Promise<void> {
  const reasonConfig = vscode.workspace.getConfiguration("agda");
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
  const languageClient = new client.LanguageClient("Agda", serverOptions, clientOptions);
  command.registerAll(context, languageClient);
  request.registerAll(context, languageClient);
  const window = new ClientWindow();
  const session = languageClient.start();
  context.subscriptions.push(window);
  context.subscriptions.push(session);
  await languageClient.onReady();
  window.merlin.text = "$(hubot) [agda]";
  window.merlin.tooltip = "agda server online";
}
