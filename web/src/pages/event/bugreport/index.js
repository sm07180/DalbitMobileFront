import React from 'react';
import {useSelector} from "react-redux";

import {IMG_SERVER} from 'context/config'
import {Hybrid} from 'context/hybrid'

import Header from 'components/ui/header/Header'


import './style.scss'

const bugReport = () => {
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  const form = () =>{
    if(isDesktop){
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSeAxKCaVqsj3aZC1h2CizPbnCV_grGyZ_z-e22vx5I8GUUz5A/viewform?usp=sf_link')
    }else{
      Hybrid('openUrl', `https://docs.google.com/forms/d/e/1FAIpQLSeAxKCaVqsj3aZC1h2CizPbnCV_grGyZ_z-e22vx5I8GUUz5A/viewform?usp=sf_link`)
    }
  }

  return (
    <div id="bugReport">
      <Header title="버그리포트" type="back"/>
      <section className="mainWrap">
        <img src={`${IMG_SERVER}/event/bugreport/main.png`} alt="버그리포트" />
        <button onClick={()=>{form()}}>
          <img src={`${IMG_SERVER}/event/bugreport/buttonReport.png`} alt="리포트 작성하기" />
        </button>
      </section>
    </div>
  );
};

export default bugReport;