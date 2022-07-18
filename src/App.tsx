import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { PlasmicRootProvider, PlasmicCanvasHost } from "@plasmicapp/loader-react";
import { PLASMIC } from './plasmic-init';
import Home from "./components/Homepage";
// import About from "./components/About";
// import DayPass from "./components/DayPass";
// import Items from "./components/Items";
// import Missions from "./components/Missions";
import Play from "./components/Play";

function App() {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <BrowserRouter>
        <Switch>
          {/* <Route path="/about">
            <About />
          </Route>
          <Route path="/day-pass">
            <DayPass />
          </Route>
          <Route path="/items">
            <Items />
          </Route>
          <Route path="/missions">
            <Missions />
          </Route> */}
          <Route path="/play">
            <Play />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </PlasmicRootProvider>
  );
}

export default App;
