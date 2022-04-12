import React, {useState} from 'react'
import { ReactSortable } from "react-sortablejs";

// global components
import SubmitBtn from '../../../../components/ui/submitBtn/SubmitBtn';
// components

import './style.scss'

const PhotoChange = (props) => {
  const {list, confirm} = props;
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
      <SubmitBtn text="확인" onClick={() => confirm(state)}/>
    </section>
  )
};

PhotoChange.defaultProps = {
  confirm: () => {},
};

PhotoChange.defaultProps = {
  confirm: () => {},
};

export default PhotoChange
