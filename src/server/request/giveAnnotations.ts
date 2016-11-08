import { remote, types } from "../../shared";
import * as command from "../command";
import Session from "../session";
import * as server from "vscode-languageserver";

export default function (session: Session): server.RequestHandler<types.TextDocumentIdentifier, remote.client.IAnnotation[], void> {
  return async (data) => command.giveAnnotations(session, data);
}
