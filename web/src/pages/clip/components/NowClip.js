import React, { useEffect, useRef } from 'react'
import ListRow from "components/ui/listRow/ListRow";
import errorImg from "pages/broadcast/static/img_originalbox.svg";
import '../../../components/ui/listRow/listRow.scss';
import {PHOTO_SERVER} from "context/config";

const NowClip = (props) => {
  const { info } = props;
  const bgRef = useRef();

  const extractColor = (e) => {
    const target = e;
    console.log('tq');

    const cnv = document.createElement('canvas');
    const ctx = cnv.getContext('2d');
/*

    cnv.setAttributes('width', e.currentTarget.width);
    cnv.setAttributes('height', e.currentTarget.height);
*/

    ctx.drawImage(e.currentTarget, 0, 0, e.currentTarget.width, e.currentTarget.height);
    //e.currentTarget.crossOrigin = '';
    const imgData = ctx.getImageData(0, 0, e.currentTarget.width, e.currentTarget.height);

    console.log(imgData);

    let colors = [];
    let blocksize = 1;

    let count = 0;
    let i = 0;
    while ((i += blocksize * 4) < imgData.data.length) {
      ++count;

      let rgba = [imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]];

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

      if (picaker[value] > picaker[result]) {
        result = value;
      }

    });


    console.log('결과는', result, picaker[result]);

    bgRef.current.style = `background-color: ${hexToRgb(result)}`;
  }

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
  }

  const handleImgError = (e) => {
    e.currentTarget.src = errorImg;
  };

  return (
    <>
      <div className='listWrap' ref={bgRef} style={{backgroundColor: `${info.randomBg}`}}>
        <div className="listRow">
          <div className="photo">
            <img src={info.bgImg.url} alt="" onError={handleImgError}/>
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