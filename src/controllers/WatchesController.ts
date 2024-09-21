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
    this.watchesView.setAddBtnEvent(() => this.addWatch());
    this.watchesView.setRemoveBtnEvent((id: number) => this.removeWatch(id));
    setInterval(() => {
      this.timeModel.updateTime();
      this.watchesView.render(this.watchesModel.getWatches());
    }, 1000);
  }

  private addWatch(): void {
    this.watchesModel.addWatch();
    this.watchesView.render(this.watchesModel.getWatches());
  }

  private removeWatch(id: number): void {
    this.watchesModel.removeWatch(id);
    this.watchesView.render(this.watchesModel.getWatches());
  }
}
