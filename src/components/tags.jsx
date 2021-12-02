import React from 'react';

export default function Tags(props) {
  const tagList = props.tags.map((tag, index) => {
    return (<div key={index} className="tag-chip">{tag}</div>);
  });
  return (
    <div className="row">
      {tagList}
    </div>
  );
}
