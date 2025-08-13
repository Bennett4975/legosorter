import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import SearchSet from "./pages/SearchSet";
import SetsByTheme from "./pages/SetsByTheme";
import SingleSet from "./pages/SingleSet";
import SearchPart from "./pages/SearchPart";
import PartsByCategory from "./pages/PartsByCategory";
import SinglePart from "./pages/SinglePart";
import SinglePartColor from "./pages/SinglePartColor";

function App() {
  return (
    <Router>
        <nav>
          {/* navbar */}
          <h3><Link to="/">Home</Link></h3>
          <h3><Link to="/set/search">Search Set</Link></h3>
          <h3><Link to="/part/search">Search Part</Link></h3>
        </nav>
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/set/search" element={<SearchSet/>} />
          <Route path="/set/theme/:theme_id" element={<SetsByTheme/>} />
          <Route path="/set/:set_id" element={<SingleSet/>} />
          <Route path="/part/search" element={<SearchPart/>} />
          <Route path="/part/category/:category" element={<PartsByCategory/>} />
          <Route path="/part/:part_num" element={<SinglePart/>} />
          <Route path="/part/:part_num/:color" element={<SinglePartColor/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;