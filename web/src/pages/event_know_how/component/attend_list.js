import React, {useCallback, useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {KnowHowContext} from '../store'

import Api from 'context/api'

import PcIcon from '../static/pc_yellow.svg'
import MobileIcon from '../static/mobile_b.svg'
import LevelIcon from '../static/level_g_s.svg'
import LikeIcon from '../static/like_g_s.svg'
import LikeRedIcon from '../static/like_red_s.svg'
import ViewIcon from '../static/view_g_s.svg'
import MoreIcon from '../static/morelist_g.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

function AttendList() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const {KnowHowState, KnowHowAction} = useContext(KnowHowContext)

  const {list, order, condition} = KnowHowState

  const setList = KnowHowAction.setList
  const setMyCnt = KnowHowAction.setMyCnt
  const setMine = KnowHowAction.setMine

  const [moreIdx, setMoreIdx] = useState(-1)
  const dateFormat = (value) => {
    value = value.substr(2, 9)
    return value
  }

  const deleteKnowhow = useCallback(() => {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: '노하우를 정말 삭제하시겠습니까?',
      callback: async () => {
        const res = await Api.knowhow_delete({
          idx: moreIdx
        })

        if (res.result === 'success') {
          setTimeout(() => {
            dispatch(setGlobalCtxMessage({
              type: "alert",
              msg: '삭제가 완료 되었습니다.',
              callback: async () => {
                if (
                  list.filter((v) => {
                    if (v.idx !== moreIdx) {
                      return v
                    }
                  }).length === 0
                ) {
                  const res = await Api.knowhow_list({
                    page: 1,
                    records: 10000,
                    slct_type: 0,
                    slct_platform: condition,
                    slct_order: order
                  })

                  if (res.result === 'success') {
                    setMine(0)
                    setList(res.data.list)
                    setMyCnt(res.data.myCnt)
                  }
                } else {
                  setList(
                    list.filter((v) => {
                      if (v.idx !== moreIdx) {
                        return v
                      }
                    })
                  )
                }
                setMoreIdx(-1)
              }
            }))
          })
        } else {
        }
      }
    }))
  }, [list, moreIdx, condition, order])

  return (
    <div className="attendListWrap">
      {list.map((v, idx, self) => {
        return (
          <div
            className="attendListWrap__item"
            key={idx}
            onClick={() => {
              history.push(`/event_knowHow/detail/${v.idx}`)
            }}>
            <img src={v.image_url} />
            <div className="attendListWrap__item--device">
              {v.slct_device === '1' || v.slct_device === '2' ? <img src={PcIcon} /> : <img src={MobileIcon} />}
            </div>
            <div className="attendListWrap__item__content">
              <div className="attendListWrap__item--header">
                <span>NO.{self.length - idx}</span>
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
                  <img src={ViewIcon} />
                  {v.view_cnt.toLocaleString()}
                </span>
                {v.is_good === 0 ? (
                  <span>
                    <img src={LikeIcon} />
                    {v.good_cnt.toLocaleString()}
                  </span>
                ) : (
                  <span className="red">
                    <img src={LikeRedIcon} />
                    {v.good_cnt.toLocaleString()}
                  </span>
                )}

                {globalState.token.isLogin && v.mem_no === globalState.token.memNo && (
                  <img
                    className={`moreIcon`}
                    src={MoreIcon}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (moreIdx === v.idx) setMoreIdx(-1)
                      else setMoreIdx(v.idx)
                    }}
                  />
                )}
              </span>
            </div>
            {v.idx === moreIdx && (
              <div className="attendListWrap__item--more">
                <p
                  onClick={(e) => {
                    e.stopPropagation()
                    history.push(`/event_knowHow/add/${v.idx}`)
                  }}>
                  수정하기
                </p>
                <p
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteKnowhow()
                  }}>
                  삭제하기
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default AttendList
