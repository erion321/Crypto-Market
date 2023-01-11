import "./Overview.scss";
import { useDispatch, useSelector } from "react-redux";
import { addNewTransaction, addQuantity } from "../../features/appSlice";
import { useNavigate } from "react-router-dom";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { BiCaretDown, BiCaretUp } from "react-icons/bi";

export default function Overview() {
  const { quantity } = useSelector((store) => store.app);
  console.log(quantity);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let specificCoin = localStorage.getItem("myCoin");
  specificCoin = JSON.parse(specificCoin);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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

  return (
    <section className="overview">
      <header>
        <button onClick={() => navigate("/")}>
          <FaAngleDoubleLeft />
        </button>
        <div>
          <img src={specificCoin.iconUrl} alt="" />
          <h3>{specificCoin.symbol}</h3>
          <span>#{specificCoin.rank}</span>
        </div>
      </header>
      <main className="overview-main">
        <div className="overview-coin">
          <div>
            <h4>{specificCoin.name}</h4>
            <h1>
              US$
              {numberWithCommas(parseFloat(specificCoin.price).toFixed(3))}
            </h1>
            <span style={{ display: "flex", alignItems: "center" }}>
              {specificCoin.btcPrice == 1
                ? parseFloat(specificCoin.btcPrice).toFixed(0)
                : parseFloat(specificCoin.btcPrice).toFixed(6)}
              <BsCurrencyBitcoin />
            </span>
          </div>
          <h3 className={specificCoin.change > 0 ? "green" : "red"}>
            {specificCoin.change > 0 ? <BiCaretUp /> : <BiCaretDown />}
            {specificCoin.change}%
          </h3>
        </div>
        <form className="overview-form">
          <input
            onChange={(e) => dispatch(addQuantity(e.target.value))}
            type="number"
            step=".01"
            placeholder="0"
          />
          {quantity <= 0 ? (
            <button className="button-disabled" type="disabled">
              Add Transaction
            </button>
          ) : (
            <button
              className="button-enabled"
              type="submit"
              onClick={() => {
                dispatch(addNewTransaction());
                navigate("/portofolioPage");
              }}
            >
              Add Transaction
            </button>
          )}
        </form>
      </main>

      <article className="statistics">
        <h2>Statistics</h2>
        <div>
          <ul className="coin-statistic">
            <li>
              <p>BTC Price</p>
              <span>US${parseFloat(specificCoin.btcPrice).toFixed(6)}</span>
            </li>
            <li>
              <p>Rank</p>
              <span>{specificCoin.rank}</span>
            </li>
            <li>
              <p>24h Change</p>
              <span>{specificCoin.change}%</span>
            </li>
            <li>
              <p>Name</p>
              <span>{specificCoin.name}</span>
            </li>
          </ul>
          <ul
            style={{ borderLeft: "1px solid gray", paddingLeft: "2rem" }}
            className="coin-statistic"
          >
            <li>
              <p>Price</p>
              <span>
                US${numberWithCommas(parseFloat(specificCoin.price).toFixed(3))}
              </span>
            </li>
            <li>
              <p>Market Cap</p>
              <span>US${nFormatter(specificCoin.marketCap)}</span>
            </li>
            <li>
              <p>Symbol</p>
              <span>{specificCoin.symbol}</span>
            </li>
          </ul>
        </div>
      </article>
    </section>
  );
}
