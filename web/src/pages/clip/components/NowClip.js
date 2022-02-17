import React, { useState, useEffect, useRef } from 'react'

import '../../../components/ui/listRow/listRow.scss';

import errorImg from "pages/broadcast/static/img_originalbox.svg";

const hexToRgb = (target) => {
  /* 맨 앞의 "#" 기호를 삭제하기. */
  var hex = target.trim().replace( "#", "" );

  /* rgb로 각각 분리해서 배열에 담기. */
  var rgb = ( 3 === hex.length ) ?
    hex.match( /[a-f\d]/gi ) : hex.match( /[a-f\d]{2}/gi );

  rgb.forEach(function (str, x, arr){
    /* rgb 각각의 헥사값이 한자리일 경우, 두자리로 변경하기. */
    if ( str.length == 1 ) str = str + str;

    /* 10진수로 변환하기. */
    arr[ x ] = parseInt( str, 16 );
  });

  return "rgba(" + rgb.join(", ") + ", 0.16)";
};

const NowClip = (props) => {
  const {info} = props;
  const bgRef = useRef();
  const [ bgInfo, setBgInfo ] = useState(hexToRgb(info.randomBg));

  const extractColor = (e) => {
    let imgData = e.currentTarget;
    try {
      if ( imgData.src === errorImg ) return;

      const cnv = document.createElement('canvas');
      const ctx = cnv.getContext('2d');

      ctx.drawImage(imgData, 0, 0, imgData.naturalWidth, imgData.naturalHeight);
      const canvasData = ctx.getImageData(0, 0, imgData.naturalWidth, imgData.naturalHeight);

      let colors = [];
      let blocksize = 1;

      let count = 0;
      let i = 0;
      while ((i += blocksize * 4) < canvasData.data.length) {
        ++count;

        let rgba = [canvasData.data[i], canvasData.data[i + 1], canvasData.data[i + 2]];

        const rgbHex = rgba.map(value => {
          const result = value.toString(16);
          return result.length === 1 ? '0' + result : result;
        });

        colors.push(rgbHex.join(''));
      }

      let picaker = {};

      colors.map(value => {
        if (picaker.hasOwnProperty(value)) {
          picaker[value]++;
        } else {
          picaker[value] = 1;
        }
      });

      let result;

      Object.keys(picaker).map(value => {
        if (result === undefined) {
          result = value;
        }

        if (picaker[value] > picaker[result] && value !== '000000') {
          result = value;
        }
      });

      if (result === undefined) result = '000000';

      bgRef.current.style = `background-color: ${hexToRgb(result)}`;
    } catch (error) {
      console.log(error, e.currentTarget.src);
    }
  };

  const handleImgError = (e) => {
    e.currentTarget.src = errorImg;
  };

  return (
    <>
      <div className='listWrap' ref={bgRef} style={{background: `${bgInfo}`}}>
        <div className="listRow">
          <div className="photo">
            <img crossOrigin="use-credentials" src={info.bgImg.url} alt="" onLoad={extractColor} onError={handleImgError}/>
          </div>
          <div className='listContent'>
            <span className='title'>{info.title}</span>
            <span className='nick'>{info.nickName}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NowClip;