import React, {useState} from 'react'
import Sampleimg01 from '../static/sample_img01.jpg'
import Sampleimg02 from '../static/sample_img02.jpg'

import {convertContents} from './common_fn'

function AllList({list}) {
  const [detail, setDetail] = useState(-1)

  return (
    <>
      <ul className="list">
        {list &&
          list instanceof Array &&
          list.map((item, index) => {
            return (
              <li key={index}>
                <div className="list__content">
                  <a href={`/mypage/${item.mem_no}`}>
                    <img src={item.profImg['thumb62x62']} />
                  </a>
                  <div className="lsit__title">
                    {/* 닉네임 */}
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
              </li>
            )
          })}
      </ul>
    </>
  )
}

export default React.memo(AllList)
