import React, {useState, useContext} from 'react'
import {Context} from 'context'
import Api from 'context/api'
import {convertContents} from './common_fn'
import iconDown from '../static/arrow_down.svg'
import iconUp from '../static/arrow_up.svg'

function AllList({list, isAdmin, eventStatusCheck, fetchEventProofshotList}) {
  const global_ctx = useContext(Context)

  const [detail, setDetail] = useState(-1)
  const [zoom, setZoom] = useState(false)

  const deleteFn = (idx) => {
    global_ctx.action.confirm({
      msg: '삭제하시겠습니끼?',
      callback: async () => {
        const res = await Api.event_proofshot_dellete({
          data: {
            idx: idx
          }
        })
        if (res.result === 'success') {
          await eventStatusCheck()
          await fetchEventProofshotList()
        }
      }
    })
  }

  return (
    <>
      <ul className="list">
        {list &&
          list instanceof Array &&
          list.map((item, index) => {
            return (
              <li key={index}>
                <div className="list__content">
                  <a href={`/mypage/${item.mem_no}`} className="list__img">
                    <img src={item.profImg['thumb336x336']} />
                  </a>
                  <div className="title">
                    <h3>{item.mem_nick}</h3>
                    <span>{item.reg_date}</span>
                    <b>Lv{item.level}</b>
                  </div>
                  <button className="list__saveImg">
                    {list[index].image_url !== '' && (
                      <img src={list[index].image_url} onClick={() => setZoom(list[index].image_url)} />
                    )}
                  </button>
                  <div className="admin_delte">
                    <button
                      className={`${isAdmin === 1 && 'on'}`}
                      onClick={() => {
                        deleteFn(item.idx)
                      }}
                    />
                  </div>
                  {zoom && (
                    <div
                      className="zoom"
                      onClick={() => {
                        setZoom(false)
                      }}>
                      <img src={zoom} />
                    </div>
                  )}
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
              </li>
            )
          })}
      </ul>
    </>
  )
}

export default React.memo(AllList)
