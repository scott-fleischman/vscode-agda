import { ISettings } from "../../shared";
import { Agda } from "../processes";
import * as server from "vscode-languageserver";

import Analyzer from "./analyzer";
import Annotator from "./annotator";
import Synchronizer from "./synchronizer";

export default class Session {
  public readonly agda: Agda;
  public readonly analyzer: Analyzer;
  public readonly annotator: Annotator;
  public readonly connection: server.IConnection = server.createConnection(
    new server.IPCMessageReader(process),
    new server.IPCMessageWriter(process),
  );
  public initConf: server.InitializeParams;
  public settings: ISettings = ({} as any);
  public readonly synchronizer: Synchronizer;

  constructor() {
    this.agda = new Agda(this);
    this.analyzer = new Analyzer(this);
    this.annotator = new Annotator(this);
    this.synchronizer = new Synchronizer(this);
    return this;
  }

  public dispose(): void {
    this.agda.dispose();
    this.synchronizer.dispose();
  }

  public async initialize(): Promise<void> {
    await this.agda.initialize();
    await this.synchronizer.initialize();
    await this.analyzer.initialize();
  }

  public listen(): void {
    this.synchronizer.listen();
    this.connection.listen();
  }

  public log(data: any): void {
    this.connection.console.log(JSON.stringify(data, null as any, 2)); // tslint:disable-line
  }

  public onDidChangeConfiguration({ settings }: server.DidChangeConfigurationParams): void {
    this.settings = settings;
    this.analyzer.onDidChangeConfiguration();
    this.synchronizer.onDidChangeConfiguration();
  }
}
