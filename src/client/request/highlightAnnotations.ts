import { remote } from "../../shared";
import ClientWindow from "../ClientWindow";
import * as vscode from "vscode";
import * as client from "vscode-languageclient";

function handler(window: ClientWindow): (data: remote.client.IFileAnnotations) => Promise<void> {
  return async ({ fileName, annotations }) => {
    const uri = vscode.Uri.parse(`file://${fileName}`);
    const document = await vscode.workspace.openTextDocument(uri);
    const collatedHighlights: Map<remote.client.HighlightFace, vscode.Range[]> = new Map();
    for (const { startOff, endOff, face } of annotations) {
      const start = document.positionAt(startOff);
      const end = document.positionAt(endOff);
      if (!collatedHighlights.has(face)) collatedHighlights.set(face, []);
      const ranges = collatedHighlights.get(face) as vscode.Range[];
      ranges.push(new vscode.Range(start, end));
    }
    for (const editor of vscode.window.visibleTextEditors) {
      if (editor.document.fileName !== fileName) continue;
      for (const [face, ranges] of Array.from(collatedHighlights.entries())) {
        editor.setDecorations((window as any).decorationTypes[face], ranges);
      }
    }
  };
}

export function register(window: ClientWindow, languageClient: client.LanguageClient): void {
  languageClient.onNotification(remote.client.highlightAnnotations, handler(window));
}
