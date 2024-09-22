import TimeModel from "../models/TimeModel";
import WatchesModel from "../models/WatchesModel";
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
      (type, utcTimezone) => {
        const newWatch = this.watchesModel.add(utcTimezone);
        this.watchesView.addWatch(type, newWatch);
        this.watchesView.updateTimeTexts(this.watchesModel.getWatches());
      },
      [
        (id) => {
          this.watchesModel.switchMode(id);
          this.watchesView.updateTimeTexts(this.watchesModel.getWatches());
        },
        (id) => {
          this.watchesModel.increaseTime(id);
          this.watchesView.updateTimeTexts(this.watchesModel.getWatches());
        },
        (id) => {
          this.watchesModel.resetTime(id);
          this.watchesView.updateTimeTexts(this.watchesModel.getWatches());
        },
        (id) => {
          this.watchesModel.toggleTimeFormat(id);
          this.watchesView.updateTimeTexts(this.watchesModel.getWatches());
        },
        (id) => {
          this.watchesModel.toggleLight(id);
          this.watchesView.updateLight(id, this.watchesModel.getWatch(id).light);
        },
        (id) => {
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
