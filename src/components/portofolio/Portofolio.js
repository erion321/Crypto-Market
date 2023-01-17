import "./Portofolio.scss";
import { useState } from "react";
import { removeFromPortofolio, getCoinData } from "../../features/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import { FaAngleDoubleLeft } from "react-icons/fa";

export default function Portofolio() {
  const [isDeleting, setIsDeleting] = useState(false);
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

  portofolioFiltered = coinData.filter((item) => {
    return portofolioFiltered.includes(item.name);
  });

  //We need to combine filtered data with the quantity from portofolio
  const getQuantity = portofolio.map((coin) => coin.quantity);
  portofolioFiltered = portofolioFiltered.map((coin) => {
    return { coin: coin, quantity: getQuantity };
  });

  //Creating the total sum of are portofolio

  let currentBalance = portofolioFiltered.map((coin, index) => {
    return coin.coin.price * coin.quantity[index];
  });
  currentBalance = currentBalance.reduce(add, 0);

  function add(accumulator, a) {
    return accumulator + a;
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (portofolio.length < 1) {
    return (
      <div className="empty-portofolio">
        <Link to="/" className="home-link">
          <FaAngleDoubleLeft />
        </Link>
        <div>
          <h2>Yor portofolio is empty</h2>
          <h4>Add the first transaction by tapping on the button below</h4>
        </div>
        <button onClick={() => navigate("/search")}>Add New Transaction</button>
      </div>
    );
  }

  return (
    <main className="portofolio">
      <div className="header">
        <div>
          <Link to="/" className="home-link">
            <FaAngleDoubleLeft />
          </Link>
          <h3>Main Portofolio</h3>
        </div>
        <section>
          <h4 style={{ color: "gray" }}>Current Balance</h4>
          <h2>US${numberWithCommas(parseFloat(currentBalance).toFixed(3))}</h2>
        </section>
      </div>
      <article>
        <header>
          <h3>Your Assets</h3>
          <button onClick={() => setIsDeleting(!isDeleting)}>
            Delete Item
          </button>
        </header>
        <div className="table-head">
          <p>Asset</p>
          <p>Price</p>
          <p>Holdings</p>
        </div>
        {portofolioFiltered.map((item, index) => {
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
                  US${numberWithCommas(parseFloat(coin.price).toFixed(3))}
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
                {isDeleting ? (
                  <button onClick={() => dispatch(removeFromPortofolio(item))}>
                    Delete
                  </button>
                ) : (
                  <>
                    <p style={{ fontWeight: "bold" }}>
                      US$
                      {numberWithCommas(
                        parseFloat(coin.price * quantity[index]).toFixed(3)
                      )}
                    </p>
                    <p style={{ color: "gray" }}>
                      {coin.symbol} {quantity[index]}
                    </p>
                  </>
                )}
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
