import { Observer, Subject, Time } from "../shared";
import TimeModel from "./TimeModel";

export default class WatchModel implements Observer {
  private id: number;
  private time: Time;

  public constructor(id: number, time: Time) {
    this.id = id;
    this.time = time;
  }

  public getId(): number {
    return this.id;
  }

  public getStrTime(): string {
    const numsStr: string[] = [];
    for (const k in this.time) {
      numsStr.push(this.time[k as keyof Time].toString().padStart(2, "0"));
    }
    return numsStr.join(":");
  }

  public update(subject: Subject) {
    if (subject instanceof TimeModel) {
      this.time = subject.getTime();
    }
  }
}
