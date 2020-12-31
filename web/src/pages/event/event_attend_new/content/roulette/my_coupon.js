import React, {useState, useEffect} from 'react'
import API from 'context/api'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'
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

  async function fetchEventRouletteApply(next) {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const {result, data} = await API.getEventRouletteCouponHistory({pageNo: 0, pageCnt: currentPage})
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
          fetchEventRouletteApply('next')
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
    return `${month}월 ${day}일 ${time}`
  }

  //scroll
  const showMoreList = () => {
    setCouponList(couponList.concat(nextList))
    fetchEventRouletteApply('next')
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
    fetchEventRouletteApply()
  }, [])

  return (
    <Layout status="no_gnb">
      <Header title="응모권 지급내역" />
      <div id="attendEventPage">
        <div className="win-list-box">
          <div className="content">
            <div className="note coupon">응모권 지급 내역은 최근 획득 일시 기준 7일 간 저장됩니다.</div>
            <table>
              <colgroup>
                <col width="20%" />
                <col width="30%" />
                <col width="*" />
                <col width="20%" />
              </colgroup>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>획득 일시</th>
                  <th>출처</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {!couponList.length ? (
                  <tr>
                    <td colSpan={4}>최근 7일 간 응모권 지급 내역이 없습니다.</td>
                  </tr>
                ) : (
                  couponList.map((item, index) => {
                    const {type, issue_date, profile_image_info, mem_nick, status, mem_no} = item

                    return (
                      <tr key={index}>
                        <td className="category">{type === 1 ? '기본' : type === 2 ? '이벤트' : <></>} 1개</td>
                        <td className="date">{dateFormatter(issue_date)}</td>
                        <td
                          className="nick"
                          onClick={() => {
                            history.push(`/mypage/${mem_no}`)
                          }}>
                          {profile_image_info && profile_image_info['thumb62x62'] && (
                            <div className="thumb">
                              <img src={profile_image_info['thumb62x62']} alt={mem_nick} />
                            </div>
                          )}
                          <p>{mem_nick}</p>
                        </td>
                        <td className="state">
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
    </Layout>
  )
}
