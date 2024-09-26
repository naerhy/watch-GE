import TimeModel from "../models/TimeModel";
import WatchesCollectionModel from "../models/WatchesCollectionModel";
import WatchesCollectionView from "../views/WatchesCollectionView";

export default class WatchesCollectionController {
  private model: WatchesCollectionModel;
  private view: WatchesCollectionView;
  private timeModel: TimeModel;

  public constructor(model: WatchesCollectionModel, view: WatchesCollectionView) {
    this.model = model;
    this.view = view;
    this.timeModel = TimeModel.getInstance();
  }

  public start(): void {
    this.view.bindAddBtnEvt((type, utcTimezone) => {
      const watch = this.model.add(type, utcTimezone);
      this.view.addWatch(watch);
      this.view.updateWatches(this.model.getWatches());
    });
    this.view.bindRemoveBtnEvt((id) => {
      this.model.remove(id);
      this.view.removeWatch(id);
    });
    this.view.bindSwitchModeBtnEvt((id) => {
      this.model.switchMode(id);
      this.view.updateWatches(this.model.getWatches());
    });
    this.view.bindIncreaseBtnEvt((id) => {
      this.model.increaseTime(id);
      this.view.updateWatches(this.model.getWatches());
    });
    this.view.bindResetBtnEvt((id) => {
      this.model.resetTime(id);
      this.view.updateWatches(this.model.getWatches());
    });
    this.view.bindtoggleTimeFormatBtnEvt((id) => {
      this.model.toggleTimeFormat(id);
      this.view.updateWatches(this.model.getWatches());
    });
    this.view.bindtoggleLightBtnEvt((id) => {
      this.model.toggleLight(id);
      this.view.updateWatches(this.model.getWatches());
    });
    setInterval(() => {
      this.timeModel.updateTime();
      this.view.updateWatches(this.model.getWatches());
    }, 1000);
  }
}
