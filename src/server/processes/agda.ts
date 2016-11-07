import { agda } from "../../shared";
import Session from "../session";
import * as childProcess from "child_process";
import * as events from "events";

class Transducer extends events.EventEmitter {
  private lines: string[];
  private pendingLine: string = "";
  private readonly session: Session;

  constructor(session: Session) {
    super();
    this.session = session;
    return this;
  }

  public feed(data: Buffer | string): void {
    const lines = data.toString().split("\n");
    while (lines.length > 0) {
      this.pendingLine += lines.shift();
      if (lines.length > 0) {
        this.lines.push(this.pendingLine);
        this.pendingLine = "";
      }
    }
    if (this.pendingLine === "Agda2> ") {
      this.pendingLine = "";
      this.emit("agda/lines", this.lines);
      this.lines = [];
    }
  }
}

export default class Agda {
  private readonly transducer: Transducer;
  private process: childProcess.ChildProcess;
  private readonly session: Session;

  constructor(session: Session) {
    this.session = session;
    this.transducer = new Transducer(session);
    return this;
  }

  public dispose(): void {
    this.process.kill("SIGTERM");
  }

  public initialize(): Promise<void> {
    const agdaPath = this.session.settings.agda.path;
    const agdaArgs = ["--interaction", ...this.session.settings.agda.arguments];
    this.process = childProcess.spawn(agdaPath, agdaArgs);
    this.process.stdout.on("data", this.transducer.feed.bind(this.transducer));
    this.process.on("error", (error: Error & { code: string }) => {
      if (error.code === "ENOENT") {
        this.session.connection.window.showWarningMessage(`Cannot find an Agda binary at "${agdaPath}".`);
        this.session.connection.window.showWarningMessage(`Double check your path or try configuring "agda.path" under "User Settings".`);
        this.dispose();
        throw error;
     }
    });
    return new Promise((resolve) => this.transducer.once("agda/lines", resolve));
  }

  public async execute(fileName: string, command: string, options: { highlight: boolean } = { highlight: false }): Promise<void> {
    command += "\n";
    return new Promise<void>((resolve) => {
      this.process.stdin.write(command, () => {
        this.transducer.once("agda/lines", (response: string[]) => {
          for (let line of response) {
            const result = agda.sexp.Lexer.tokenize(line);
            const parser = new agda.sexp.Parser(this.session, fileName, options, result.tokens);
            parser.command();
          }
          resolve();
        });
      });
    });
  }
}
