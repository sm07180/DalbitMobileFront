import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled, {css} from 'styled-components'
import NoResult from 'components/ui/new_noResult'
import {IMG_SERVER} from 'context/config'
import {useDispatch, useSelector} from "react-redux";

// static
const GoldMedal = `${IMG_SERVER}/svg/medal_gold_b.svg`
const SivelMedal = `${IMG_SERVER}/svg/medal_silver_b.svg`
const BronzeMedal = `${IMG_SERVER}/svg/medal_bronze_m.svg`

export default function VideoEventList({djRankList, eventSubType}) {
  const history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  return (
    <ul className="event_list">
      {Array.isArray(djRankList) && djRankList.length > 0 ? (
        djRankList.map((value, idx) => {
          const {
            level,
            memNo,
            nickNm,
            rank,
            profImg,
            gender,
            levelColor,
            qupidNickNm,
            qupidProfImg,
            qupidMemNo,
            qupidGender
          } = value

          if (eventSubType === 1) {
            return (
              <li className="event_item" key={`item-${idx}`}>
                <div className="rank">
                  {idx < 3 ? (
                    <img className="medal_icon" src={idx === 0 ? GoldMedal : idx === 1 ? SivelMedal : BronzeMedal} />
                  ) : (
                    <span className="num">{idx + 1}</span>
                  )}
                </div>
                <div className="info_box">
                  <div className="dj_info">
                    <div
                      className="thumb"
                      onClick={() => {
                        if (globalState.token.isLogin) {
                          if (globalState.token.memNo === memNo) {
                            history.push(`/mypage`)
                          } else {
                            history.push(`/profile/${memNo}`)
                          }
                        } else {
                          history.push(`/login`)
                        }
                      }}>
                      <img src={profImg.thumb292x292} alt={nickNm} />
                    </div>
                    <div className="nick_box">
                      <div className="level">
                        <LevelBox levelColor={levelColor}>Lv {level}</LevelBox>
                        <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'} `}></em>
                      </div>
                      <p
                        className="nick"
                        onClick={() => {
                          if (globalState.token.isLogin) {
                            if (globalState.token.memNo === memNo) {
                              history.push(`/mypage`)
                            } else {
                              history.push(`/profile/${memNo}`)
                            }
                          } else {
                            history.push(`/login`)
                          }
                        }}>
                        {nickNm}
                      </p>
                    </div>
                  </div>
                  <div className="cupid_info">
                    <div
                      className="thumb"
                      onClick={() => {
                        if (globalState.token.isLogin) {
                          if (globalState.token.memNo === memNo) {
                            history.push(`/mypage`)
                          } else {
                            history.push(`/profile/${qupidMemNo}`)
                          }
                        } else {
                          history.push(`/login`)
                        }
                      }}>
                      <img src={qupidProfImg.thumb292x292} alt={nickNm} />
                      <em className="cupid">CUPID</em>
                    </div>
                    <div className="nick_box">
                      <p
                        className="nick"
                        onClick={() => {
                          if (globalState.token.isLogin) {
                            if (globalState.token.memNo === memNo) {
                              history.push(`/mypage`)
                            } else {
                              history.push(`/profile/${qupidMemNo}`)
                            }
                          } else {
                            history.push(`/login`)
                          }
                        }}>
                        {qupidNickNm}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )
          } else {
            return (
              <li className="event_item" key={`item-${idx}`}>
                <div className="rank">
                  {idx < 3 ? (
                    <img className="medal_icon" src={idx === 0 ? GoldMedal : idx === 1 ? SivelMedal : BronzeMedal} />
                  ) : (
                    <span className="num">{idx + 1}</span>
                  )}
                </div>
                <div className="info_box">
                  <div className="dj_info fan">
                    <div
                      className="thumb"
                      onClick={() => {
                        if (globalState.token.isLogin) {
                          if (globalState.token.memNo === memNo) {
                            history.push(`/myProfile`)
                          } else {
                            history.push(`/profile/${memNo}`)
                          }
                        } else {
                          history.push(`/login`)
                        }
                      }}>
                      <img src={profImg.thumb292x292} alt={nickNm} />
                    </div>
                    <div className="nick_box">
                      <div className="level">
                        <LevelBox levelColor={levelColor}>Lv {level}</LevelBox>
                        <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'} `}></em>
                      </div>
                      <p
                        className="nick"
                        onClick={() => {
                          if (globalState.token.isLogin) {
                            history.push(`/profile/${memNo}`)
                          } else {
                            history.push(`/login`)
                          }
                        }}>
                        {nickNm}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )
          }
        })
      ) : (
        <NoResult text="집계 중입니다." type="default" />
      )}
    </ul>
  )
}

const LevelBox = styled.div`
  ${(props) => {
    if (props.levelColor && props.levelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${props.levelColor[0]}, ${props.levelColor[1]} 51%, ${props.levelColor[2]});
      `
    } else {
      return css`
        background-color: ${props.levelColor};
      `
    }
  }};
  display: inline-block;
  min-width: 44px;
  height: 16px;
  line-height: 16px;
  border-radius: 14px;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  text-align: center;
`
