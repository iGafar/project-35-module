import axios from "axios";
import { IProduct, ISimilar } from "./redux/types";

export const getProduct = async (
  id: string,
  doSuccessProduct: (data: IProduct) => void,
  doErrorProduct: () => void
) => {
  const config = {
    method: "get",
    url: `http://localhost:3000/api/products/${id}`,
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await axios(config);
    const data: IProduct = response.data;
    doSuccessProduct(data);
  } catch (e) {
    doErrorProduct();
  }
};

export const getSimilars = async (
  id: string,
  doSuccessSimilars: (data: ISimilar[]) => void,
  doErrorSimilars: () => void
) => {
  const config = {
    method: "get",
    url: `http://localhost:3000/api/products/similars/${id}`,
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await axios(config);
    const data: ISimilar[] = response.data;
    doSuccessSimilars(data);
  } catch (e) {
    doErrorSimilars();
  }
};

export const setNewComment = async (
  productId: string,
  name: string,
  email: string,
  body: string,
  doSuccessNewComment: (data: string) => void,
  doErrorNewComment: () => void
) => {
  const config = {
    method: "post",
    url: `http://localhost:3000/api/comments`,
    data: {
      name: name,
      email: email,
      body: body,
      productId: productId,
    },
  };

  try {
    const response = await axios(config);
    const data: string = response.data;
    doSuccessNewComment(data);
  } catch (e) {
    doErrorNewComment();
  }
};

export const getProducts = async (
  doSuccess: (data: IProduct[]) => void,
  doError: () => void
) => {
  const config = {
    method: "get",
    url: "http://localhost:3000/api/products",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(config);
    const data: IProduct[] = response.data;
    doSuccess(data);
  } catch (e) {
    doError();
  }
};
