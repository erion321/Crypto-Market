import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getPortofolio = () => {
  let portofolio = localStorage.getItem("portofolio");
  if (portofolio) {
    return JSON.parse(localStorage.getItem("portofolio"));
  } else {
    return [];
  }
};

const getWatchlist = () => {
  let watchlist = localStorage.getItem("watchlist");
  if (watchlist) {
    return JSON.parse(localStorage.getItem("watchlist"));
  } else {
    return [];
  }
};

const initialState = {
  coinData: [],
  portofolio: getPortofolio(),
  specificCoin: "",
  quantity: 0,
  watchlist: getWatchlist(),
};

const API_URL =
  "https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0";

export const getCoinData = createAsyncThunk("app/getCointData", async () => {
  const data = await fetch(API_URL, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "af53ce0962msh9a5d974c75f73abp1d74e9jsna0f3700e127d",
      "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
    },
  });

  return data.json();
});

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addSpecificCoin: (state, action) => {
      localStorage.setItem("myCoin", JSON.stringify(action.payload));
      state.specificCoin = action.payload;
    },
    addQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    addToWatchlist: (state, action) => {
      console.log(action);
      let existingItem = state.watchlist.find(
        (item) => item.name == action.payload.name
      );

      if (existingItem) {
        return;
      } else {
        state.watchlist = [...state.watchlist, action.payload];
      }
    },
    addNewTransaction: (state, action) => {
      let existingItem = state.portofolio.find(
        (item) => item.coin.name == state.specificCoin.name
      );

      if (existingItem) {
        existingItem.quantity =
          Number(existingItem.quantity) + Number(state.quantity);
      } else {
        let newCoin = {
          coin: state.specificCoin,
          quantity: (Math.round(state.quantity * 100) / 100).toFixed(2),
        };
        state.portofolio = [...state.portofolio, newCoin];
      }
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getCoinData.pending, (state, action) => {})
      .addCase(getCoinData.fulfilled, (state, action) => {
        if (action.meta.arg.key === "search") {
          if (action.meta.arg.search === "") {
            return void (state.coinData = []);
          }
          void (state.coinData = action.payload.data.coins.filter((coin) =>
            coin.name
              .toLowerCase()
              .includes(action.meta.arg.search.toLowerCase())
          ));
        } else if (action.meta.arg === "home") {
          return void (state.coinData = action.payload.data.coins);
        }
      })
      .addCase(getCoinData.rejected, (state, action) => {});
  },
});

export const {
  addSpecificCoin,
  addNewTransaction,
  addQuantity,
  addToWatchlist,
} = appSlice.actions;

export default appSlice.reducer;
