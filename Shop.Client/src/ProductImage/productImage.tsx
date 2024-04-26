import React from "react";
import "./productImage.css";

interface ProductImageProps {
  src: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ src }) => {
  return (
    <div className="item-image-container">
      <img className="item-image" src={src} alt={src}></img>
    </div>
  );
};

export default ProductImage;
