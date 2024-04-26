// Action types
export const QUERY = "QUERY";
export const SET_VARIANT = "SET_VARIANT";
export const SET_TRANSFERS = "SET_TRANSFERS";
export const SET_COMPANIES = "SET_COMPANIES";

// Query reducer state
export type ProductState = {
  loading: boolean;
  comments: IComment[];
  similars?: ISimilar[];
};

// Sort reducer state
export type ListState = {
  loading: boolean;
  filter: { title: string; priceFrom: number; priceTo: number };
  products: IProductList[];
};

// Product interface
export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: IProductImage;
  comments: IComment[];
  images: IProductImage[];
}

// Product in the list interface
export interface IProductList {
  id: string;
  title: string;
  price: number;
  thumbnail?: IProductImage;
  comments: number;
}

// Similar product interface
export interface ISimilar {
  id: string;
  title: string;
  price: number;
}

// Product image interface
export interface IProductImage {
  id: string;
  productId: string;
  main: boolean;
  url: string;
}

// Comment interface
export interface IComment {
  id: string;
  name: string;
  email: string;
  body: string;
  productId: string;
}
