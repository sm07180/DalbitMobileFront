import React, {useEffect} from 'react'
import styled from 'styled-components'
import {IMG_SERVER} from 'context/config'
import Swiper from 'react-id-swiper'

export default (props) => {
  const {setPopupPresent} = props

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupPresent()
  }
  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popupPresent') {
      closePopup()
    }
  }

  const presentDatas=[
        {
            num : 1,
            name : '이마트 1만원',
            count : '상품권 1개'
        },
        {
            num : 2,
            name : '이마트 5천원',
            count : '상품권 1개'
        },
        {
            num : 3,
            name : '맘스터치',
            count : '싸이버거 1개'
        },
        {
            num : 4,
            name : '스타벅스',
            count : '아메리카노 1개'
        },
        {
            num : 5,
            name : '20달',
            count : '1개'
        },
        {
            num : 6,
            name : '10달',
            count : '1개'
        },
        {
            num : 7,
            name : '1달',
            count : '1개'
        },
        {
            num : 8,
            name : '꽝',
            count : '10개'
        },
  ]

  const swiperParams = {
    spaceBetween: 5,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
  }

  return (
    <PopupWrap id="popupPresent" onClick={wrapClick}>
        {/* 당첨 결과가 꽝인 경우 popLayer에 blank클래스 추가 */}
        <div className="popLayer">
            <div className="contentWrap" style={{width:'100%'}}>
                <div className="title">
                    선물을 받았어요!
                </div>
                <Swiper {...swiperParams}>
                        {presentDatas.map((present, index) => {
                            return(
                                <div className="presentWrap" key={index}>
                                    <div className="imgWrap">
                                        <img src={`${IMG_SERVER}/event/draw/present-${present.num}.png`}></img>
                                    </div>
                                    <div className="result">추첨결과(1/8)</div>
                                    <div className="name">{present.name}</div>
                                    <div className="counter">{present.count}</div>
                                </div>
                            )})
                        }
                </Swiper>
                {/* 당첨 결과가 꽝일 경우 */}
                {/* <div className="presentWrap">
                    <div className="imgWrap">
                        <img src={`${IMG_SERVER}/event/draw/present-8.png`}></img>
                        <div className="arrowWrap">
                            <img src={`${IMG_SERVER}/event/draw/presentLeft.png`}></img>
                            <img src={`${IMG_SERVER}/event/draw/presentRight.png`}></img>
                        </div>
                    </div>
                    <div className="result">추첨결과(1/8)</div>
                    <div className="resultRow">
                        <div className="name black">꽝</div>
                        <div className="counter">10개</div>
                    </div>
                </div> */}
            </div>
            <div className="buttonWrap">
                <button onClick={closePopup}>
                    확인
                </button>
            </div>
            <button className="close" onClick={closePopup}>
                <img src="https://image.dalbitlive.com/images/api/close_w_l.svg" alt="닫기" />
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
        top:30%;
        right:0;
        width:51px;
        height:51px;
        background:url("https://image.dalbitlive.com/event/draw/presentRight.png") no-repeat center / contain;
        cursor:pointer;
    }
    .swiper-button-prev{
        top:30%;
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
                        margin:17px 0;
                        display:flex;
                        .name{
                            margin-right:5px;
                        }
                    }
                }
                .name{
                    font-size:21px;
                    font-weight:700;
                    color:#632BEB;
                    &.black{
                        color:black;
                    }
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
