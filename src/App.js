import { Route, Routes } from "react-router-dom";
//Components
import Home from "./components/home/Home";
import Search from "./components/search/Search";
import Overview from "./components/overview/Overview";
import Portofolio from "./components/portofolio/Portofolio";
import Watchlist from "./components/watchlist/Watchlist";

export default function App() {
  return (
    <div className="app">
      {/*  Page routes */}
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/portofolioPage" element={<Portofolio />} />
        <Route path="/watchlistPage" element={<Watchlist />} />
        <Route path="/:id" element={<Overview />} />
      </Routes>
    </div>
  );
}
