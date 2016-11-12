import { types } from "../../shared";
import Session from "../session";
import * as url from "url";

export default async function(session: Session, textDocument: types.TextDocumentIdentifier): Promise<void> {
  const { uri } = textDocument;
  const pathName = url.parse(uri).pathname;
  if (pathName == null) return;
  const command = `IOTCM "${pathName}" NonInteractive Direct (Cmd_load "${pathName}" [])`;
  session.analyzer.clear(textDocument);
  session.annotator.clear(textDocument);
  await session.agda.execute(textDocument, command);
}
