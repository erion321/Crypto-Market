import "./Overview.scss";
import { useDispatch } from "react-redux";
import { addNewTransaction, addQuantity } from "../../features/appSlice";
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const myCoin = localStorage.getItem("myCoin");
  const specificCoin = JSON.parse(myCoin);

  return (
    <section>
      <header>
        <h3>{specificCoin.name}</h3>
        <h4> {specificCoin.symbol} </h4>
      </header>
      <main>
        <div>
          <form>
            <input
              onChange={(e) => dispatch(addQuantity(e.target.value))}
              type="number"
              step=".01"
            />
          </form>
          <h4>{specificCoin.symbol}</h4>
        </div>
        <p>
          US$ <span> {parseFloat(specificCoin.price).toFixed(4)} </span>per coin
        </p>
      </main>
      <button
        onClick={() => {
          dispatch(addNewTransaction());
          navigate("/portofolioPage");
        }}
      >
        Add Transaction To Portofolio
      </button>
      <article>
        <h2>Statistics</h2>
      </article>
    </section>
  );
}
