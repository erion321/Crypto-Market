import "./Watchlist.scss";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCoinData, removeFromWatchlist } from "../../features/appSlice";
import { useDispatch, useSelector } from "react-redux";
//React Icons
import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";
import { FaAngleDoubleLeft } from "react-icons/fa";

export default function Watchlist() {
  const { watchlist } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function nFormatter(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "Bn";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  useEffect(() => {
    dispatch(getCoinData({}));
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  if (watchlist.length < 1) {
    return (
      <div className="add-item">
        <Link to="/" className="home-link">
          <FaAngleDoubleLeft />
        </Link>
        <button onClick={() => navigate("/")}>Add item to watchlist</button>
      </div>
    );
  }

  return (
    <div className="watchlist">
      <Link to="/" className="home-link">
        <FaAngleDoubleLeft />
      </Link>
      <h2>My Watchlist</h2>
      <article>
        {watchlist.map((coin, index) => {
          return (
            <div key={index} className="coin">
              <div className="split-coin">
                <span className="coin-rank">{coin.rank}</span>
                <div className="coin-main">
                  <img src={coin.iconUrl} alt={coin.name} />
                  <div>
                    <p className="coin-symbol">{coin.symbol}</p>
                    <span className="coin-mCap">
                      {" "}
                      {nFormatter(coin.marketCap)}{" "}
                    </span>
                  </div>
                </div>
              </div>
              <div className="split-coin">
                <p style={{ fontWeight: "bold" }}>
                  US${numberWithCommas(parseFloat(coin.price).toFixed(3))}
                </p>

                <span
                  className={`
                  ${coin.change > 0 ? "positive" : "negative"}
                `}
                >
                  {coin.change > 0 ? <BiCaretUp /> : <BiCaretDown />}
                  {coin.change}%
                </span>
                <button
                  onClick={() => dispatch(removeFromWatchlist(coin))}
                  className="delete-btn"
                >
                  <BsFillTrashFill />
                </button>
              </div>
            </div>
          );
        })}
      </article>
    </div>
  );
}
