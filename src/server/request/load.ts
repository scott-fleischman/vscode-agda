import { agda } from "../../shared";
import Session from "../session";
import * as server from "vscode-languageserver";

export default function (session: Session): server.NotificationHandler<{ fileName: string }> {
  return async ({ fileName }) => {
    const command = `IOTCM "${fileName}" NonInteractive Direct (Cmd_load "${fileName}" [])`;
    const response = await session.agda.request(command);
    for (let line of response) {
      const result = agda.sexp.Lexer.tokenize(line);
      const parser = new agda.sexp.Parser(session, fileName, result.tokens);
      parser.command();
    }
  };
}
