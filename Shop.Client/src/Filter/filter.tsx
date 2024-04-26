import React, { useState } from "react";
import { useAppDispatch } from "../main";
import { setFilter } from "../redux/slices";
import "./filter.css";

interface FilterProps {}

const Filter: React.FC<FilterProps> = () => {
  const [title, setTitle] = useState("");
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(0);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(
      setFilter({
        title: title,
        priceFrom: from,
        priceTo: to,
      })
    );
  };

  return (
    <div className="filter">
      <label className="filter-label text-body">
        <b>Title:</b>
      </label>
      &nbsp;&nbsp;
      <input
        className="filter-title text-body"
        name="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      &nbsp;&nbsp;
      <span className="text-body-bold">Price:</span>
      <label className="filter-label">
        <b></b>
      </label>
      &nbsp;&nbsp;
      <input
        className="filter-from"
        name="from"
        type="number"
        value={from}
        min="0"
        onChange={(e) => setFrom(Number(e.target.value))}
      />
      &nbsp;&nbsp;
      <label className="filter-label">
        <b>-</b>
      </label>
      &nbsp;&nbsp;
      <input
        className="filter-to"
        name="from"
        type="number"
        value={to}
        min="0"
        onChange={(e) => setTo(Number(e.target.value))}
      />
      &nbsp;&nbsp;
      <button className="btn-search" type="button" onClick={handleClick}>
        Search
      </button>
    </div>
  );
};

export default Filter;
