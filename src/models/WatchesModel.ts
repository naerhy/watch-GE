import TimeModel from "./TimeModel";
import WatchModel from "./WatchModel";

export default class WatchesModel {
  private watches: WatchModel[];
  private timeModel: TimeModel;
  private nextId: number;

  public constructor() {
    this.watches = [];
    this.timeModel = TimeModel.getInstance();
    this.nextId = 0;
  }

  public getWatches(): WatchModel[] {
    return this.watches;
  }

  public add(): void {
    const watch = new WatchModel(this.nextId, this.timeModel.getTime());
    this.nextId++;
    this.watches.push(watch);
    this.timeModel.attach(watch);
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

  public remove(id: number): void {
    const index = this.watches.findIndex((w) => w.getId() === id);
    if (index !== -1) {
      this.timeModel.detach(this.watches[index]);
      this.watches.splice(index, 1);
    }
  }
}
