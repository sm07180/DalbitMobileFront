import React, {useEffect} from 'react'
import styled from 'styled-components'

export default (props) => {
  const {setPopupWinning} = props

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupWinning()
  }
  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popupWinning') {
      closePopup()
    }
  }

  const winningLists = [
      {
          name : "이마트 1만원 상품권",
          get : "1개",
          number : "1개"
      },{
        name : "이마트 5천원 상품권",
        get : "1개",
        number : "10개"
    },{
        name : "맘스터치 싸이버거",
        get : "1개",
        number : "2개"
    },
  ]

  return (
    <PopupWrap id="popupWinning" onClick={wrapClick}>
        <div className="popLayer">
            <div className="contentWrap">
                <div className="title">
                내 당첨 내역
                </div>
                <div className="listWrap">
                    {winningLists.map((winningList, index) =>{
                        return (
                            <div className="listRow" key={index}>
                                <div>{winningList.name}</div>
                                <div>
                                    <span className="listImportant">{winningList.get}</span> / {winningList.number}
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
