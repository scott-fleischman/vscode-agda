import Session from "../session";
import * as load from "./load";

export function registerAll(session: Session): void {
  load.register(session);
}
