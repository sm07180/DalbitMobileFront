import React, {useState, useEffect, useContext} from 'react'

import API from 'context/api'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

//components
import {useHistory} from 'react-router-dom'

//staic
import newIcon from '../../static/new_circle_m.svg'

//flag
let currentPage = 1
let moreState = false
let timer
export default () => {
  const context = useContext(Context)
  const history = useHistory()
  const [winList, setWinList] = useState([])
  const [nextList, setNextList] = useState([])

  const goBack = () => {
    return history.goBack()
  }

  const dateFormatter = (date) => {
    if (!date) return null
    //0월 0일 00:00
    // 20200218145519
    let month = date.substring(4, 6)
    let day = date.substring(6, 8)
    let time = `${date.substring(8, 10)}:${date.substring(10, 12)}`
    return `${month}월 ${day}일`
    // return `${month}월 ${day}일 ${time}`
  }

  async function fetchEventRouletteWin(next) {
    if (!next) currentPage = 1
    currentPage = next ? ++currentPage : currentPage

    const {result, data, message} = await API.getEventRouletteWin({
      winType: 0,
      records: 15,
      page: currentPage
    })

    if (result === 'success' && data.hasOwnProperty('list')) {
      if (data.list.length === 0) {
        if (!next) {
          setWinList([])
        }
      } else {
        if (next) {
          moreState = true
          setNextList(data.list)
        } else {
          setWinList(data.list)
          fetchEventRouletteWin('next')
        }
      }
    } else {
      moreState = false
    }
  }

  //scroll
  const showMoreList = () => {
    setWinList(winList.concat(nextList))
    fetchEventRouletteWin('next')
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

  //-------------------
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])

  useEffect(() => {
    setWinList([])
    fetchEventRouletteWin()
  }, [])

  return (
    <div id="attendEventPage">
      <div className="win-list-box">
        <div className="header">
          <h1 className="header__title">기프티콘 당첨자</h1>
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
              <col width="35%" />
              <col width="24%" />
              <col width="39%" />
            </colgroup>

            <thead>
              <tr>
                <th>기프티콘</th>
                <th>당첨 일시</th>
                <th>당첨자</th>
              </tr>
            </thead>

            <tbody>
              {!winList.length ? (
                <tr>
                  <td colSpan="3">당첨자 곧 등장 예정! 행운의 주인공은?</td>
                </tr>
              ) : (
                winList.map((item, index) => {
                  const {itemNo, winDt, nickNm, profImg, isNew, memNo} = item

                  const gift_pair = () => {
                    let giftItem

                    if (itemNo === 4) {
                      giftItem = '초코에몽'
                    } else if (itemNo === 5) {
                      giftItem = '편의점상품권'
                    } else if (itemNo === 6) {
                      giftItem = '스타벅스 커피'
                    } else if (itemNo === 7) {
                      giftItem = '문화상품권'
                    } else if (itemNo === 8) {
                      giftItem = '교촌치킨 세트'
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

                  const gift_image = () => {
                    let giftItem

                    if (itemNo === 4) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_1set_a@2x.png" width="24px" />
                    } else if (itemNo === 5) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_1set_b@2x.png" width="24px" />
                    } else if (itemNo === 6) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_1set_c@2x.png" width="24px" />
                    } else if (itemNo === 7) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_1set_d@2x.png" width="24px" />
                    } else if (itemNo === 8) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_1set_e@2x.png" width="24px" />
                    } else if (itemNo === 14) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_2set_a@2x.png" width="24px" />
                    } else if (itemNo === 15) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_2set_b@2x.png" width="24px" />
                    } else if (itemNo === 16) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_2set_c@2x.png" width="24px" />
                    } else if (itemNo === 17) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_2set_d@2x.png" width="24px" />
                    } else if (itemNo === 18) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_2set_e@2x.png" width="24px" />
                    } else if (itemNo === 24) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_3set_a@2x.png" width="24px" />
                    } else if (itemNo === 25) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_3set_b@2x.png" width="24px" />
                    } else if (itemNo === 26) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_3set_c@2x.png" width="24px" />
                    } else if (itemNo === 27) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_3set_d@2x.png" width="24px" />
                    } else if (itemNo === 28) {
                      giftItem = <img src="https://image.dalbitlive.com/event/attend/201111/ic_gift_3set_e@2x.png" width="24px" />
                    }

                    return giftItem
                  }

                  return (
                    <tr key={index}>
                      <td className="icon">
                        {gift_image()}
                        {gift_pair()}
                      </td>
                      <td className="date">
                        <span className="iconNew">{isNew ? <img src={newIcon} width={14} alt="new" /> : ''}</span>

                        {dateFormatter(winDt)}
                      </td>
                      <td
                        className="nick"
                        onClick={() => {
                          history.push(`/mypage/${memNo}`)
                        }}>
                        <div className="thumb">
                          <img src={profImg.thumb120x120} />
                        </div>
                        <p>{nickNm}</p>
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
