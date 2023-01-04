import "./Portofolio.scss";
import { useState } from "react";
import { getCoinData } from "../../features/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import { FaAngleDoubleLeft } from "react-icons/fa";

export default function Portofolio() {
  const [isSearching, setIsSearching] = useState(false);
  const { portofolio, coinData } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCoinData("home"));
  }, []);

  useEffect(() => {
    localStorage.setItem("portofolio", JSON.stringify(portofolio));
  }, [portofolio]);

  /*  Because portofolio in local storage data is not updatable we need to filter
   coinData based of portofolio assets so we can have the lattest prices of coins
   */

  let portofolioFiltered = portofolio.map((coin) => coin.coin.name);
  let filteredCoinData = coinData.filter((item) => {
    return portofolioFiltered.includes(item.name);
  });

  //We need to combine filtered data with the quantity from portofolio

  let getQuantity = portofolio.map((coin) => coin.quantity);
  const data = filteredCoinData.map((coin) => {
    return { coin: coin, quantity: getQuantity };
  });

  //Creating the total sum of are portofolio

  const portofolioSum = data.map((coin, index) => {
    return coin.coin.price * coin.quantity[index];
  });
  function add(accumulator, a) {
    return accumulator + a;
  }
  const currentBalance = portofolioSum.reduce(add, 0);

  useEffect(() => {
    localStorage.setItem("portofolio", JSON.stringify(portofolio));
  }, [portofolio]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (isSearching === true) {
    navigate("/search");
  }

  if (portofolio.length < 1) {
    return (
      <div>
        <div>
          <h2>Yor portofolio is empty</h2>
          <p>Add the first transaction by tappimg on the button below</p>
        </div>
        <button onClick={() => setIsSearching(true)}>
          Add New Transaction
        </button>
      </div>
    );
  }

  return (
    <main className="portofolio">
      <div className="header">
        <div>
          <Link to="/">
            <FaAngleDoubleLeft />
          </Link>{" "}
          <h3>Main Portofolio</h3>
        </div>
        <section>
          <h4 style={{ color: "gray" }}>Current Balance</h4>
          <h2> US${parseFloat(currentBalance).toFixed(2)} </h2>
        </section>
      </div>
      <article>
        <header>
          <h3>Your Assets</h3>
        </header>
        <div className="table-head">
          <p>Asset</p>
          <p>Price</p>
          <p>Holdings</p>
        </div>
        {data.map((item, index) => {
          const { coin, quantity } = item;
          return (
            <div className="table-main" key={index}>
              <div className="asset">
                <img
                  style={{ height: "30px", width: "30px" }}
                  src={coin.iconUrl}
                  alt=""
                />
                <div>
                  <p style={{ fontWeight: "bold" }}> {coin.name} </p>
                  <p style={{ color: "gray" }}> {coin.symbol} </p>
                </div>
              </div>
              <div style={{ alignItems: "center" }} className="coin">
                <p style={{ fontWeight: "bold" }}>
                  US${numberWithCommas(parseFloat(coin.price).toFixed(2))}
                </p>
                <p
                  className="priceChange"
                  style={
                    coin.change > 0
                      ? { color: "rgba(97, 209, 97, 0.855)" }
                      : { color: "red" }
                  }
                >
                  {coin.change > 0 ? (
                    <BiCaretUp
                      style={{
                        color: "rgba(97, 209, 97, 0.855)",
                        fontSize: "20px",
                      }}
                    />
                  ) : (
                    <BiCaretDown style={{ color: "red", fontSize: "20px" }} />
                  )}
                  {coin.change}
                </p>
              </div>
              <div className="coin">
                <p style={{ fontWeight: "bold" }}>
                  US$
                  {numberWithCommas(
                    parseFloat(coin.price * quantity[index]).toFixed(2)
                  )}
                </p>
                <p style={{ color: "gray" }}>
                  {coin.symbol} {quantity[index]}
                </p>
              </div>
            </div>
          );
        })}
      </article>
      <button onClick={() => navigate("/search")} className="newAsset-btn">
        Add New Asset
      </button>
    </main>
  );
}
