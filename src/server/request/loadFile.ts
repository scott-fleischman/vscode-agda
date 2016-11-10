import { types } from "../../shared";
import * as command from "../command";
import Session from "../session";
import * as server from "vscode-languageserver";

export default function (session: Session): server.NotificationHandler<types.TextDocumentIdentifier> {
  return async (data) => command.loadFile(session, data);
}
