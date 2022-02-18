import React, {useState, useContext, useEffect, useRef} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Utility, {printNumber, addComma} from 'components/lib/utility'

import CloseBtn from '../static/close_w_l.svg'
import {Context} from 'context'
// import FanIcon from '../static/fan.svg'
// import MoonIcon from '../static/ic_moon.svg'
import 'styles/layerpopup.scss'

import NoResult from 'components/ui/noResult'
import {Scrollbars} from 'react-custom-scrollbars'

export default function RankPopup(props) {
  const {setPopupState} = props

  const history = useHistory()
  const context = useContext(Context)

  const [rankList, setRankList] = useState([])

  const clipNo = props.clip
  // reference
  const scrollbars = useRef(null) // 스크롤 영역 선택자
  //scroll function
  const scrollOnUpdate = () => {
    const thisHeight = document.querySelector('.scrollWrap').offsetHeight + 18
    document.querySelector('.scroll-box').children[0].style.maxHeight = `calc(${400}px)`
  }

  async function feachCilpGiftRankList() {
    const res = await Api.getClipGiftRank({
      clipNo: clipNo
    })
    if (res.result === 'success') {
      setRankList(res.data.list)
    }
  }

  const closePopup = () => {
    setPopupState(false)
  }

  const AddFan = (memNo) => {
    async function AddFanFunc(memNo) {
      const {result, data, message} = await Api.fan_change({
        data: {
          memNo: memNo
        }
      })
      if (result === 'success') {
        context.action.alert({msg: message})
        feachCilpGiftRankList()
      } else {
        context.action.alert({msg: message})
      }
    }
    AddFanFunc(memNo)
  }

  const DeleteFan = (memNo) => {
    async function DeleteFanFunc() {
      const {result, data, message} = await Api.mypage_fan_cancel({
        data: {
          memNo: memNo
        }
      })
      if (result === 'success') {
        context.action.alert({msg: message})
        feachCilpGiftRankList()
      } else {
        context.action.alert({msg: message})
      }
    }
    DeleteFanFunc(memNo)
  }

  useEffect(() => {
    feachCilpGiftRankList()
  }, [])

  useEffect(() => {
    /* popup떳을시 scroll 막는 코드 */
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="mainLayerPopup" onClick={closePopup}>
      <div className="popup popup-fanlist">
        <div className="popup__wrap">
          <div className="popbox active">
            <div className="popup__box popup__text">
              <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                <div className="popup__title">
                  <h3>클립 선물 순위</h3>
                  <button className="close-btn" onClick={() => closePopup()}>
                    <img src={CloseBtn} alt="닫기" />
                  </button>
                </div>
                <div className="inner">
                  <div className="scrollWrap">
                    <div className="scrollWrap-inner">
                      <Scrollbars
                        className="scroll-box"
                        ref={scrollbars}
                        autoHeight
                        autoHeightMax={'100%'}
                        onUpdate={scrollOnUpdate}
                        autoHide>
                        <ul>
                          {rankList.length > 0 ? (
                            rankList.map((item, index) => {
                              return (
                                <li key={index} className="fan-list">
                                  <div onClick={() => history.push(`/profile/${item.memNo}`)}>
                                    <span className="thumb" style={{backgroundImage: `url(${item.profImg.thumb62x62})`}}></span>
                                    <span className="nickNm">{item.nickName}</span>
                                  </div>
                                  {item.isFan === false && item.memNo !== context.token.memNo && (
                                    <button onClick={() => AddFan(item.memNo)} className="plusFan">
                                      +팬등록
                                    </button>
                                  )}
                                  {item.isFan === true && item.memNo !== context.token.memNo && (
                                    <button onClick={() => DeleteFan(item.memNo)}>팬</button>
                                  )}
                                </li>
                              )
                            })
                          ) : (
                            <NoResult text="이벤트 내역이 없습니다." />
                          )}
                        </ul>
                      </Scrollbars>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
