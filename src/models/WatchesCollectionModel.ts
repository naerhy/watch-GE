import { SerializedWatch, type UtcTimezone, Watch, type WatchType } from "../shared";
import AnalogWatchModel from "./AnalogWatchModel";
import DigitalWatchModel from "./DigitalWatchModel";
import TimeModel from "./TimeModel";

export default class WatchesCollectionModel {
  private watches: Map<number, Watch>;
  private nextId: number;
  private timeModel: TimeModel;

  public constructor() {
    this.watches = new Map();
    this.nextId = 0;
    this.timeModel = TimeModel.getInstance();
  }

  private getWatch(id: number): Watch {
    const w = this.watches.get(id);
    if (!w) {
      throw new Error(`Watch with ID ${id} does not exist`);
    }
    return w;
  }

  public getWatches(): SerializedWatch[] {
    const watches: SerializedWatch[] = [];
    this.watches.forEach((w) => watches.push(w.serialize()));
    return watches;
  }

  public add(type: WatchType, utcTimezone: UtcTimezone): SerializedWatch {
    const watch = type === "analog"
      ? new AnalogWatchModel(this.nextId, this.timeModel.getTime(), utcTimezone)
      : new DigitalWatchModel(this.nextId, this.timeModel.getTime(), utcTimezone)
    ;
    this.watches.set(this.nextId, watch);
    this.nextId++;
    this.timeModel.attach(watch);
    return watch.serialize();
  }

  public remove(id: number): void {
    const watch = this.getWatch(id);
    this.timeModel.detach(watch);
    this.watches.delete(id);
  }

  public switchMode(id: number): void {
    const watch = this.getWatch(id) as DigitalWatchModel;
    watch.switchMode();
  }

  public increaseTime(id: number): void {
    const watch = this.getWatch(id) as DigitalWatchModel;
    watch.increaseTime();
  }

  public resetTime(id: number): void {
    const watch = this.getWatch(id) as DigitalWatchModel;
    watch.resetTime();
  }

  public toggleTimeFormat(id: number): void {
    const watch = this.getWatch(id) as DigitalWatchModel;
    watch.toggleTimeFormat();
  }

  public toggleLight(id: number): void {
    const watch = this.getWatch(id) as DigitalWatchModel;
    watch.toggleLight();
  }
}
