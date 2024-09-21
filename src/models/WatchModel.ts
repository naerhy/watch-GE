import { Observer, Subject } from "../shared";
import TimeModel from "./TimeModel";

export default class WatchModel implements Observer {
  private id: number;
  private time: number;
  private mode: number;
  private increasedTime: number;

  public constructor(id: number, time: number) {
    this.id = id;
    this.time = time;
    this.mode = 0;
    this.increasedTime = 0;
  }

  public getId(): number {
    return this.id;
  }

  public getTimeText(): string {
    const updatedTime = new Date(this.time + this.increasedTime);
    const digits = [updatedTime.getHours(), updatedTime.getMinutes(), updatedTime.getSeconds()];
    return digits.map((t) => t.toString().padStart(2, "0")).join(":");
  }

  public switchMode(): void {
    this.mode = this.mode === 2 ? 0 : this.mode + 1;
  }

  public increaseTime(): void {
    if (this.mode === 1) {
      this.increasedTime += 3600000;
    } else if (this.mode === 2) {
      this.increasedTime += 60000;
    } else {}
  }

  public update(subject: Subject): void {
    if (subject instanceof TimeModel) {
      this.time = subject.getTime();
    }
  }
}
