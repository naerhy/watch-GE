import TimeModel from "./TimeModel";
import { Observer, Subject, Watch } from "../shared";

class WatchModel implements Observer {
  private id: number;
  private time: number;
  private mode: number;
  private increasedTime: number;
  private light: boolean;

  public constructor(id: number, time: number) {
    this.id = id;
    this.time = time;
    this.mode = 0;
    this.increasedTime = 0;
    this.light = false;
  }

  public getId(): number {
    return this.id;
  }

  public getTimeText(): string {
    const updatedTime = new Date(this.time + this.increasedTime);
    const digits = [updatedTime.getHours(), updatedTime.getMinutes(), updatedTime.getSeconds()];
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
      this.increasedTime += 3600000;
    } else if (this.mode === 2) {
      this.increasedTime += 60000;
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

  public getWatches(): Watch[] {
    return this.watches.map((w) => this.transformModelToObject(w));
  }

  public getWatch(id: number): Watch {
    const watch = this.watches[id];
    return this.transformModelToObject(watch);
  }

  public add(): Watch {
    const watch = new WatchModel(this.nextId, this.timeModel.getTime());
    this.nextId++;
    this.watches.push(watch);
    this.timeModel.attach(watch);
    return this.transformModelToObject(watch);
  }

  public remove(id: number): void {
    const index = this.watches.findIndex((w) => w.getId() === id);
    if (index !== -1) {
      this.timeModel.detach(this.watches[index]);
      this.watches.splice(index, 1);
    }
  }

  public switchMode(id: number): void {
    const index = this.watches.findIndex((w) => w.getId() === id);
    if (index !== -1) {
      this.watches[index].switchMode();
    }
  }

  public increaseTime(id: number): void {
    const index = this.watches.findIndex((w) => w.getId() === id);
    if (index !== -1) {
      this.watches[index].increaseTime();
    }
  }

  public toggleLight(id: number): void {
    const index = this.watches.findIndex((w) => w.getId() === id);
    if (index !== -1) {
      this.watches[index].toggleLight();
    }
  }
}
