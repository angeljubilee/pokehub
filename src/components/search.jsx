import React from 'react';

export default function Search(props) {
  return (
    <div className="search-field">
      <input type="text" autoComplete="off" id="search" name={props.type}
        placeholder={"Search by " + props.type} value={props.value}
        onChange={props.handleChange} />
    </div>
  );
}
