import Session from "../session";
import * as loadFile from "./loadFile";

export function registerAll(session: Session): void {
  loadFile.register(session);
}
