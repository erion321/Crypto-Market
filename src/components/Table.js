import { useDispatch } from "react-redux";
import { addToWatchlist } from "../features/appSlice";
import "./Table.scss";
//React Icons
import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import { AiOutlineStar } from "react-icons/ai";

export default function Table({
  iconUrl,  
  name,
  change,
  rank,
  price,
  symbol,
  marketCap,
  coin,
}) {
  const dispatch = useDispatch();

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

  return (
    <>
      <div className="Td">
        <img src={iconUrl} alt={name} />
        <div className="coin-details">
          <p>{name}</p>
          <div>
            <span className="coin-rank"> {rank} </span>
            <span> {symbol} </span>
            <span style={{ display: "flex" }}>
              {change > 0 ? (
                <BiCaretUp
                  style={{
                    color: "rgba(97, 209, 97, 0.855)",
                    fontSize: "20px",
                  }}
                />
              ) : (
                <BiCaretDown style={{ color: "red", fontSize: "20px" }} />
              )}
              {change}%
            </span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <div>
          <p style={{ fontWeight: "bold" }}>
            US$ {numberWithCommas(parseFloat(price).toFixed(2))}
          </p>
          <p style={{ color: "gray", fontSize: "16px" }}>
            MCap {nFormatter(marketCap)}
          </p>
        </div>
        <button
          onClick={(event) =>
            dispatch(addToWatchlist({ coin: coin, event: event }))
          }
          className="star-btn"
        >
          <AiOutlineStar />
        </button>
      </div>
    </>
  );
}
