import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Stats from './stats';
import Tags from './tags';


export default function Profile(props) {
  const [expand, setExpand] = useState(0);
  const [tagInput, setTagInput] = useState('');

  const { id, name, stats, tags, url } = props.pokemon;
  console.log(name);

  const handleChange = (event) => {
    setExpand(!expand);
  }

  const handleInput = (event) => {
    setTagInput(event.target.value);
  }

  const handleTag = (event) => {
    if(event.keyCode === 13) {
      props.addTag(tagInput, id);
      setTagInput('');
    }
  }

  return (
    <div className="row space-between">
      <div className="row align-center">
        <div className="student-pic">
          <img src={url} alt="Student Head shot"></img>
        </div>
        <div>
          <div className="pokemon-name">
            <h1>{name.toUpperCase()}</h1>
          </div>
          <div className="pokemon-details">
            { expand && <Stats stats={stats} /> }
            { tags && <Tags tags={tags} /> }
            <input type="text" name={tagInput} value={tagInput}
              placeholder="Add a tag" onChange={handleInput} onKeyUp={handleTag} />
          </div>
        </div>
      </div>
      { expand
        ? <button className="plus-minus-button" onClick={handleChange}>
          <FontAwesomeIcon icon={faPlus}/>
        </button>
        : <button className="plus-minus-button" onClick={handleChange}>
          <FontAwesomeIcon icon={faMinus}/>
        </button>
      }
    </div>
  );
}
