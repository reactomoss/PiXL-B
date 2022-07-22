import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { PlasmicRootProvider } from "@plasmicapp/loader-react";
import { PLASMIC } from './plasmic-init';
import Home from "./components/Homepage";
import Play from "./components/Play";

function App() {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="play" element={<Play />} />
        </Routes>
      </BrowserRouter>
    </PlasmicRootProvider>
  );
}

export default App;
