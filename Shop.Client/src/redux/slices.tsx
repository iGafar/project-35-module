import { createSlice } from "@reduxjs/toolkit";
import { ProductState, ListState } from "./types";
import { IProduct, ISimilar } from "../redux/types";

export const emptyProduct: IProduct = {
  id: "",
  title: "",
  description: "",
  price: 0,
  thumbnail: {
    id: "",
    productId: "",
    main: true,
    url: "",
  },
  comments: [
    {
      id: "",
      name: "",
      email: "",
      body: "",
      productId: "",
    },
  ],
  images: [
    {
      id: "",
      productId: "",
      main: true,
      url: "",
    },
  ],
};

export const emptySimilar: ISimilar = {
  id: "",
  title: "",
  price: 0,
};

const sortIntialState: ListState = {
  loading: false,
  filter: { title: "", priceFrom: 0, priceTo: 0 },
  products: [],
};

const queryIntialState: ProductState = {
  loading: false,
  comments: [
    {
      id: "6dfb448b-df24-4b05-8965-676e433b9a41",
      name: "nata",
      email: "liseo@gardner.biz",
      body: "laudantium enim quasi est quidem magnam voluptate ipsam eos tempora quo necessitatibus dolor quam autem quasi reiciendis et nam sapiente accusantium",
      productId: "34e1a2a7-d0a9-4c7a-99f6-c2d5b5afaa06",
    },
  ],
};

const listSlices = createSlice({
  name: "list",
  initialState: sortIntialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    showLoadingList: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const productSlices = createSlice({
  name: "product",
  initialState: queryIntialState,
  reducers: {
    showLoadingProduct: (state, action) => {
      state.loading = action.payload;
    },
    setComents: (state, action) => {
      state.comments = action.payload;
    },
    setSimilars: (state, action) => {
      state.similars = action.payload;
    },
  },
});

export const { setFilter, setProducts, showLoadingList } = listSlices.actions;
export const { setComents, showLoadingProduct } = productSlices.actions;
export { listSlices, productSlices };
