import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'
import Swiper from 'react-id-swiper'
import moment from 'moment'

import Api from 'context/api'

import Header from 'components/ui/new_header'
import DallaTop from './static/dallaTop.png'

import './style.scss'

const Remain = () => {
  const [myStar, setMyStar] = useState([])
  const [djRank, setDjRank] = useState([])
  const [fanRank, setFanRank] = useState([])

  // 조회 API
  const fetchMainInfo = () => {
    Api.main_init_data().then((res) => {
      if (res.result === 'success') {
        setMyStar(res.data.myStar)
        setDjRank(res.data.djRank)
        setFanRank(res.data.fanRank)
      } else {
        console.log(res.message);
      }
    })
  }

  // 페이지 셋팅
  useEffect(() => {
    fetchMainInfo()
  }, [])

  // 컴포넌트
  const CntTitle = (props) => {
    const {title,children} = props
    return (
      <div className="cntTitle">
        <h2>{title}</h2>
        {children}
        <button>더보기</button>
      </div>
    )
  }

  const ListColumn = (props) => {
    const {data} = props
    return (
      <>
        {data && data.map((list, index) => {
          return (
            <div className="listColumn" key={index}>
              <div className="photo">
                <img src={list.profImg && list.profImg.thumb62x62} alt={list.nickNm} />
              </div>
              <p>{list.nickNm}</p>
            </div>
          )
        })}
      </>
    )
  }
  
  // 페이지 시작
  return (
    <div id="remain">
      <section className='topSwiper'>
        <img src={DallaTop} />
      </section>
      <section className='favorites'>
        <div className="swiperWrap">
          <ListColumn data={djRank} />
        </div>
      </section>
      <section className='top10'>
        <CntTitle title={'일간 TOP10'}>
          <ul className="tabmenu">
            <li className='active'>DJ</li>
            <li>FAN</li>
            <li>LOVER</li>
          </ul>
        </CntTitle>
        <div className="swiperWrap">
          <ListColumn data={djRank} />
        </div>
      </section>
      <section className='new'>
        <CntTitle title={'방금 착륙한 NEW 달둥스'} />
      </section>
      <section className='banner'>
        <ul className='bannerWrap'>
          <li>
            <img src="" />
          </li>
          <li>
            <img src="" />
          </li>
        </ul>
      </section>
    </div>
  )
}

export default Remain
