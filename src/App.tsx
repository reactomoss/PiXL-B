import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Homepage';
import Play from './components/Play';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="play" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
