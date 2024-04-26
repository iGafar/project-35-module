import { RowDataPacket } from "mysql2/index";
import {
  IComment,
  IProduct,
  IProductImage,
  IProductFilterPayload,
  IAuthRequisits,
} from "@Shared/types";

export type CommentCreatePayload = Omit<IComment, "id">;

export interface ICommentEntity extends RowDataPacket {
  comment_id: string;
  name: string;
  email: string;
  body: string;
  product_id: string;
}

export interface IProductEntity extends IProduct, RowDataPacket {
  product_id: string;
}
export interface ISimilarEntity extends RowDataPacket {
  row_id: string;
  similar_id: string;
  title: string;
  description: string;
  price: number;
  product_id: string;
}

export interface IOthersEntity extends RowDataPacket {
  product_id: string;
  title: string;
  description: string;
  price: number;
  similar_id: string;
}

// export interface IProductSearchFilter {
//   title?: string;
//   description?: string;
//   priceFrom?: number;
//   priceTo?: number;
// }

export interface IProductSearchFilter extends IProductFilterPayload {}

export type ImageCreatePayload = Omit<IProductImage, "id" | "productId">;

export type ProductCreatePayload = Omit<
  IProduct,
  "id" | "comments" | "thumbnail" | "images"
> & { images: ImageCreatePayload[] };

export interface IProductImageEntity extends RowDataPacket {
  image_id: string;
  url: string;
  product_id: string;
  main: number;
}

export interface ProductAddImagesPayload {
  productId: string;
  images: ImageCreatePayload[];
}
export type ProductAddSimilarPayload = {
  productId: string;
  similarId: string;
}[];
export type CommentAddPayload = {
  productId: string;
  commentId: string;
  name: string;
  email: string;
  body: string;
};

export type ImagesRemovePayload = string[];
export type SimilarsRemovePayload = string[];

export interface IUserRequisitesEntity extends IAuthRequisits, RowDataPacket {
  id: number;
}
