// tslint:disable object-literal-sort-keys

import * as client from "./client";
import * as vs from "vscode";

const agdaConfiguration = {
  wordPattern: /\\[^\s]+|[^\\\s\d(){}#][^\\\s(){}]*/,
};

export async function activate(context: vs.ExtensionContext) {
  context.subscriptions.push(vs.languages.setLanguageConfiguration("agda", agdaConfiguration));
  const session = new client.Session(context);
  await session.onReady();
  context.subscriptions.push(session);
}

export function deactivate() {
  return;
}
