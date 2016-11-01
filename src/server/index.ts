import * as lifecycle from "./lifecycle";
import Session from "./session";

const session = new Session();

session.connection.onExit(lifecycle.exit(session));
session.connection.onInitialize(lifecycle.initialize(session));
session.connection.onShutdown(lifecycle.shutdown(session));

session.listen();
