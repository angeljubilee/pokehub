import React from "react";

export default function Stats(props) {
  const stats = props.stats.map((grade, index) => {
    return (
      <li key={index} className="row grade">
        <div>Test {index + 1}</div>
        <div className="margin-left-2">{grade}%</div>
      </li>
    )
  });
  return (
    <ul className="margin-top-1">{stats}</ul>
  );
}
