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
    this.watchesView.setAddBtnEvent(() => {
      this.watchesModel.add();
      this.watchesView.render(this.watchesModel.getWatches());
    });
    this.watchesView.setModeBtnEvent((id: number) => {
      this.watchesModel.switchMode(id);
      this.watchesView.render(this.watchesModel.getWatches());
    });
    this.watchesView.setIncreaseBtnEvent((id: number) => {
      this.watchesModel.increaseTime(id);
      this.watchesView.render(this.watchesModel.getWatches());
    });
    this.watchesView.setToggleLightBtnEvent((id: number) => {
      this.watchesModel.toggleLight(id);
      this.watchesView.render(this.watchesModel.getWatches());
    });
    this.watchesView.setRemoveBtnEvent((id: number) => {
      this.watchesModel.remove(id);
      this.watchesView.render(this.watchesModel.getWatches());
    });
    setInterval(() => {
      this.timeModel.updateTime();
      this.watchesView.render(this.watchesModel.getWatches());
    }, 1000);
  }
}
