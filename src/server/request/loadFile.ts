import * as command from "../command";
import Session from "../session";
import * as server from "vscode-languageserver";

export default function (session: Session): server.NotificationHandler<{ fileName: string }> {
  return async (data) => command.loadFile(session, data);
}
