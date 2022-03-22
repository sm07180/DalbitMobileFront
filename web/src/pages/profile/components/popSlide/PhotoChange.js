import React, {useState, useContext} from 'react'
import {IMG_SERVER} from 'context/config'

// global components
import InputItems from '../../../../components/ui/inputItems/InputItems';
// components

import './style.scss'
import {Context} from "context";
import {useHistory} from "react-router-dom";

const PhotoChange = (props) => {
  const history = useHistory();
  const context = useContext(Context);

  return (
    <section className="photoChangeOrder">
      <div className="gridSection">
        <div className="item">
          <img src={`https://devphoto.dalbitlive.com/profile_0/21422419200/20220322105552264125.png?500x500`} alt="" />
        </div>
        <div className="item">
        <img src={`https://devphoto.dalbitlive.com/profile_0/21422419200/20220322105552264125.png?500x500`} alt="" />
        </div>
        <div className="item">1</div>
        <div className="item">1</div>
        <div className="item">1</div>
        <div className="item">1</div>
        <div className="item">1</div>
        <div className="item">1</div>
        <div className="item">
        <img src={`https://devphoto.dalbitlive.com/profile_0/21422419200/20220322105552264125.png?500x500`} alt="" />
        </div>
      </div>
    </section>
  )
}

export default PhotoChange
