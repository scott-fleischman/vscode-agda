import { remote } from "../shared";
import * as lifecycle from "./lifecycle";
import * as request from "./request";
import Session from "./session";

const session = new Session();
session.connection.onExit(lifecycle.exit(session));
session.connection.onInitialize(lifecycle.initialize(session));
session.connection.onShutdown(lifecycle.shutdown(session));
session.connection.onNotification(remote.server.load, request.load(session));
session.listen();
