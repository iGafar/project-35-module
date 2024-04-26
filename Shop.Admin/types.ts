declare module "express-session" {
  export interface SessionData {
    username?: string;
  }
}

export interface IProductCreate {
  title: string;
  description: string;
  price: string;
  newImages: string;
}

export interface IProductEdit {
  title: string;
  description: string;
  price: string;
  mainImage: string;
  newImages?: string;
  commentsToRemove: string | string[];
  imagesToRemove: string | string[];
  similarsToRemove: string | string[];
  newSimilars?: string | string[];
}
