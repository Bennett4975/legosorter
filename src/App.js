import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

import Home from "./pages/Home";
import Guide from "./pages/Guide";
import SearchSet from "./pages/SearchSet";
import SetsByTheme from "./pages/SetsByTheme";
import SingleSet from "./pages/SingleSet";
import SearchPart from "./pages/SearchPart";
import PartsByCategory from "./pages/PartsByCategory";
import PartsByCategory19 from "./pages/PartsByCategory19";
import SinglePart from "./pages/SinglePart";
import SinglePartColor from "./pages/SinglePartColor";
import "./styles/Navbar.css"
import "./index.css"


const PartsByCategoryWrapper = () => {
  const { category } = useParams();
  if (category === "19") {
    return <PartsByCategory19 />;
  }
  return <PartsByCategory />;
};

const App = () => {

  return (
    <Router>
        <nav>
          {/* navbar */}
          <h1 color="white" >Bennett's Lego Builder</h1>
          <h2><Link to="/">Home</Link></h2>
          <h2><Link to="/set/search">Search Set</Link></h2>
          <h2><Link to="/part/search">Search Part</Link></h2>
          <h2><Link to="/help">Help</Link></h2>
        </nav>
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/set/search" element={<SearchSet/>} />
          <Route path="/set/theme/:theme_id" element={<SetsByTheme/>} />
          <Route path="/set/:set_id" element={<SingleSet/>} />
          <Route path="/part/search" element={<SearchPart/>} />
          <Route path="/part/category/:category" element={<PartsByCategoryWrapper/>} />
          <Route path="/part/:part_num" element={<SinglePart/>} />
          <Route path="/part/:part_num/:color" element={<SinglePartColor/>} />
          <Route path="/help" element={<Guide/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;