import "./Search.scss";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCoinData } from "../../features/appSlice";
import Table from "../Table";
import { addSpecificCoin } from "../../features/appSlice";
import { useNavigate } from "react-router-dom";

export default function Wallet() {
  const [search, setSearch] = useState("");
  const { coinData } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCoinData({ search: search, key: "search" }));
  }, [search]);

  return (
    <div className="search">
      <form>
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="e.g. bitcoin"
        />
      </form>

      {coinData.length > 0 && (
        <div className="Table search-table">
          <div className="Tbody">
            {coinData.slice(0, 6).map((coin, index) => {
              return (
                <article
                  key={index}
                  onClick={() => {
                    navigate(`/${coin.name}`);
                    dispatch(addSpecificCoin(coin));
                  }}
                  className="Tr"
                >
                  <Table {...coin} coin={coin} />
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
