import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Room, {RoomJoin} from 'context/room'

// context
import {Context} from 'context'

//static
import live from './static/live.svg'
import levelIcon from './static/ic_level_s_dkgr.svg'
import fanIcon from './static/ic_circle_fan_s_dkgr.svg'

export default (props) => {
  const context = useContext(Context)
  const history = useHistory()
  const {levelList} = props

  return (
    <>
      <ul>
        {levelList.map((list, index) => {
          const {nickNm, fanNickNm, profImg, holder, level, grade, fanCnt, roomNo, memNo} = list

          return (
            <li key={index} className="levelListBox">
              <div
                className="thumbBox"
                onClick={() => {
                  history.push(`/mypage/${memNo}`)
                }}>
                <img src={holder} className="thumbBox__frame" />
                <img src={profImg.thumb120x120} className="thumbBox__pic" />
              </div>
              <div>
                <div className="nickNameBox">{nickNm}</div>
                <div className="bestFanBox">
                  <span className="bestFanBox__label">최고FAN</span>
                  {fanNickNm}
                </div>
                <div className="countBox">
                  <span>
                    <img src={levelIcon} /> Lv.{level}
                  </span>
                  <span>
                    <img src={fanIcon} /> {fanCnt}
                  </span>
                </div>
              </div>

              {roomNo !== '' && (
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
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
