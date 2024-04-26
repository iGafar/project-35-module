import "./productList.css";

export interface productListProps {
  title: string,   
  price : number,
  comments : number,
  url:string,
}
export const ProductList = ({
  title,
  price,
  comments,
  url
}: productListProps) => {

  return (
    <div className="close-image-wrapper">      
          <a className="close-title" href="/"> {title}</a>
          <img src={url} alt={url}></img>
          <div>
            <span className="close-label">Price:</span>
            {price}
          </div>
          <div>
            <span className="close-label">Coмments:</span>
            {comments}
          </div>
        </div> 
    
  );
}
