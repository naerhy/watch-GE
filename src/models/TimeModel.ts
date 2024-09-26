import type { Observer, Subject } from "../shared";

export default class TimeModel implements Subject {
  private time: number;
  private observers: Observer[];
  private static instance: TimeModel;

  private constructor() {
    this.time = this.getCurrentTime();
    this.observers = [];
  }

  public attach(observer: Observer): void {
    if (this.observers.indexOf(observer) === -1) {
      this.observers.push(observer);
    }
  }

  public detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  public notify(): void {
    for (const o of this.observers) {
      o.update(this);
    }
  }

  private getCurrentTime(): number {
    return new Date().getTime();
  }

  public getTime(): number {
    return this.time;
  }

  public updateTime(): void {
    this.time = this.getCurrentTime();
    this.notify();
  }

  public static getInstance(): TimeModel {
    if (!TimeModel.instance) {
      TimeModel.instance = new TimeModel();
    }
    return TimeModel.instance;
  }
}
