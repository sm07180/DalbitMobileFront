import React from 'react'
import {useHistory} from 'react-router-dom'
import styled, {css} from 'styled-components'
import NoResult from 'components/ui/new_noResult'
import {useDispatch, useSelector} from "react-redux";

// static
const GoldMedal = 'https://image.dalbitlive.com/svg/medal_gold_b.svg'
const SivelMedal = 'https://image.dalbitlive.com/svg/medal_silver_b.svg'
const BronzeMedal = 'https://image.dalbitlive.com/svg/medal_bronze_m.svg'

export default function VideoEventList({videoRankList}) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()
  return (
    <div className="event_list">
      {Array.isArray(videoRankList) && videoRankList.length > 0 ? (
        videoRankList.map((value, idx) => {
          const {level, memNo, nickNm, rank, profImg, gender, levelColor} = value

          return (
            <div className="event_item" key={`item-${idx}`}>
              <div className="rank">
                {idx < 3 ? (
                  <img className="medal_icon" src={idx === 0 ? GoldMedal : idx === 1 ? SivelMedal : BronzeMedal} />
                ) : (
                  <span className="num">{idx + 1}</span>
                )}
              </div>
              <div className="dj_info">
                <div
                  className="thumb"
                  onClick={() => {
                    if (globalState.token.isLogin) {
                      if (globalState.token.memNo === memNo) {
                        history.push(`/menu/profile`)
                      } else {
                        history.push(`/mypage/${memNo}`)
                      }
                    } else {
                      history.push(`/login`)
                    }
                  }}>
                  <img src={profImg.thumb120x120} alt={nickNm} />
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
                          history.push(`/menu/profile`)
                        } else {
                          history.push(`/mypage/${memNo}`)
                        }
                      } else {
                        history.push(`/login`)
                      }
                    }}>
                    {nickNm}
                  </p>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <NoResult text="리스트가 없습니다." type="default" />
      )}
    </div>
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
