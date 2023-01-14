//Components
import Table from "../Table";
//Css file
import "./Home.scss";
//Hooks Redux Router
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCoinData, addSpecificCoin } from "../../features/appSlice";
import { useDispatch, useSelector } from "react-redux";
//React Icons
import { FaExchangeAlt, FaWallet, FaSearch } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";

export default function Home() {
  const { coinData } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCoinData("home"));
  }, []);

  return (
    <section className="container">
      <h1>
        Crypto Market
      </h1>
      <nav>
        <Link to="/portofolioPage">
          <FaWallet />
          My portofolio
        </Link>
        <Link to="/">
          <FaExchangeAlt />
          Convert
        </Link>
        <Link to="/search">
          <FaSearch />
          Search
        </Link>
        <Link to="/watchlistPage">
          <AiFillStar />
          Watchlist
        </Link>
      </nav>
      {coinData.length > 0 && (
        <div className="Table">
          <div className="Tbody">
            {coinData.map((coin, index) => {
              return (
                <article
                  key={index}
                  className="Tr"
                  onClick={() => {
                    navigate(`/${coin.name}`);
                    dispatch(addSpecificCoin(coin));
                  }}
                >
                  <Table {...coin} coin={coin} />
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
