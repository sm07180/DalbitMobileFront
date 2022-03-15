import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled, {css} from 'styled-components'
// context
import {Context} from 'context'

import NoResult from 'components/ui/new_noResult'
//static
import guideIcon from '../static/guide_s.png'
import {useSelector} from "react-redux";

function LevelList({empty}) {
  const history = useHistory()
  const context = useContext(Context)
  const rankState = useSelector(({rankCtx}) => rankCtx);

  const {levelList} = rankState

  return (
    <>
      <div className="renewalBox">
        <span>매일 00시 집계 및 갱신</span>
        <img
          src={guideIcon}
          onClick={() => {
            context.action.updatePopup('RANK_POP', 'level')
            // context.action.updatePopup('RANK_POP', 'level')
          }}
        />
      </div>
      <ul className="levelListWrap">
        {empty === true ? (
          <NoResult type="default" text="조회 된 결과가 없습니다." />
        ) : (
          <>
            {levelList.map((list, index) => {
              const {
                nickNm,
                fanNickNm,
                fanMemNo,
                profImg,
                holder,
                level,
                grade,
                fanCnt,
                roomNo,
                listenerCnt,
                memNo,
                levelColor
              } = list

              return (
                <li key={index} className="levelListBox">
                  <LevelBox levelColor={levelColor}>{level}</LevelBox>
                  <div
                    className="thumbBox"
                    onClick={() => {
                      if (context.token.isLogin) {
                        history.push(`/profile/${memNo}`)
                      } else {
                        history.push(`/login`)
                      }
                    }}>
                    <img src={holder} className="thumbBox__frame" />
                    <img src={profImg.thumb292x292} className="thumbBox__pic" />
                  </div>
                  <div className="textBox">
                    <div className="nickNameBox">{nickNm}</div>
                    <div className="countBox">
                      <span>
                        <i className="icon icon--fan">F 회색 아이콘</i> {fanCnt}
                      </span>
                      <span>
                        <i className="icon icon--people">회색 사람 아이콘</i> {listenerCnt}
                      </span>
                    </div>
                    <div className="bestFanBox">
                      <span className="bestFanBox__label">최고팬</span>
                      <span
                        className="bestFanBox__nickname"
                        onClick={() => {
                          if (context.token.isLogin) {
                            history.push(`/profile/${fanMemNo}`)
                          } else {
                            history.push(`/login`)
                          }
                        }}>
                        {fanNickNm}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </>
        )}
      </ul>
    </>
  )
}

export default React.memo(LevelList)

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
  min-width: 44px;
  height: 22px;
  border-radius: 14px;
  font-weight: bold;
  font-size: 16px;
  color: #fff;
  text-align: center;
  line-height: 22px;
`
