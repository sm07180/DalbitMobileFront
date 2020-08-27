import React, {useContext} from 'react'
import {Context} from 'context'
import Api from 'context/api'

import {convertContents} from './common_fn'

import {TAB_TYPE, VIEW_TYPE} from '../constant'

function Mylist(props) {
  const {item, setTab, setViewType} = props
  console.log(item)
  const global_ctx = useContext(Context)

  const modifyFn = () => {
    setViewType(VIEW_TYPE.MODIFY)
  }

  const deleteFn = () => {
    global_ctx.action.confirm({
      msg: '삭제하시겠습니끼?',
      callback: async () => {
        const res = await Api.event_proofshot_dellete({
          idx: item.idx
        })

        console.log(res)

        if (res.result === 'success') {
          setTab(TAB_TYPE.ALL)
        }
      }
    })
  }

  return (
    <li>
      {item instanceof Object && (
        <>
          <div className="list__content">
            <a href={`/mypage/${item.mem_no}`}>
              <img src={item.profImg['thumb62x62']} />
            </a>
            <div className="lsit__title">
              <h3>{item.mem_nick}</h3>
              <span>{item.reg_date}</span>
            </div>
            <button>
              <img src={item.image_url} />
            </button>
          </div>
          <div className="subText">
            {convertContents(item)}
            {item.contents.length > 100 && (
              <div className="subText__button">
                {detail === item.idx ? (
                  <button
                    className="button--on"
                    onClick={() => {
                      setDetail(-1)
                    }}>
                    닫히기
                  </button>
                ) : (
                  <button
                    className="button--off"
                    onClick={() => {
                      setDetail(item.idx)
                    }}>
                    펼치기
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <button onClick={modifyFn}>수정</button>
            <button onClick={deleteFn}>삭제</button>
          </div>
        </>
      )}
    </li>
  )
}

export default Mylist
