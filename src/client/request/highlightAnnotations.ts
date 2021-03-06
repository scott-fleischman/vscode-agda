import { remote } from "../../shared";
import Session from "../session";
import * as vs from "vscode";
import * as client from "vscode-languageclient";

function handler(session: Session): (data: remote.client.IFileAnnotations) => Promise<void> {
  return async ({ annotations, textDocument }) => {
    // session.languageClient.outputChannel.appendLine(`highlightAnnotations: ${annotations.length}`);
    const window = session.window;
    const uri = client.Protocol2Code.createConverter().asUri(textDocument.uri);
    const document = await vs.workspace.openTextDocument(uri);
    const collatedHighlights: Map<remote.client.HighlightFace, vs.Range[]> = new Map();
    for (const { startOff, endOff, face } of annotations) {
      const start = document.positionAt(startOff);
      const end = document.positionAt(endOff);
      if (!collatedHighlights.has(face)) collatedHighlights.set(face, []);
      const ranges = collatedHighlights.get(face) as vs.Range[];
      ranges.push(new vs.Range(start, end));
    }
    for (const editor of vs.window.visibleTextEditors) {
      if (editor.document.uri.fsPath !== uri.fsPath) continue;
      for (const face of Object.keys(window.decorationTypes) as remote.client.HighlightFace[]) {
        // NOTE: use [] if lookup fails since we need to clear stale (i.e., no longer used) faces too
        editor.setDecorations(window.decorationTypes[face], collatedHighlights.get(face) || []);
      }
    }
  };
}

export function register(session: Session): void {
  session.languageClient.onNotification(remote.client.highlightAnnotations, handler(session));
}
