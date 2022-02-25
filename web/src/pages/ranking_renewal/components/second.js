import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {addComma} from 'components/lib/utility'
import {RankContext} from 'context/rank_ctx'
import styled, {css} from 'styled-components'
import NoResult from 'components/ui/new_noResult'
import ProfileImage from 'components/ui/profileImage'
import '../index.scss'

function Second({empty}) {
  const history = useHistory()
  const {rankState} = useContext(RankContext)
  const {secondList} = rankState

  return (
    <div className="specialPage">
      <div className="notice">
        나를 표현하는 시간 15초 <br />
        달라 광고모델을 소개합니다.
      </div>

      {empty === true ? (
        <NoResult type="default" text="조회 된 결과가 없습니다." />
      ) : (
        <ul className="levelListWrap">
          {secondList.map((v, i) => {
            if (!v) return null
            const {idx, memberList, title, round, regDate, level, levelColor, likeCnt, listenCnt, airTime} = v
            return (
              <li key={`list-${i}`} className="levelListBox" onClick={() => history.push(`/rank/marketing?idx=${idx}`)}>
                <div className="specialBox specialBox-pick">
                  <span className={i === 0 ? `on` : ``}>{round}회차</span>
                </div>
                {memberList &&
                  memberList.map((v1, i1) => {
                    const imageData = {
                      originImg: v1.imageInfo,
                      profImg: v1.imageInfo.thumb292x292,
                      holder: v1.holder,
                      level: v1.level
                    }
                    return (
                      <div className="infoBox flexBox" key={`memberList-${i1}`}>
                        <div className="profileBox">
                          <ProfileImage imageData={imageData} imageSize={74} />
                        </div>
                        <div>
                          <div className="nickNameBox ellipsis">{v1.memNick}</div>
                          <span className="genderBox">
                            <LevelBox levelColor={v1.levelColor}>Lv{v1.level}</LevelBox>
                            <em className={`icon_wrap ${v1.memSex === 'm' ? 'icon_male' : 'icon_female'}`}>
                              <span className="blind">성별</span>
                            </em>
                          </span>
                          <ul className="countBox">
                            <span>
                              <img src="https://image.dalbitlive.com/svg/ico_like_g_s.svg" />
                              {Utility.addComma(likeCnt)}
                            </span>
                            <span>
                              <img src="https://image.dalbitlive.com/svg/people_g_s.svg" />
                              {Utility.addComma(listenCnt)}
                            </span>
                            <span>
                              <img src="https://image.dalbitlive.com/svg/time_g_s.svg" />
                              {Utility.addComma(airTime)}
                            </span>
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                <button className="btnMore">
                  <img src="https://image.dalbitlive.com/svg/icon_more_right.svg" alt="상세페이지이동" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default React.memo(Second)

const LevelBox = styled.div`
  ${(props) => {
    if (props.levelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${props.levelColor[0]}, ${props.levelColor[1]} 51%, ${props.levelColor[2]});
      `
    } else {
      return css`
        background-color: ${props.levelColor[0]};
      `
    }
  }};
  width: 44px;
  height: 16px;
  line-height: 16px;
  border-radius: 14px;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.3px;
`
