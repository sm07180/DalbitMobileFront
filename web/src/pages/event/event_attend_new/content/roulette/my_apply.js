import React, {useState, useEffect} from 'react'

import API from 'context/api'
//components
import Layout from 'pages/common/layout'
import {useHistory} from 'react-router-dom'

export default () => {
  const history = useHistory()

  const [applyList, setApplyList] = useState({})

  const goBack = () => {
    return history.goBack()
  }

  async function fetchEventRouletteApply() {
    const {result, data} = await API.getEventRouletteApply()
    if (result === 'success') {
      setApplyList(data.list)
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

  //--------------------
  useEffect(() => {
    fetchEventRouletteApply()
  }, [])

  return (
    <Layout status="no_gnb">
      <div id="attendEventPage">
        <div className="win-list-box">
          <div className="header">
            <h1 className="header__title">나의 참여 이력</h1>
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
                      룰렛 참여내역이 없습니다.
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
                        giftItem = '교촌치킨'
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
    </Layout>
  )
}
