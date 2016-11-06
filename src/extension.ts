// tslint:disable object-literal-sort-keys

import * as client from "./client";
import * as vscode from "vscode";

const agdaConfiguration = {
  wordPattern: /\\[^\s]+|[^\\\s\d(){}#][^\s(){}]*/,
};

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.languages.setLanguageConfiguration("agda", agdaConfiguration));
  const session = new client.Session(context);
  await session.onReady();
  // context.subscriptions.push(session);
}

export function deactivate() {
  return;
}
