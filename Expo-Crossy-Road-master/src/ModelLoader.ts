import Boulder from "./Node/Boulder";
import Car from "./Node/Car";
import Grass from "./Node/Grass";
import Hero from "./Node/Hero";
import LilyPad from "./Node/LilyPad";
import Log from "./Node/Log";
import RailRoad from "./Node/RailRoad";
import River from "./Node/River";
import Road from "./Node/Road";
import Train from "./Node/Train";
import TrainLight from "./Node/TrainLight";
import Tree from "./Node/Tree";

class ModelLoader {
  [x: string]: any;
  loadModels = async () => {
    this._lilyPad = new LilyPad();
    this._grass = new Grass();
    this._road = new Road();
    this._river = new River();
    this._boulder = new Boulder();
    this._tree = new Tree();
    this._car = new Car();
    this._railroad = new RailRoad();
    this._train = new Train();
    this._trainLight = new TrainLight();
    this._log = new Log();
    this._hero = new Hero();

    // try {
    await Promise.all([
      this._lilyPad.setup(),
      this._road.setup(),
      this._grass.setup(),
      this._river.setup(),
      this._log.setup(),
      this._boulder.setup(),
      this._tree.setup(),
      this._car.setup(),
      this._railroad.setup(),
      this._train.setup(),
      this._hero.setup(),
      this._trainLight.setup(),
    ]);
    console.log("Done Loading 3D Models!");
    // } catch (error) {
    //   console.warn(`:( We had a problem loading the 3D Models: ${error}`);
    // }
    return true;
  };
}

export default new ModelLoader();
