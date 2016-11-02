import ClientWindow from "../ClientWindow";
import * as highlightAnnotations from "./highlightAnnotations";
import * as client from "vscode-languageclient";

export function registerAll(window: ClientWindow, languageClient: client.LanguageClient): void {
  highlightAnnotations.register(window, languageClient);
}
