import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {IMG_SERVER} from 'context/config'
import Swiper from 'react-id-swiper'

export default (props) => {
  const {popupPresent, onClose} = props
  const [failViewYn, setFailViewYn] = useState(false); // 꽝일때 처리하기 위한 Flag 값
  const [swiper, setSwiper] = useState(null);

  const swiperParams = {
    spaceBetween: 5,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    on: {
      /*init: () => {
        console.log(e);
        setSwiper(e);
      },
      slideChange: () => {
        if (swiper !== null && swiper.isEnd && popupPresent.resultInfo.findIndex(row => (row.bbopgi_gift_no && row.temp_result_cnt !== 0)) > -1 ) {
          setFailViewYn(true);
        } else {
          setFailViewYn(false);
        }
      }*/
    }
  };

  useEffect(() => {
    if (popupPresent.resultInfo !== undefined && popupPresent.resultInfo.length === 1 && popupPresent.resultInfo[0].bbopgi_gift_no === 8) {
      setFailViewYn(true);
    }
  },[popupPresent]);

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, []);

  return (
    <PopupWrap id="popupPresent">
      {/* 당첨 결과가 꽝인 경우 popLayer에 blank클래스 추가 */}
      <div className={`popLayer ${failViewYn ? 'blank' : ''}`}>
        <div className="contentWrap" style={{width: '100%'}}>
          <Swiper {...swiperParams}>
            {popupPresent.resultInfo !== undefined && popupPresent.resultInfo.map((row, index) => {
              if (row.bbopgi_gift_no === 0) {
                return (<></>)
              }

              return (
                <div className="presentWrap" key={index}>
                  <div className="title">{row.bbopgi_gift_no === 8 ? '꽝! 다음 기회에...' : '선물을 받았어요!'}</div>
                  <div className="imgWrap">
                    <img src={`${IMG_SERVER}/event/draw/present-${row.bbopgi_gift_no}.png`}/>
                  </div>
                  <div className="result">추첨결과({index + 1}/{popupPresent.resultInfo.length})</div>
                  <div className={`${row.bbopgi_gift_no !== 8 ? 'resultCenter': 'resultRow'}`}>
                    <div className="name">{row.bbopgi_gift_name}</div>
                    <div className="counter">{row.temp_result_cnt}개</div>
                  </div>
                </div>
              )
            })}
          </Swiper>
        </div>
        <div className="buttonWrap">
          <button onClick={onClose}>
            확인
          </button>
        </div>
        <button className="close" onClick={onClose}>
          <img src="https://image.dalbitlive.com/images/api/close_w_l.svg" alt="닫기"/>
        </button>
      </div>
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    box-sizing: border-box;
    z-index: 100;
    font-family: 'Noto Sans KR', sans-serif;
    color: #000000;
    letter-spacing: -1px;
    .swiper-container {
        width:100%;
    }
    .swiper-button-next{
        top:48%;
        right:0;
        width:51px;
        height:51px;
        background:url("https://image.dalbitlive.com/event/draw/presentRight.png") no-repeat center / contain;
        cursor:pointer;
    }
    .swiper-button-prev{
        top:48%;
        left:0;
        width:51px;
        height:51px;
        background:url("https://image.dalbitlive.com/event/draw/presentLeft.png") no-repeat center / contain;
        cursor:pointer;
    }
    .popLayer{
        position: relative;
        width: calc(100% - 32px);
        max-width: 390px;
        border-radius: 15px;
        background-color: #fff;
        &::after{
            content:"";
            position:absolute;
            top:-96px;
            left:50%;
            transform: translateX(-50%);
            width:164px;
            height:139px;
            background:url("https://image.dalbitlive.com/event/draw/presentTop.png") no-repeat center / contain;
        }
        &::before{
            content:"";
            position:absolute;
            top:-80px;
            left:50%;
            transform: translateX(-50%);
            width:350px;
            height:135px;
            background:url("https://image.dalbitlive.com/event/draw/presentBackLight.png") no-repeat center / contain;
            opacity:0.4;
        }
        &.blank{
            &::after{
                content:none;
            }
            &::before{
                content:none;
            }
        }
        .close {
            position: absolute;
            top: -50px;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            cursor: pointer;
            img {
                width: 22px;
                height: 22px;
            }
        }
        .contentWrap {
            display:flex;
            flex-direction:column;
            justify-content:center;
            .title {
                padding-bottom: 10px;
                margin-top: 40px;
                margin-bottom: 10px;
                font-size: 22px;
                font-weight: 700;
                text-align: center;
            }
            .presentWrap{
                display:flex;
                flex-direction:column;
                align-items:center;
                .imgWrap{
                    width:100%;
                    position:relative;
                    img{width: 100%;}
                    .arrowWrap{
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        position:absolute;
                        top:50%;
                        transform:translateY(-50%);
                        width:100%;
                        img{
                            width:51px;
                            height:51px;
                            cursor:pointer;
                        }
                    }
                }
                .result{
                    width: 95px;
                    height: 26px;
                    line-height: 26px;
                    background:#e6e6e6;
                    border-radius:30px;
                    font-size:14px;
                    font-weight:500;
                    text-align:center;
                    margin-top:5px;
                    &Row{
                        line-height: 21px;
                        margin:17px 0;
                        display:flex;
                        .name{
                            margin-right:5px;
                            color:black;
                        }
                    }
                    &Center{
                        text-align: center;
                    }
                }
                .name{
                    font-size:21px;
                    font-weight:700;
                    color:#632BEB;
                }
                .counter{
                    font-size:21px;
                    font-weight:500;
                    color:#000;
                }
            }
        }
        .popNotice{
            width:100%;
            background:#f3f3f3;
            font-size: 14px;
            font-weight: 500;
            color:#000;
            text-align:center;
            padding:7px 0;
        }
        .buttonWrap{
            padding:10px 16px 15px; 
            button{
                display:flex;
                justify-content:center;
                align-items:center;
                width:100%;
                height:40px;
                border-radius:12px;
                background:#632beb;
                font-size: 17px;
                font-weight: 500;
                color:#fff;
            }
        }
    }
    
`
