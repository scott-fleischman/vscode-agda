import { remote } from "../../shared";
import * as vscode from "vscode";
import * as client from "vscode-languageclient";

export function register(context: vscode.ExtensionContext, languageClient: client.LanguageClient): void {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("agda.load", async (editor: vscode.TextEditor): Promise<void> => {
      if (editor.document.languageId !== "agda") return;
      languageClient.sendNotification(remote.server.load, { fileName: editor.document.fileName });
    }));
}
