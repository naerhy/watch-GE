import TimeModel from "../models/TimeModel";
import WatchesModel from "../models/WatchesModel";
import { UtcTimeZone } from "../shared";
import WatchesView from "../views/WatchesView";

export default class WatchesController {
  private timeModel: TimeModel;
  private watchesModel: WatchesModel;
  private watchesView: WatchesView;

  public constructor(watchesModel: WatchesModel, watchesView: WatchesView) {
    this.timeModel = TimeModel.getInstance();
    this.watchesModel = watchesModel;
    this.watchesView = watchesView;
  }

  public start(): void {
    this.watchesView.setEvents(
      (utcTimezone: UtcTimeZone) => {
        const newWatch = this.watchesModel.add(utcTimezone);
        this.watchesView.addItem(newWatch);
      },
      [
        (id: number) => {
          this.watchesModel.switchMode(id);
          this.watchesView.updateTimeTexts(this.watchesModel.getWatches());
        },
        (id: number) => {
          this.watchesModel.increaseTime(id);
          this.watchesView.updateTimeTexts(this.watchesModel.getWatches());
        },
        (id: number) => {
          this.watchesModel.resetTime(id);
          this.watchesView.updateTimeTexts(this.watchesModel.getWatches());
        },
        (id: number) => {
          this.watchesModel.toggleLight(id);
          this.watchesView.updateLight(id, this.watchesModel.getWatch(id).light);
        },
        (id: number) => {
          this.watchesModel.remove(id);
          this.watchesView.removeItem(id);
        }
      ]
    );
    setInterval(() => {
      this.timeModel.updateTime();
      this.watchesView.updateTimeTexts(this.watchesModel.getWatches());
    }, 1000);
  }
}
