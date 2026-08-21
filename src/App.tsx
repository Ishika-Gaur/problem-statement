import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Queue from "./pages/Queue";
import Admin from "./pages/Admin";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/queue/*" element={<Queue />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;