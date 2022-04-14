import React, {useEffect, useState} from 'react';
// global components
import '../../scss/partsPop.scss';
import Api from "context/api";


const PartsPop = (props) => {
  const {partsSelect,imsiData} = props;

  // 페이지 시작
  return (
    <section className="partsSelect">
      <div className="partsGroup">
        {imsiData.length >0 && imsiData.map((data,index) => {
          return (
            <div className="partsItem" data-target-value={data.index} onClick={()=>partsSelect(data.bg_url,data.bg_code)} key={index}>
              <img src={data.bg_url} alt={data.bg_name} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PartsPop;