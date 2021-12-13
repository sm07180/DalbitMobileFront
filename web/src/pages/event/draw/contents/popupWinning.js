import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Api from "context/api";

export default (props) => {
  const {onClose} = props;
  const [listInfo, setListInfo] = useState([]);

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popupWinning') {
      onClose();
    }
  }

  // 당첨 리스트 가져오기
  const getDrawListInfo = () => {
    Api.getDrawWinningInfo().then(res => {
      if (res.code === '00000') {
        setListInfo(res.data);
      } else {
        console.log(res);
      }
    }).catch(e => console.log(e));
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    getDrawListInfo(); // 당첨 리스트 가져오기

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <PopupWrap id="popupWinning" onClick={wrapClick}>
      <div className="popLayer">
        <div className="contentWrap">
          <div className="title">
            내 당첨 내역
          </div>
          <div className="listWrap">
            {listInfo.map(row => {
              return (
                <div className="listRow" key={row.bbopgi_gift_no}>
                  <div>{row.bbopgi_gift_name}</div>
                  <div>
                    <span className="listImportant">{row.use_coupon_cnt} 개</span> / {row.gift_cnt} 개
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="popNotice">
          기프티콘은 당첨 후 영업장 평일<br/>7일 이내 문자로 전송해드립니다.
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
    letter-space: -1px;
    color: #000000;
    .popLayer{
        position: relative;
        width: calc(100% - 32px);
        max-width: 390px;
        border-radius: 15px;
        background-color: #fff;
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
            padding: 13px 32px;
            .title {
                padding-bottom: 10px;
                margin-bottom: 10px;
                font-size: 18px;
                font-weight: 700;
                text-align: center;
                border-bottom: 1px solid #eee;
            }
            .listWrap{
                display: flex;
                flex-direction:column;
                width:100%;
            }
            .listRow{
                display:flex;
                align-items:center;
                justify-content:space-between;
                font-size: 16px;
                font-weight: 500;
                margin-bottom:9px;
            }
            .listRow:last-child{
                margin-bottom:0;
            }
            .listImportant{
                color:#632beb;
            }
        }
        .popNotice{
            width:100%;
            background:#f3f3f3;
            font-size: 14px;
            font-weight: 500;
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
