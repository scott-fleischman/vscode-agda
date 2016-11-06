import { remote } from "../../shared";
import Session from "../session";
import Window from "../window";
import * as vscode from "vscode";

function handler(window: Window): (data: remote.client.IFileAnnotations) => Promise<void> {
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
      for (const face of Object.keys(window.decorationTypes) as remote.client.HighlightFace[]) {
        // NOTE: use [] if lookup fails since we need to clear stale (i.e., no longer used) faces too
        editor.setDecorations(window.decorationTypes[face], collatedHighlights.get(face) || []);
      }
    }
  };
}

export function register(session: Session): void {
  session.languageClient.onNotification(remote.client.highlightAnnotations, handler(session.window));
}
