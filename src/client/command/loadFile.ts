import { remote } from "../../shared";
import Session from "../session";
import * as vs from "vscode";

export function register(session: Session): void {
  session.subscriptions.push(vs.commands.registerTextEditorCommand("agda.load", async ({ document }: vs.TextEditor): Promise<void> => {
    if (document.languageId !== "agda") return;
    let ready = true;
    if (document.isDirty) ready = await document.save();
    if (ready) session.languageClient.sendNotification(remote.server.load, { fileName: document.fileName });
  }));
}
