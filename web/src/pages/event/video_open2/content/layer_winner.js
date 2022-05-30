import React, {useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled, {css} from 'styled-components'

import NoResult from 'components/ui/new_noResult'
import {useDispatch, useSelector} from "react-redux";

export default function LayerWinner({setLayerWinner, list, popupType, setPopupType}) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  const closePopup = () => {
    setLayerWinner(false)
  }
  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layerPopup') {
      closePopup()
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const creatList = () => {
    const data = list
    const baseCount = 8

    let result = list.length !== 0 ? [...data].concat(Array(baseCount - data.length).fill({})) : []
    return (
      <>
        {result.length === 0 ? (
          <NoResult text="집계 중입니다." type="default" />
        ) : (
          <>
            {result.map((item, index) => {
              const {theDt, level, levelColor, memNo, nickNm, profImg, gender, grade, isSpecial, holder} = item
              if (Object.keys(item).length !== 0) {
                return (
                  <li className="winner_item" key={index}>
                    <span className="date">{`2월 ${18 + index}일`}</span>
                    <div
                      className="thumbnail_box"
                      onClick={() => {
                        if (globalState.token.isLogin) {
                          history.push(`/profile/${memNo}`)
                        } else {
                          history.push(`/login`)
                        }
                      }}>
                      <img src={profImg[`thumb120x120`]} alt={nickNm} />
                    </div>

                    <div className="info_wrap">
                      <div className="info_box">
                        <LevelBox levelColor={levelColor}>
                          <span className="level">{level}</span>
                        </LevelBox>
                        <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'}`}>성별 아이콘</em>
                        {isSpecial && <em className="icon_wrap icon_specialdj">스페셜DJ</em>}
                      </div>
                      <span
                        className="nickname"
                        onClick={() => {
                          if (globalState.token.isLogin) {
                            history.push(`/profile/${memNo}`)
                          } else {
                            history.push(`/login`)
                          }
                        }}>
                        {nickNm}
                      </span>
                    </div>
                  </li>
                )
              } else {
                return (
                  <li className="winner_item" key={index}>
                    <span className="date">{`2월 ${18 + index}일`}</span>
                    <div className="thumbnail_box null">
                      <img src="https://image.dallalive.com/event/video_open/20210217/comingsoon@3x.png" alt="물음표 아이콘" />
                    </div>
                    <p className="null_text">COMING SOON</p>
                  </li>
                )
              }
            })}
          </>
        )}
      </>
    )
  }

  return (
    <PopupWrap id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer">
        <h3>일간 최고 스타 &amp; 팬</h3>
        <div className="tab_box">
          <button onClick={() => setPopupType(1)} className={popupType === 1 ? 'active' : ''}>
            스타
          </button>
          <button onClick={() => setPopupType(2)} className={popupType === 2 ? 'active' : ''}>
            팬
          </button>
        </div>
        <ul className="winner_list">{creatList()}</ul>
        <button className="btnClose" onClick={closePopup}></button>
      </div>
    </PopupWrap>
  )
}

const LevelBox = styled.div`
  ${({levelColor}) => {
    if (levelColor && levelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${levelColor[0]}, ${levelColor[1]} 51%, ${levelColor[2]});
      `
    } else {
      return css`
        background-color: ${levelColor};
      `
    }
  }};
  min-width: 44px;
  height: 16px;
  line-height: 16px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  text-align: center;
`

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;

  .btnClose {
    position: absolute;
    top: -40px;
    right: 0px;
    width: 32px;
    height: 32px;
    text-indent: -9999px;
    background: url(https://image.dallalive.com/svg/close_w_l.svg) no-repeat 0 0;
  }

  .layerContainer {
    position: relative;
    // width: 100%;
    width: calc(100% - 32px);
    max-width: 360px;
    min-height: 450px;
    border-radius: 16px;
    background-color: #fff;
    box-sizing: border-box;

    h3 {
      padding: 16px 0;
      font-size: 18px;
      text-align: center;
      font-weight: 600;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid #e0e0e0;
    }

    .tab_box {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;

      button {
        width: 60px;
        height: 40px;
        font-size: 16px;
        color: #424242;

        &.active {
          position: relative;
          color: #FF3C7B;
          font-weight: 600;

          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #FF3C7B;
          }
        }
      }
    }

    .winner_list {
      overflow-y: auto;
      max-height: 400px;
      padding: 0 16px 12px;
      .winner_item {
        display: flex;
        align-items: center;
        padding-top: 3%;

        img {
          width: 100%;
        }

        .date {
          width: 63px;
          height: 20px;
          margin-right: 8px;
          border-radius: 12px;
          background-color: #eee;
          font-size: 12px;
          font-weight: 600;
          line-height: 20px;
          text-align: center;
        }

        .thumbnail_box {
          flex-shrink: 0;
          overflow: hidden;
          width: 48px;
          height: 48px;
          margin-right: 8px;
          border-radius: 50%;
          cursor: pointer;

          &.null {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #eee;
            cursor: auto;

            img {
              width: 36px;
              height: 36px;
            }
          }
        }

        .null_text {
          font-size: 18px;
          font-weight: 600;
        }
        /* .thumbnail_box {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          position: relative;

          .holder_img {
            position: absolute;
            z-index: 1;
          }
          .thumbnail_img {
            display: block;
            width: 70%;
            height: 70%;
            position: absolute;
            top: 15%;
            left: 15%;
            border-radius: 50%;
          }
        } */

        .info_wrap {
          flex: 1;

          .nickname {
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            font-size: 14px;
            font-weight: 600;
          }
          .info_box {
            display: flex;
            align-items: center;
          }
          .info_box + .nickname {
            margin-top: 5px;
          }
        }
      }
    }

    .winner_item + .winner_item {
      margin-top: 3%;
      border-top: 1px solid #f2f2f2;
    }
  }
`
