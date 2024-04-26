export interface IAuthRequisits {
  password: string;
  username: string;
}

export interface IComment {
  body: string;
  email: string;
  id: string;
  name: string;
  productId: string;
}

export interface IProduct {
  comments?: IComment[];
  description: string;
  id: string;
  images?: IProductImage[];
  price: number;
  thumbnail?: IProductImage;
  title: string;
}

export interface IProductFilterPayload {
  description?: string;
  priceFrom?: number;
  priceTo?: number;
  title?: string;
}

export interface IProductImage {
  id: string;
  main: boolean;
  productId: string;
  url: string;
}
