import TimeModel from "./TimeModel";
import { Observer, Subject, utcOffsets, UtcTimeZone, Watch } from "../shared";

class WatchModel implements Observer {
  private id: number;
  private time: number;
  private utcTimezone: UtcTimeZone;
  private mode: number;
  private increasedTime: number;
  private light: boolean;

  private readonly MS_MIN = 60000;
  private readonly MS_HOUR = 3600000;

  public constructor(id: number, time: number, utcTimezone: UtcTimeZone) {
    this.id = id;
    this.time = time;
    this.utcTimezone = utcTimezone;
    this.mode = 0;
    this.increasedTime = 0;
    this.light = false;
  }

  public getId(): number {
    return this.id;
  }

  public getTimeText(): string {
    const updatedTime = new Date(
      this.time + (utcOffsets[this.utcTimezone] * this.MS_MIN) + this.increasedTime
    );
    const digits = [
      updatedTime.getUTCHours(),
      updatedTime.getUTCMinutes(),
      updatedTime.getUTCSeconds()
    ];
    return digits.map((t) => t.toString().padStart(2, "0")).join(":");
  }

  public getLight(): boolean {
    return this.light;
  }

  public switchMode(): void {
    this.mode = this.mode === 2 ? 0 : this.mode + 1;
  }

  public increaseTime(): void {
    if (this.mode === 1) {
      this.increasedTime += this.MS_HOUR;
    } else if (this.mode === 2) {
      this.increasedTime += this.MS_MIN;
    } else {}
  }

  public toggleLight(): void {
    this.light = !this.light;
  }

  public update(subject: Subject): void {
    if (subject instanceof TimeModel) {
      this.time = subject.getTime();
    }
  }
}

export default class WatchesModel {
  private timeModel: TimeModel;
  private watches: WatchModel[];
  private nextId: number;

  public constructor() {
    this.timeModel = TimeModel.getInstance();
    this.watches = [];
    this.nextId = 0;
  }

  private transformModelToObject(watch: WatchModel): Watch {
    return {
      id: watch.getId(),
      time: watch.getTimeText(),
      light: watch.getLight()
    };
  }

  private getWatchIndex(id: number): number {
    const index = this.watches.findIndex((w) => w.getId() === id);
    if (index === -1) {
      throw new Error(`Cannot find index for watch with id ${id}`);
    }
    return index;
  }

  public getWatches(): Watch[] {
    return this.watches.map((w) => this.transformModelToObject(w));
  }

  public getWatch(id: number): Watch {
    const watch = this.watches.find((w) => w.getId() === id);
    if (!watch) {
      throw new Error(`Cannot find watch with id ${id}`);
    }
    return this.transformModelToObject(watch);
  }

  public add(utcTimezone: UtcTimeZone): Watch {
    const watch = new WatchModel(this.nextId, this.timeModel.getTime(), utcTimezone);
    this.nextId++;
    this.watches.push(watch);
    this.timeModel.attach(watch);
    return this.transformModelToObject(watch);
  }

  public remove(id: number): void {
    const index = this.getWatchIndex(id);
    this.timeModel.detach(this.watches[index]);
    this.watches.splice(index, 1);
  }

  public switchMode(id: number): void {
    const index = this.getWatchIndex(id);
    this.watches[index].switchMode();
  }

  public increaseTime(id: number): void {
    const index = this.getWatchIndex(id);
    this.watches[index].increaseTime();
  }

  public toggleLight(id: number): void {
    const index = this.getWatchIndex(id);
    this.watches[index].toggleLight();
  }
}
