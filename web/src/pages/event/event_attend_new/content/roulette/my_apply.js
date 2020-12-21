import React, {useState, useEffect} from 'react'

import API from 'context/api'
//components
import {useHistory} from 'react-router-dom'

//flag
let currentPage = 1
let moreState = false
let timer

export default () => {
  const history = useHistory()
  const [applyList, setApplyList] = useState([])
  const [nextList, setNextList] = useState([])

  const goBack = () => {
    return history.goBack()
  }

  async function fetchEventRouletteApply(next) {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage
    const {result, data} = await API.getEventRouletteApply({records: 15, page: currentPage})
    if (result === 'success' && data.hasOwnProperty('list')) {
      if (data.list.length === 0) {
        if (!next) {
          setApplyList([])
        }
      } else {
        if (next) {
          moreState = true
          setNextList(data.list)
        } else {
          setApplyList(data.list)
          fetchEventRouletteApply('next')
        }
      }
    } else {
      moreState = false
    }
  }

  const dateFormatter = (date) => {
    if (!date) return null
    //0월 0일 00:00
    // 20200218145519
    let month = date.substring(4, 6)
    let day = date.substring(6, 8)
    let time = `${date.substring(8, 10)}:${date.substring(10, 12)}`
    return `${month}월 ${day}일 ${time}`
    // return `${month}월 ${day}일 ${time}`
  }

  //scroll
  const showMoreList = () => {
    setApplyList(applyList.concat(nextList))
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
    setApplyList([])
    fetchEventRouletteApply()
  }, [])

  return (
    <div id="attendEventPage">
      <div className="win-list-box">
        <div className="header">
          <h1 className="header__title">나의 당첨 이력</h1>
          <button className="header__btnBack" onClick={goBack}>
            <img src="https://image.dalbitlive.com/svg/ic_back.svg" alt="뒤로가기" />
          </button>
        </div>

        <div className="content">
          {/* <p className="note">
              기프티콘 당첨 시 출석체크 페이지 중간에 생성된
              <br />
              휴대폰 번호란을 입력하고 저장해야 명단에 추가됩니다.
            </p> */}

          <table>
            <colgroup>
              <col width="28%" />
              <col width="28%" />
              <col width="44%" />
            </colgroup>

            <thead>
              <tr>
                <th>획득</th>
                <th>참여 일시</th>
                <th>수령 연락처</th>
              </tr>
            </thead>

            <tbody>
              {!applyList.length ? (
                <tr>
                  <td colSpan="3">
                    당첨 내역이 없습니다.
                    <br />
                    응모권을 획득 후 이벤트에 참여해주세요!
                  </td>
                </tr>
              ) : (
                applyList.map((item, index) => {
                  const {itemNo, applyDt, phone} = item

                  const gift_pair = () => {
                    let giftItem

                    if (itemNo === 1) {
                      giftItem = '꽝'
                    } else if (itemNo === 2) {
                      giftItem = '1달'
                    } else if (itemNo === 3) {
                      giftItem = '3달'
                    } else if (itemNo === 4) {
                      giftItem = '초코에몽'
                    } else if (itemNo === 5) {
                      giftItem = '편의점 상품권'
                    } else if (itemNo === 6) {
                      giftItem = '스타벅스 커피'
                    } else if (itemNo === 7) {
                      giftItem = '문화상품권'
                    } else if (itemNo === 8) {
                      giftItem = '교촌치킨 세트'
                    } else if (itemNo === 9 || itemNo === 19 || itemNo === 29) {
                      giftItem = '100달'
                    } else if (itemNo === 14) {
                      giftItem = '초코송이'
                    } else if (itemNo === 15) {
                      giftItem = '바리스타 모카'
                    } else if (itemNo === 16) {
                      giftItem = '베라 싱글'
                    } else if (itemNo === 17) {
                      giftItem = '버거킹 세트'
                    } else if (itemNo === 18) {
                      giftItem = '도미노 피자'
                    } else if (itemNo === 24) {
                      giftItem = '스니커즈'
                    } else if (itemNo === 25) {
                      giftItem = '빠바상품권'
                    } else if (itemNo === 26) {
                      giftItem = '이디야 플랫치노'
                    } else if (itemNo === 27) {
                      giftItem = '맘스터치 세트'
                    } else if (itemNo === 28) {
                      giftItem = '베라 D-BOX'
                    }

                    return giftItem
                  }

                  return (
                    <tr key={index}>
                      <td className="gift">{gift_pair()}</td>
                      <td className="date">{dateFormatter(applyDt)}</td>
                      <td className="phone">
                        <p>{phone === '' ? '해당없음' : `${phone}`}</p>
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
