import ClientWindow from "./ClientWindow";
import ErrorHandler from "./ErrorHandler";
import * as command from "./command";
import * as request from "./request";
import * as path from "path";
import * as vscode from "vscode";
import * as client from "vscode-languageclient";

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
  const window = new ClientWindow();
  command.registerAll(context, languageClient);
  request.registerAll(window, languageClient);
  const session = languageClient.start();
  context.subscriptions.push(window);
  context.subscriptions.push(session);
  await languageClient.onReady();
  window.statusBarItem.text = "$(server) [agda]";
  window.statusBarItem.tooltip = "agda server online";
}
