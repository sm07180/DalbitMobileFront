import React from 'react'

import Room, {RoomJoin} from 'context/room'

//static
import live from './static/live.svg'
import levelIcon from './static/ic_level_s_dkgr.svg'
import fanIcon from './static/ic_circle_fan_s_dkgr.svg'

export default (props) => {
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
                  window.location.href = `/mypage/${memNo}`
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
                  </span>{' '}
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
                      RoomJoin(roomNo)
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
