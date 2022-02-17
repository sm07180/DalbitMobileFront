import React, {useState} from 'react'
import Api from 'context/api'

import {convertContents} from './common_fn'

import {TAB_TYPE, VIEW_TYPE} from '../constant'

import iconDown from '../static/arrow_down.svg'
import iconUp from '../static/arrow_up.svg'
import '../static/proofStyle.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

function Mylist(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {item, setTab, setViewType, eventStatusCheck} = props

  const [detail, setDetail] = useState(-1)

  const modifyFn = () => {
    setViewType(VIEW_TYPE.MODIFY)
  }

  const deleteFn = () => {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: '삭제하시겠습니까?',
      callback: async () => {
        const res = await Api.event_proofshot_dellete({
          data: {
            idx: item.idx
          }
        })

        // console.log(`idx`, idx)
        console.log(`item.idx`, item.idx)

        console.log(res)
        if (res.result === 'success') {
          await eventStatusCheck()
          setTab(TAB_TYPE.ALL)
        }
      }
    }))
  }
  return (
    <ul className="list">
      <li>
        {item instanceof Object && (
          <>
            <div className="list__content">
              <a href={'/menu/profile'} className="list__img">
                <img src={item.profImg['thumb62x62']} />
              </a>
              <div className="title">
                <h3>{item.mem_nick}</h3>
                <span>{item.reg_date}</span>
                <b>Lv{item.level}</b>
              </div>
              <button className="list__saveImg">
                <img src={item.image_url} />
              </button>
            </div>
            <div className="subText">
              {convertContents(item, detail)}
              {item.contents.length > 100 && (
                <div className="subText__button">
                  {detail === item.idx ? (
                    <button
                      className="button--on"
                      onClick={() => {
                        setDetail(-1)
                      }}>
                      닫히기
                      <img src={iconUp} alt="닫히기" />
                    </button>
                  ) : (
                    <button
                      className="button--off"
                      onClick={() => {
                        setDetail(item.idx)
                      }}>
                      펼치기
                      <img src={iconDown} alt="펼치기" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="myButtonWrap">
              <button onClick={modifyFn}>수정</button>
              <button onClick={deleteFn} className="gray">
                삭제
              </button>
            </div>
          </>
        )}
      </li>
    </ul>
  )
}

export default Mylist
