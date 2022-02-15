import React, {useContext, useState} from 'react';

import 'pages/clip/scss/hotClip.scss';
import errorImg from '../../../../src/pages/broadcast/static/img_originalbox.svg';
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {ClipPlayerJoin} from "common/audio/clip_func";
import {Context} from "context";
import {clipJoin} from "pages/common/clipPlayer/clip_func";

const HotClip = (props) => {
  const { info } = props;
  const globalCtx = useContext(Context);
  const history = useHistory();
  const isDesktop = useSelector((state)=> state.common.isDesktop); //

  const handleImgError = (e) => {
    e.currentTarget.src = errorImg;
  };

  const playClip = (e) => {
    const { clipNo } = e.currentTarget.dataset;

    if (clipNo !== undefined) {
      if (isDesktop) {
        ClipPlayerJoin(clipNo, globalCtx, history);
      } else {
        clipJoin(info, globalCtx, 'new')
      }
    }
  };

  return (
    <div>
      <div className="hotClip" data-clip-no={info.clipNo} onClick={playClip}>
        <div className="photo">
          <img src={`${info.bgImg.url}`} alt={`${info.nickName}의 클립`} onError={handleImgError}/>
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
    </div>
  );
};

export default HotClip;