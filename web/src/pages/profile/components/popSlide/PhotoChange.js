import React, {useState, useContext} from 'react'
import { ReactSortable } from "react-sortablejs";
import {IMG_SERVER} from 'context/config'

// global components
import SubmitBtn from '../../../../components/ui/submitBtn/SubmitBtn';
// components

import './style.scss'
import {Context} from "context";
import {useHistory} from "react-router-dom";

const PhotoChange = (props) => {
  const {list} = props
  const history = useHistory();
  const context = useContext(Context);

  console.log(list);

  const [state, setState] = useState(list);

  return (
    <section className="photoChangeOrder">
      <ReactSortable 
        list={state} 
        setList={setState} 
        className={"gridSection"}
        animation={200}
        delayOnTouchStart={true}
        delay={2}>
        {state.map((data,index) => {
          return (
            <div className="item" key={index}>
              <img src={data.profImg.thumb292x292} alt={index} />
            </div>
          )
        })}
      </ReactSortable>
      <SubmitBtn text="확인" />
    </section>
  )
}

export default PhotoChange
