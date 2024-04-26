import React, { useState } from "react";
import "./newCommentForm.css";
import { IComment, IProduct } from "../redux/types";
import { useAppDispatch } from "../main";
import { setComents } from "../redux/slices";
import { setNewComment } from "../queries";

interface NewCommentFormProps {
  product: IProduct;
  productComments: IComment[];
}

const NewCommentForm: React.FC<NewCommentFormProps> = ({
  product,
  productComments,
}) => {
  const dispatch = useAppDispatch();
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleClick = () => {
    if (!body.trim()) {
      setError("Error: empty text");
      return;
    } else if (!name.trim()) {
      setError("Error: empty name");
      return;
    } else if (!email.trim()) {
      setError("Error: empty email");
      return;
    }
    if (!email.includes("@")) {
      setError("Error: invalid email format");
      return;
    } else setError("");

    const doSuccessNewComment = (id: string) => {
      const comments = [
        ...productComments,
        {
          id: id,
          name: name,
          email: email,
          body: body,
          productId: product.id,
        },
      ];
      dispatch(setComents(comments));
    };

    const doErrorNewComment = () => {
      setError("Error: failed to add on the server");
    };

    setNewComment(
      product.id,
      name,
      email,
      body,
      doSuccessNewComment,
      doErrorNewComment
    );
    setBody("");
    setName("");
    setEmail("");
  };

  return (
    <div className="new-comment">
      <div className="item-title-header"> New comment </div>

      <label className="new-comment-label">
        Title:{" "}
        <input
          className="new-comment-title"
          name="title"
          type="text"
          value={name}
          maxLength={50}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        E-mail:{" "}
        <input
          className="new-comment-mail"
          name="mail"
          type="text"
          value={email}
          maxLength={30}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
        Text:&nbsp;&nbsp;{" "}
        <textarea
          className="new-comment-text"
          name="text"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
        ></textarea>
      </label>
      <div className="error"> {error} </div>
      <button className="btn-add-comment" type="button" onClick={handleClick}>
        Add comment
      </button>
    </div>
  );
};

export default NewCommentForm;
