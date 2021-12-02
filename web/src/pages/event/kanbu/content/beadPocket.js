import React, {useState, useEffect, useContext} from 'react'

import API from 'context/api'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

//components
import {useHistory} from 'react-router-dom'
import Utility, {printNumber, addComma} from 'components/lib/utility'

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
    <div id="beadPocketPage">
      <div className="beadPocketBox">
        <Header title="구슬 주머니" />
        <div className="content">
          <div className="mypointWrap">
            <div className="title">내 구슬 주머니 점수</div>
            <div className="mypoint">
              <span className="score">{Utility.addComma(2181)}</span>점
            </div>
          </div>
          <div className="exchangeBead">
            <div className="title">교환 가능한 구슬 획득 내역</div>
            <p className="info">*얻은 구슬만 집계되며, 주머니 받기 시 10개씩 차감됩니다.</p>
            <div className="shadowBox">
              <div className="beadWrap">
                <div className="beadGroup">
                  <span className="bead red"></span>
                  <span className="beadCount">23</span>
                </div>                
                <div className="beadGroup">
                  <span className="bead yellow"></span>
                  <span className="beadCount">0</span>
                </div>                
                <div className="beadGroup">
                  <span className="bead blue"></span>
                  <span className="beadCount">38</span>
                </div>                
                <div className="beadGroup">
                  <span className="bead purple"></span>
                  <span className="beadCount">11</span>
                </div>
              </div>
              <button className="beadBtn small">구슬 주머니 받기</button>
            </div>
          </div>
          <div className="exchangePocket">
            <div className="title">교환 가능한 구슬 주머니</div>
            <div className="shadowBox">
              <div className="pocketWrap">
                  <span className="pocket blue"></span>
                  <span className="pocketCount">0</span>
              </div>
            </div>
            <button className="beadBtn large">구슬 주머니 열기</button>
          </div>
        </div>
        <div className="space"></div>
        <div className="content">
          <div className="titleWrap">
            <div className="title">받은 내역</div>
          </div>
          <table>
            <colgroup>
              <col width="40%" />
              <col width="25%" />
              <col width="*" />
            </colgroup>

            <thead>
              <tr>
                <th>받은사람</th>
                <th>보너스점수</th>
                <th>일자</th>
              </tr>
            </thead>

            <tbody>
              {!winList.length ? (
                <tr>
                  <td colSpan="3">받은 내역이 없습니다.</td>
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
                        <p>{nickNm}</p>
                      </td>
                      <td className="bonus">
                        점
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

      {/*
       <div className="openPocket"> 삭제 시점
        ani1 = 5초
        ani2 = 5초
        ani3 = 6초
        ani4 = 7초
      */}
      <div className="openPocket">
        <div className="openPocketAni ani4">
          <div className="openPocketNum">100</div>
        </div>
      </div>
    </div>
  )
}
