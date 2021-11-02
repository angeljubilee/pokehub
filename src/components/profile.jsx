import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Grades from './grades';
import Tags from './tags';


export default function Profile(props) {
  const [expand, setExpand] = useState(0);
  const [tagInput, setTagInput] = useState("");

  const average = props.student.grades.reduce((acc, curr) => acc + parseInt(curr), 0)/props.student.grades.length;
  let name = props.student.firstName + ' ' + props.student.lastName;
  name = name.toUpperCase();

  const handleChange = (event) => {
    setExpand(!expand);
  }

  const handleInput = (event) => {
    setTagInput(event.target.value);
  }

  const handleTag = (event) => {
    if(event.keyCode === 13) {
      props.addTag(tagInput, props.student.id);
      setTagInput("");
    }
  }

  return (
    <div className="row space-between">
      <div className="row align-center">
        <div className="student-pic">
          <img src={props.student.pic} alt="Student Head shot"></img>
        </div>
        <div>
          <div className="student-name">
            <h1>{name}</h1>
          </div>
          <div className="student-details">
            <div>
              Email: {props.student.email}
            </div>
            <div>
              Company: {props.student.company}
            </div>
            <div>
              Skill: {props.student.skill}
            </div>
            <div>
              Average: {average}%
            </div>
            { expand
              ? <Grades grades={props.student.grades} />
              : <></>
            }
            { props.student.tags
              ? <Tags tags={props.student.tags} />
              : <></>
            }
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
