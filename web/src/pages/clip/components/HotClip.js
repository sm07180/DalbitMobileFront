import React, { useState } from 'react';


import 'pages/clip/scss/hotClip.scss';

const HotClip = (props) => {
  const { info } = props;

  return (
    <div className="hotClip">
      <div className="photo">
        <img src={`${info.bgImg.url}`} alt={`${info.nickName}의 클립`}/>
      </div>
      <div className="info">
        <img src={`https://image.dalbitlive.com/clip/dalla/number-${info.rank}.png`}/>
        <div className="textArea">
          <div>
            <span className="type">{info.subjectName}</span>
            <span className="title">{info.fileName}</span>
          </div>
          <span className="nickName">{info.nickName}</span>
        </div>
      </div>
    </div>
  );
};

export default HotClip;