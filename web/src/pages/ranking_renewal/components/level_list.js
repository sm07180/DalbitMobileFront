import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled, {css} from 'styled-components'
// context
import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

import NoResult from 'components/ui/noResult'
//static
import guideIcon from '../static/guide_s.png'
import fanIcon from '../static/ic_circle_fan_s_dkgr.svg'
import people from '../static/people_g_s.svg'
function LevelList({empty}) {
  const history = useHistory()
  const context = useContext(Context)
  const {rankState, rankAction} = useContext(RankContext)

  const {levelList} = rankState

  return (
    <>
      <ul>
        <li className="renewalBox">
          <span>매일 00시 집계 및 갱신</span>
          <img
            src={guideIcon}
            onClick={() => {
              context.action.updatePopup('RANK_POP', 'level')
              // context.action.updatePopup('RANK_POP', 'level')
            }}
          />
        </li>

        {empty === true ? (
          <NoResult type="default" text="랭킹이 없습니다." />
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
                        if (context.token.memNo === memNo) {
                          history.push(`/menu/profile`)
                        } else {
                          history.push(`/mypage/${memNo}`)
                        }
                      } else {
                        history.push(`/mypage/${memNo}`)
                      }
                    }}>
                    <img src={holder} className="thumbBox__frame" />
                    <img src={profImg.thumb120x120} className="thumbBox__pic" />
                  </div>
                  <div>
                    <div className="nickNameBox">{nickNm}</div>
                    <div className="countBox">
                      <span>
                        <img src={fanIcon} /> {fanCnt}
                      </span>
                      <span>
                        <img src={people} /> {listenerCnt}
                      </span>
                    </div>
                    <div className="bestFanBox">
                      <span className="bestFanBox__label">최고팬</span>
                      <span
                        className="bestFanBox__nickname"
                        onClick={() => {
                          if (context.token.isLogin) {
                            if (context.token.memNo === fanMemNo) {
                              history.push(`/menu/profile`)
                            } else {
                              history.push(`/mypage/${fanMemNo}`)
                            }
                          } else {
                            history.push(`/mypage/${fanMemNo}`)
                          }
                        }}>
                        {fanNickNm}
                      </span>
                    </div>
                  </div>

                  {/* {roomNo !== "" && (
                <div className="liveBox">
                  <img
                    src={live}
                    onClick={() => {
                      if (context.adminChecker === true) {
                        context.action.confirm_admin({
                          //콜백처리
                          callback: () => {
                            RoomJoin({
                              roomNo: roomNo,
                              shadow: 1
                            })
                          },
                          //캔슬콜백처리
                          cancelCallback: () => {
                            RoomJoin({
                              roomNo: roomNo,
                              shadow: 0
                            })
                          },
                          msg: '관리자로 입장하시겠습니까?'
                        })
                      } else {
                        RoomJoin({
                          roomNo: roomNo
                        })
                      }
                    }}
                    className="liveBox__img"
                  />
                  <br />
                  LIVE
                </div>
              )} */}
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
`
