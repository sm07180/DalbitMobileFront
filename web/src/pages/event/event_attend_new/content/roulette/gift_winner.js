import React, {useState, useEffect} from 'react'

import API from 'context/api'

//components
import {useHistory} from 'react-router-dom'

//staic
import newIcon from '../../static/new_circle_m.svg'

export default () => {
  const history = useHistory()
  const [winList, setWinList] = useState({})

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

  async function fetchEventRouletteWin() {
    const {result, data} = await API.getEventRouletteWin({
      winType: 0
    })
    if (result === 'success') {
      setWinList(data.list)
    }
  }

  //-------------------

  useEffect(() => {
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
              <col width="28%" />
              <col width="28%" />
              <col width="44%" />
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
                      giftItem = '교촌치킨'
                    }

                    return giftItem
                  }

                  return (
                    <tr key={index}>
                      <td>{gift_pair()}</td>
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
