import "./Watchlist.scss";
import Table from "../Table";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCoinData } from "../../features/appSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Watchlist() {
  const { watchlist } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCoinData({}));
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  console.log(watchlist.length)

  if (watchlist.length < 1) {
    return (
      <div className="add-item">
        <button onClick={() => navigate("/")}>Add item to watchlist</button>
      </div>
    );
  }

  return (
    <div className="watchlist">
      <h2>My Watchlist</h2>
      {watchlist.length > 0 && (
        <div className="Table">
          <div className="Tbody">
            {watchlist.map((coin, index) => {
              return (
                <article key={index} className="Tr">
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
