import React, {useEffect} from 'react'
import styled, {css} from 'styled-components'

import NoResult from 'components/ui/new_noResult'

export default function LayerWinner({setLayerWinner, list, type}) {
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
    if (!list.length) return null

    const data = list
    const baseCount = 8

    let result = [...data].concat(Array(baseCount - data.length).fill({}))
    return (
      <>
        {result.length !== 0 ? (
          <NoResult text="집계 중입니다." type="default" />
        ) : (
          <>
            {result.map((item, index) => {
              const {theDt, level, levelColor, memNo, nickNm, profImg, gender, grade, isSpecial, holder} = item
              if (Object.keys(item).length !== 0) {
                return (
                  <li className="winner_item" key={index}>
                    <span className="date">{`2월 ${18 + index}일`}</span>
                    <img className="thumbnail_img" src={profImg[`thumb120x120`]} alt="썸네일" />

                    <div className="info_wrap">
                      <div className="info_box">
                        <LevelBox levelColor={levelColor}>
                          <span className="level">{level}</span>
                        </LevelBox>
                        <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'}`}>성별 아이콘</em>
                        {isSpecial && <em className="icon_wrap icon_specialdj">스페셜DJ</em>}
                      </div>
                      <span className="nickname">{nickNm}</span>
                    </div>
                  </li>
                )
              } else {
                return (
                  <li className="winner_item" key={index}>
                    <span className="date">{`2월 ${18 + index}일`}</span>
                    <div className="thumbnail_box">
                      <img src="https://image.dalbitlive.com/event/video_open/20210217/comingsoon@3x.png" alt="물음표 아이콘" />
                    </div>
                    <span className="text_img">
                      <img
                        src="https://image.dalbitlive.com/event/video_open/20210217/comingsoon_text@3x.png"
                        alt="coming soon"
                      />
                    </span>
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
        <h3>{`일간 최고 ${type === 1 ? 'DJ' : '팬'} 당첨자`}</h3>
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
  font-weight: 500;
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
    background: url(https://image.dalbitlive.com/svg/close_w_l.svg) no-repeat 0 0;
  }

  .layerContainer {
    position: relative;
    // width: 100%;
    min-width: 320px;
    max-width: 360px;
    min-height: 450px;
    padding: 0 16px;
    border-radius: 16px;
    background-color: #fff;
    box-sizing: border-box;

    h3 {
      padding: 16px 0;
      font-size: 18px;
      text-align: center;
      font-weight: $bold;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid #e0e0e0;
    }

    .winner_list {
      overflow-y: auto;
      max-height: 400px;
      padding-bottom: 12px;
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
          text-align: center;
          line-height: 20px;
        }

        .thumbnail_img {
          width: 48px;
          height: 48px;
          margin-right: 8px;
          border-radius: 50%;
        }

        .thumbnail_box {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          margin-right: 8px;
          background-color: #eee;
          border-radius: 50%;
        }

        .text_img {
          width: 118px;
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
          }
          .info_box {
            display: flex;
            align-items: center;
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
