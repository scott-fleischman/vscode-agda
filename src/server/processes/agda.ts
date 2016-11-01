import Session from "../session";
import * as async from "async";
import * as child_process from "child_process";
import * as readline from "readline";

export default class Agda {
  private readonly queue: AsyncPriorityQueue<any>;
  private readline: readline.ReadLine;
  private process: child_process.ChildProcess;
  private readonly session: Session;

  constructor(session: Session) {
    this.session = session;
    this.queue = async.priorityQueue((task, callback) => {
      this.readline.question(JSON.stringify(task), _.flow(JSON.parse, callback));
    }, 1);
    void this.process;
    return this;
  }

  public dispose(): void {
    this.readline.close();
  }

  public initialize(): void {
    return;
  }
}
