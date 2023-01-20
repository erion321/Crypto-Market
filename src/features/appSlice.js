import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//Get portofolio coins from local storage
const getPortofolio = () => {
  let portofolio = localStorage.getItem("portofolio");
  if (portofolio) {
    return JSON.parse(localStorage.getItem("portofolio"));
  } else {
    return [];
  }
};

//Get watchlist coins from local storage
const getWatchlist = () => {
  let watchlist = localStorage.getItem("watchlist");
  if (watchlist) {
    return JSON.parse(localStorage.getItem("watchlist"));
  } else {
    return [];
  }
};

const initialState = {
  //Data from API
  coinData: [],
  //Coins that we want to store
  portofolio: getPortofolio(),
  //Wich coin we want to add to portofolio
  specificCoin: "",
  //Quantity of that coin
  quantity: 0,
  //Coins we want to keep an eye to
  watchlist: getWatchlist(),
  //Loading component in home page
  loading: true,
};

const API_URL =
  "https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0";

//Getting data from API
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
    //Adding spacifik coin to state so we can then add it to portofolio
    addSpecificCoin: (state, action) => {
      localStorage.setItem("myCoin", JSON.stringify(action.payload));
      state.specificCoin = action.payload;
    },
    //Quantity of the coin so we can now how much of that coin we want
    addQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    //removing an item from portofolio
    removeFromPortofolio: (state, action) => {
      state.portofolio = state.portofolio.filter((item) => {
        return item.coin.name != action.payload.coin.name;
      });
    },
    //removing an item from watchlist
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter((coin) => {
        return coin.name != action.payload.name;
      });
    },
    //ading coin to watchlist
    addToWatchlist: (state, action) => {
      /* The parent element of the element where this action is called has also 
      an click event on it so we don't want to click both */
      action.payload.event.stopPropagation();

      let existingItem = state.watchlist.find(
        (item) => item.name == action.payload.coin.name
      );
      //We check if that coin is already in the wachtlist, else we add it
      if (existingItem) {
        return;
      } else {
        state.watchlist = [...state.watchlist, action.payload.coin];
      }
    },
    //Adding coin to portofolio, we combine specific coin with quantity which we store in the state
    addNewTransaction: (state, action) => {
      let existingItem = state.portofolio.find(
        (item) => item.coin.name == state.specificCoin.name
      );
      //If the coin already exist we only add the quantity
      if (existingItem) {
        const addQuantity =
          Number(existingItem.quantity) + Number(state.quantity);

        existingItem.quantity = (Math.round(addQuantity * 100) / 100).toFixed(
          2
        );
      } else {
        let newCoin = {
          coin: state.specificCoin,
          quantity: (Math.round(state.quantity * 100) / 100).toFixed(2),
        };
        state.portofolio = [...state.portofolio, newCoin];
      }
    },
  },

  //Adding the data we get from API to the coinData in the state

  extraReducers(builder) {
    builder
      .addCase(getCoinData.pending, (state, action) => {})
      .addCase(getCoinData.fulfilled, (state, action) => {
        //Checking if the call is comming from the Search component
        if (action.meta.arg.key === "search") {
          if (action.meta.arg.search === "") {
            return void (state.coinData = []);
          }
          //Filtering the data based of the value of the input which wee get from the  search component
          void (state.coinData = action.payload.data.coins.filter((coin) =>
            coin.name
              .toLowerCase()
              .includes(action.meta.arg.search.toLowerCase())
          ));
        } //Checking if the call is comming from the Search component
        else if (action.meta.arg === "home") {
          state.loading = false;
          return void (state.coinData = action.payload.data.coins);
        }
      })
      .addCase(getCoinData.rejected, (state, action) => {});
  },
});

//Exporting actions
export const {
  addSpecificCoin,
  addNewTransaction,
  addQuantity,
  addToWatchlist,
  removeFromPortofolio,
  removeFromWatchlist,
} = appSlice.actions;

export default appSlice.reducer;
