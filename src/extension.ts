// tslint:disable object-literal-sort-keys

import * as client from "./client";
import * as vscode from "vscode";

const agdaConfiguration = {
  wordPattern: /[^\\\s\d(){}#][^\s(){}]*/,
};

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.languages.setLanguageConfiguration("agda", agdaConfiguration));
  await client.launch(context);
}

export function deactivate() {
  return;
}
