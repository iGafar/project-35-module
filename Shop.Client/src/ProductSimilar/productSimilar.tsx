import "./productSimilar.css";

export interface productSimilarProps {
  title: string;
  price: number;
}
const ProductSimilar = ({ title, price }: productSimilarProps) => {
  return (
    <div className="similar-info">
      <div className="similar-title"> {title} </div>
      <div className="similar-price">Price:{price} </div>
    </div>
  );
};

export default ProductSimilar;
