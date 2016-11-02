import * as load from "./load";
import * as vscode from "vscode";
import * as client from "vscode-languageclient";

export function registerAll(context: vscode.ExtensionContext, languageClient: client.LanguageClient): void {
  load.register(context, languageClient);
}
