import React, {useState, useEffect, useContext} from 'react'

import API from 'context/api'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

//components
import {useHistory} from 'react-router-dom'

//staic
import newIcon from '../static/new_circle_m.svg'

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
    <div id="participantPage">
      <div className="participantBox">
        <Header title="베팅참여자" />

        <div className="content">
          {/* <p className="note">
              기프티콘 당첨 시 출석체크 페이지 중간에 생성된
              <br />
              휴대폰 번호란을 입력하고 저장해야 명단에 추가됩니다.
            </p> */}

          <table>
            <colgroup>
              <col width="40%" />
              <col width="25%" />
              <col width="*" />
            </colgroup>

            <thead>
              <tr>
                <th>참여자</th>
                <th>성공여부</th>
                <th>참여일시</th>
              </tr>
            </thead>

            <tbody>
              {!winList.length ? (
                <tr>
                  <td colSpan="3">깐부 눈치보지말고 베팅해버려~</td>
                </tr>
              ) : (
                winList.map((item, index) => {
                  const {winDt, nickNm, profImg, isNew, memNo, itemImageUrl, itemName} = item
                  return (
                    <tr key={index}>
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
                      <td className="result">
                        성공
                      </td>
                      <td className="date">
                        <span className="iconNew">{isNew ? <img src={newIcon} width={14} alt="new" /> : ''}</span>

                        {dateFormatter(winDt)}
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
