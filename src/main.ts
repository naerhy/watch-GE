import "./style.css";
import WatchesCollectionModel from "./models/WatchesCollectionModel";
import WatchesCollectionView from "./views/WatchesCollectionView";
import WatchesCollectionController from "./controllers/WatchesCollectionController";

new WatchesCollectionController(new WatchesCollectionModel(), new WatchesCollectionView()).start();
