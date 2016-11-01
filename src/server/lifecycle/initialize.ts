import capabilities from "../capabilities";
import Session from "../session";
import * as server from "vscode-languageserver";

export default function(session: Session): server.RequestHandler<server.InitializeParams, server.InitializeResult, server.InitializeError> {
  return async (event) => {
    session.initConf = event;
    session.settings.agda = event.initializationOptions;
    await session.initialize();
    // check for response
    return { capabilities };
  };
}
