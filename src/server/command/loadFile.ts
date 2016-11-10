import { types } from "../../shared";
import Session from "../session";
import * as url from "url";

export default async function(session: Session, textDocument: types.TextDocumentIdentifier): Promise<void> {
  const { uri } = textDocument;
  const pathName = url.parse(uri).pathname;
  if (pathName == null) return;
  const command = `IOTCM "${pathName}" NonInteractive Direct (Cmd_load "${pathName}" [])`;
  const success = await session.agda.execute(textDocument, command);
  if (success) {
    // FIXME: figure out a cleaner way to clear diagnostics
    session.connection.sendDiagnostics({ diagnostics: [], uri });
    await session.agda.execute(textDocument, command, { highlight: true });
  }
}
