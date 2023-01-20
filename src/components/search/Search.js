import "./Search.scss";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCoinData } from "../../features/appSlice";
import Table from "../Table";
import { addSpecificCoin } from "../../features/appSlice";
import { useNavigate } from "react-router-dom";

export default function Wallet() {
  //Input value that we need for filtering data
  const [search, setSearch] = useState("");
  const { coinData } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Calling the API
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
                    //Redirecting to overview page
                    navigate(`/${coin.name}`);
                    //Pasing coin we clicked so we can store it to specificCoin state
                    dispatch(addSpecificCoin(coin));
                  }}
                  className="Tr"
                >
                  {/* Passing coin properties to table component */}
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
