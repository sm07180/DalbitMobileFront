import React, {useEffect, useState} from 'react';
// global components
import '../../scss/partsPop.scss';

const imsiData = [
  {idx: 1, url: 'https://image.dalbitlive.com/team/parts/A-7.png'},
  {idx: 2, url: 'https://image.dalbitlive.com/team/parts/B-7.png'},
  {idx: 3, url: 'https://image.dalbitlive.com/team/parts/C-9.png'},
  {idx: 4, url: ''},
  {idx: 5, url: ''},
  {idx: 6, url: ''},
  {idx: 7, url: ''},
  {idx: 8, url: ''},
  {idx: 9, url: ''},
  {idx: 10, url: ''},
  {idx: 11, url: ''},
  {idx: 12, url: ''},
];

const PartsPop = (props) => {
  const {partsSelect} = props;

  const partsChoice = (e) => {
    const {targetValue} = e.currentTarget.dataset;

    partsSelect(imsiData[targetValue - 1].url);

  }

  // 페이지 시작
  return (
    <section className="partsSelect">
      <div className="partsGroup">
        {imsiData.map((data,index) => {
          return (
            <div className="partsItem" data-target-value={data.idx} onClick={partsChoice} key={index}>
              <img src={data.url} alt="" />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PartsPop;