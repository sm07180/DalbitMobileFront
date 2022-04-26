import React, {useState, useEffect} from 'react'
import API from 'context/api'

import Header from 'components/ui/header/Header'
//components
import {useHistory} from 'react-router-dom'

//flag
let currentPage = 1
let moreState = false
let timer

export default () => {
  const history = useHistory()
  const [couponList, setCouponList] = useState([])
  const [nextList, setNextList] = useState([])

  async function fetchEventRouletteCoupon(next) {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const {result, data} = await API.getEventRouletteCouponHistory({pageNo: currentPage, pageCnt: 40})
    if (result === 'success' && data.hasOwnProperty('list')) {
      if (data.list.length === 0) {
        if (!next) {
          setCouponList([])
        }
      } else {
        if (next) {
          moreState = true
          setNextList(data.list)
        } else {
          setCouponList(data.list)
          fetchEventRouletteCoupon('next')
        }
      }
    } else {
      moreState = false
    }
  }

  const dateFormatter = (date) => {
    if (!date) return null
    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    let time = date.substring(11, 16)
    return `${month}/${day} ${time}`
  }

  //scroll
  const showMoreList = () => {
    setCouponList(couponList.concat(nextList))
    fetchEventRouletteCoupon('next')
  }
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (moreState && windowBottom >= docHeight - 200) {
        showMoreList()
      } else {
      }
    }, 10)
  }

  //--------------------

  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])

  useEffect(() => {
    fetchEventRouletteCoupon()
  }, [])

  return (
    <div id="attendEventPage">
      <div className="win-list-box">
        <Header position={'sticky'} title={'응모권 지급 내역'} type={'back'}/>
        <div className="content">
          <div className="note coupon">응모권 지급 내역은 최근 획득 일시 기준 7일 간 저장됩니다.</div>
          <table>
            <colgroup>
              <col width="15%" />
              <col width="20%" />
              <col width="20%" />
              <col width="*" />
              <col width="20%" />
            </colgroup>
            <thead>
              <tr>
                <th>구분</th>
                <th>내용</th>
                <th>획득 일시</th>
                <th>출처</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {!couponList.length ? (
                <tr>
                  <td colSpan={5}>최근 7일 간 응모권 지급 내역이 없습니다.</td>
                </tr>
              ) : (
                couponList.map((item, index) => {
                  const {type, issue_date, profile_image_info, mem_nick, status, mem_no, coupon_type} = item

                  return (
                    <tr key={index}>
                      <td className="category">{type === 1 ? '기본' : type === 2 ? '이벤트' : <></>}</td>
                      <td>
                        {coupon_type === 1 ? (
                          '방송/청취'
                        ) : coupon_type === 2 ? (
                          '보름달'
                        ) : coupon_type === 3 ? (
                          '구매/결제'
                        ) : coupon_type === 4 ? (
                          '스페셜DJ'
                        ) : (
                          <></>
                        )}
                      </td>
                      <td>{dateFormatter(issue_date)}</td>
                      <td
                        className="nick coupon"
                        onClick={() => {
                          mem_nick && history.push(`/profile/${mem_no}`)
                        }}>
                        {mem_nick ? `${mem_nick}` : '-'}
                      </td>
                      <td className={`state ${status === 0 ? 'point' : ''}`}>
                        {status === 0 ? '미사용' : status === 1 ? '사용' : status === 2 ? '만료' : <></>}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
