import { IComment, IProduct, IProductImage } from "@Shared/types";
import {
  ICommentEntity,
  IProductEntity,
  IProductImageEntity,
  ISimilarEntity,
} from "../../types";

export const mapComment = ({
  comment_id,
  product_id,
  ...rest
}: ICommentEntity): IComment => ({
  id: comment_id,
  productId: product_id,
  ...rest,
});

export const mapComments = (data: ICommentEntity[]): IComment[] =>
  data.map(mapComment);

export const mapProductsEntity = (data: IProductEntity[]): IProduct[] =>
  data.map(({ product_id, title, description, price, category }) => ({
    id: product_id,
    title: title || "",
    description: description || "",
    price: Number(price) || 0,
    category: Number(category) || 0,
  }));

export const mapSimilarEntity = (data: ISimilarEntity[]): IProduct[] =>
  data.map(({ similar_id, title, description, price, product_id }) => ({
    id: similar_id,
    title: title || "",
    description: description || "",
    price: Number(price) || 0,
    product_id: product_id,
  }));

export const mapImageEntity = ({
  image_id,
  product_id,
  url,
  main,
}: IProductImageEntity): IProductImage => ({
  id: image_id,
  productId: product_id,
  main: Boolean(main),
  url,
});

export const mapImagesEntity = (data: IProductImageEntity[]): IProductImage[] =>
  data.map(mapImageEntity);
