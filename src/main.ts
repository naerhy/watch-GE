import "./style.css";
import WatchesModel from "./models/WatchesModel";
import WatchesView from "./views/WatchesView";
import WatchesController from "./controllers/WatchesController";

const watchesModel = new WatchesModel();
const watchesView = new WatchesView();
new WatchesController(watchesModel, watchesView).start();
