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
  const [participantList, setParticipantList] = useState([])
  const [nextList, setNextList] = useState([])

  const goBack = () => {
    return history.goBack()
  }

  const dateFormatter = (date) => {
    if (!date) return null
    //0월 0일 00:00
    // 20200218145519
    let year = date.substring(0, 4)
    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    return `${year}.${month}.${day}`
  }

  async function fetchBettingParticipant() {

    const {data, message} = await API.getGganbuMarbleBettingPage({
      gganbuNo: 1,
      pageNo: 1,
      pagePerCnt: currentPage
    })
    if (message === 'SUCCESS') {
      setParticipantList(data.bettingListInfo.list);
      console.log(participantList);
    } else {
      moreState = false
    }
  }

  //scroll
  const showMoreList = () => {
    setParticipantList(participantList.concat(nextList))
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
    fetchBettingParticipant();
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
              {!participantList.length > 0 ? (
                <tr>
                  <td colSpan="3">깐부 눈치보지말고 베팅해버려~</td>
                </tr>
              ) : (
                participantList.map((item, index) => {
                  console.log(participantList)
                  const {image_profile, mem_no, mem_nick, win_slct, ins_date, isNewYn} = item
                  return (
                    <tr key={index}>
                      <td
                        className="nick"
                        onClick={() => {
                          history.push(`/mypage/${mem_no}`)
                        }}>
                        <div className="thumb">
                          <img src={image_profile === null ? "https://devphoto2.dalbitlive.com/profile_3/profile_m_200327.jpg?120x120" : image_profile.thumb120x120} />
                        </div>
                        <p>{mem_nick}</p>
                      </td>
                      <td className="result">
                        {win_slct === "w" ? "성공" : "실패"}
                      </td>
                      <td className="date">
                        {isNewYn === "y" && <span className="iconNew"> <img src={newIcon} width={14} alt="new" /> </span>}
                        {dateFormatter(ins_date)}
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
