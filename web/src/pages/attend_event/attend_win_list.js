import React, {useState, useEffect} from 'react'

//components
import Layout from 'pages/common/layout'
import './attend_event.scss'
import {useHistory} from 'react-router-dom'

//static
import closeBtn from './static/ic_back.svg'
import newIcon from './static/new_circle_m.svg'

export default (props) => {
  const history = useHistory()

  const goBack = () => {
    return history.goBack()
  }
  const {winList} = props

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

  return (
    <Layout {...props} status="no_gnb">
      <div id="attend-event">
        <div className="win-list-box">
          <div className="header">
            <h1 className="header__title">기프티콘 당첨자</h1>
            <button className="header__btnBack" onClick={goBack}>
              <img src={closeBtn} alt="뒤로가기" />
            </button>
          </div>

          <div className="content">
            <p className="note">
              기프티콘 당첨 시 출석체크 페이지 중간에 생성된
              <br />
              휴대폰 번호란을 입력하고 저장해야 명단에 추가됩니다.
            </p>

            <table>
              <colgroup>
                <col width="28%" />
                <col width="28%" />
                <col width="44%" />
              </colgroup>

              <thead>
                <tr>
                  <th>기프티콘</th>
                  <th>당첨일</th>
                  <th>당첨자</th>
                </tr>
              </thead>

              <tbody>
                {!winList.length ? (
                  <tr>
                    <td colSpan="3">8월 16일(일) 당첨자 명단 공개!</td>
                  </tr>
                ) : (
                  winList.map((item, index) => {
                    const {gifticonType, winDt, nickNm, profImg, isNew, memNo} = item

                    return (
                      <tr key={index}>
                        <td>{gifticonType === 1 ? '스타벅스 커피' : 'BHC 뿌링클'}</td>
                        <td className="date">
                          <span className="iconNew">{isNew === 1 ? <img src={newIcon} width={14} /> : ''}</span>

                          {dateFormatter(winDt)}
                        </td>
                        <td
                          className="nick"
                          onClick={() => {
                            history.push(`/mypage/${memNo}`)
                          }}>
                          <div className="thumb">
                            <img src={profImg.thumb292x292} />
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
    </Layout>
  )
}
