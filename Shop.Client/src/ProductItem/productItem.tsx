import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../main";
import ProductImage from "../ProductImage/productImage";
import ProductComment from "../ProductComment/productComment";
import NewCommentForm from "../NewCommentForm/newCommentForm";
import ProductSimilar from "../ProductSimilar/productSimilar";
import { useParams } from "react-router-dom";
import Loader from "../Loader/loader";
import { IProduct, ISimilar } from "../redux/types";
import { getProduct, getSimilars } from "../queries";
import {
  setComents,
  showLoadingProduct,
  emptyProduct,
  emptySimilar,
} from "../redux/slices";

import "./productItem.css";

interface ProductItemProps {}

const ProductItem: React.FC<ProductItemProps> = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const productId = params.productId;
  const [product, setProduct] = useState(emptyProduct);
  const [similars, setSimilars] = useState([emptySimilar]);

  const doSuccessProduct = (data: IProduct) => {
    setProduct(data);
    dispatch(setComents(data.comments));
    dispatch(showLoadingProduct(false));
  };

  const doErrorProduct = () => {
    dispatch(setComents([]));
    dispatch(showLoadingProduct(false));
  };

  const doSuccessSimilars = (data: ISimilar[]) => {
    setSimilars(data);
  };

  const doErrorSimilars = () => {
    setSimilars([]);
  };

  if (!productId) return;

  if (!product.id) {
    getProduct(productId, doSuccessProduct, doErrorProduct);
    getSimilars(productId, doSuccessSimilars, doErrorSimilars);
  }

  useEffect(() => {
    dispatch(setComents(product.comments));
  }, [product]);

  const loading = useSelector(
    (state: RootState) => state.productSlices.loading
  );
  const comments = useSelector(
    (state: RootState) => state.productSlices.comments
  );

  let productImagesReactNodes;
  if (!!product.images)
    productImagesReactNodes = product.images.map(
      (element) =>
        element.id !== product.thumbnail?.id && (
          <ProductImage key={element.id} src={element.url} />
        )
    );

  let productCommentsReactNodes;
  if (!!comments)
    productCommentsReactNodes = comments.map((element) => (
      <ProductComment
        key={element.id}
        name={element.name}
        body={element.body}
      />
    ));

  let productSimilarReactNodes;
  if (!!similars)
    productSimilarReactNodes = similars.map((element) => (
      <ProductSimilar
        key={element.id}
        title={element.title}
        price={element.price}
      />
    ));

  return (
    <div className="item">
      {loading && <Loader />}

      {!loading && (
        <div className="item-presentation">
          <div className="item-imgage-thumbnail">
            <img
              src={product.thumbnail?.url}
              alt={product.thumbnail?.url}
            ></img>
          </div>
          <div className="item-info">
            <div className="item-title">{product.title}</div>
            <div className="item-description">{product.description}</div>
            <div className="item-price">Price: &nbsp;{product.price}</div>
          </div>
        </div>
      )}

      <div className="line"></div>

      {!loading && <div className="item-title-header"> Other photo </div>}
      {!loading && <div className="item-images">{productImagesReactNodes}</div>}

      <div className="line"></div>

      {!loading && <div className="item-title-header"> Comments </div>}
      {!loading && (
        <div className="item-comments">{productCommentsReactNodes}</div>
      )}

      <div className="line"></div>

      {!loading && (
        <NewCommentForm product={product} productComments={comments} />
      )}

      <div className="line"></div>

      {!loading && <div className="item-title-header"> Similars </div>}
      {!loading && <div className="similars">{productSimilarReactNodes}</div>}
    </div>
  );
};

export default ProductItem;
