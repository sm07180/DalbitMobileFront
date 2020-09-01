import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {KnowHowContext} from '../store'

import LevelIcon from '../static/level_g_s.svg'
import LikeIcon from '../static/like_g_s.svg'
import ViewIcon from '../static/view_g_s.svg'
import MoreIcon from '../static/morelist_g.svg'

function AttendList() {
  const context = useContext(Context)
  const history = useHistory()
  const {KnowHowState} = useContext(KnowHowContext)

  const {list} = KnowHowState

  const dateFormat = (value) => {
    value = value.substr(2, 9)
    return value
  }

  return (
    <div className="attendListWrap">
      {list.map((v, idx) => {
        return (
          <div
            className="attendListWrap__item"
            key={idx}
            onClick={() => {
              history.push('/event_knowHow/detail')
            }}>
            <img src={v.profImg.url} />
            <div className="attendListWrap__item__content">
              <div className="attendListWrap__item--header">
                <span>NO.{idx}</span>
                <span>{dateFormat(v.reg_date)}</span>
              </div>
              <div className="attendListWrap__item--title">{v.title}</div>
              <div className="attendListWrap__item--nickNm">{v.mem_nick}</div>
              <span className="attendListWrap__item--icons">
                <span>
                  <img src={LevelIcon} />
                  {v.level.toLocaleString()}
                </span>
                <span>
                  <img src={LikeIcon} />
                  {v.goodCnt.toLocaleString()}
                </span>
                <span>
                  <img src={ViewIcon} />
                  {v.views.toLocaleString()}
                </span>
                {context.token.isLogin && v.mem_no === context.token.memNo && <img className={`moreIcon`} src={MoreIcon} />}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AttendList
