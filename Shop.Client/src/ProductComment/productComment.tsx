import React from "react";
import "./productComment.css";

interface ProductCommentProps {
  name: string;
  body: string;
}

const ProductComment: React.FC<ProductCommentProps> = ({ name, body }) => {
  return (
    <div className="item-comment">
      <p className="item-comment-name"> {name} </p>
      <p className="item-comment-content"> {body} </p>
    </div>
  );
};

export default ProductComment;
