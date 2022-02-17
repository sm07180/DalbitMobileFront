import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {RoomJoin} from 'context/room'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import NoResult from 'components/ui/noResult'
import Header from 'components/ui/new_header'
import NoticeTab from 'pages/common/noticeTab'
import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const currentDate = new Date()
export default function Alert() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  const [alarmList, setAlarmList] = useState([])
  const [allCheck, setAllCheck] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [deleteActive, setDeleteActive] = useState(false)
  // 플레이가공
  const fetchDataPlay = async (clipNum) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      localStorage.removeItem('clipPlayListInfo')
      const oneClipPlayList = {
        clipNo: data.clipNo,
        bgImg: data.bgImg,
        title: data.title,
        nickName: data.nickName,
        subjectType: data.subjectType,
        isNew: data.isNew,
        filePlayTime: data.filePlay,
        isSpecial: data.isSpecial,
        badgeSpecial: data.badgeSpecial,
        gender: data.gender,
        replyCnt: data.replyCnt,
        goodCnt: data.goodCnt,
        playCnt: data.playCnt
      }
      localStorage.setItem('oneClipPlayList', JSON.stringify(oneClipPlayList))
      clipJoin(data, dispatch, globalState, 'none', 'push')
    } else {
      if (code === '-99') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            history.push('/login')
          }
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message
        }))
      }
    }
  }
  async function fetchData() {
    const res = await Api.my_notification({
      params: {
        page: 1,
        records: 1000
      }
    })
    if (res.result === 'success') {
      if (res.data.list.length > 0) {
        setAlarmList(
          res.data.list.map((v) => {
            v.check = false
            return v
          })
        )
      } else {
        setAlarmList([])
        setEmpty(true)
      }
    }
  }

  const handleClick = (something) => {
    const {notiType, contents, memNo, roomNo, regDt, regTs, profImg, link} = something

    switch (notiType) {
      case 1:
        RoomJoin({roomNo: roomNo})
        break
      case 2:
        history.push('/')
        break
      case 5:
        history.push('/')
        break
      case 6:
        break
      case 7:
        history.push(`/customer/notice/${roomNo}`)
        break
      case 31:
        if (globalState.profile.memNo === roomNo) {
          history.push(`/mypage/${roomNo}/fanboard`)
        } else {
          history.push(`/mypage/${roomNo}?tab=1`)
        }
        break
      case 32:
        history.push(`/mypage/${globalState.profile.memNo}/wallet`)
        break
      case 33:
        break
      case 35:
        history.push('/menu/profile')
        break
      case 36:
        history.push(`/mypage/${memNo}`)
        break
      case 37:
        history.push('/customer/qnaList')
        break
      case 38:
        history.push(`/mypage/${memNo}?tab=0`)
        break
      case 39:
        history.push(`/rank?rankType=3&dateType=2`)
        break
      case 40:
        history.push(`/rank?rankType=3&dateType=1`)
        break
      case 41:
        history.push(`/rank?rankType=1&dateType=1`)
        break
      case 42:
        history.push(`/rank?rankType=1&dateType=2`)
        break
      case 43:
        history.push(`/rank?rankType=2&dateType=1`)
        break
      case 44:
        history.push(`/rank?rankType=2&dateType=2`)
        break
      case 45:
        fetchDataPlay(roomNo)
        break
      case 46:
        fetchDataPlay(roomNo)
        break
      case 47:
        fetchDataPlay(roomNo)
        break
      case 48:
        history.push(`/mypage/${globalState.profile.memNo}/my_clip`)
        break
      case 53:
        history.push(`/event/attend_event`)
        break
      case 50:
        let mobileLink = link
        try {
          mobileLink = JSON.parse(mobileLink).mobile
        } catch (e) {}
        if (mobileLink !== undefined) history.push(mobileLink)
      default:
        break
    }
  }

  const convertDate = (something) => {
    if (!something) return ''
    // 공백제거
    something = something.replace(/\s/gi, '')
    const year = something.substr(0, 4)
    const month = something.substr(4, 2)
    const days = something.substr(6, 2)
    const timeForm = something.substr(8, 4)

    if (
      currentDate.getFullYear() === parseInt(year) &&
      currentDate.getMonth() + 1 === parseInt(month) &&
      currentDate.getDate() === parseInt(days)
    ) {
      return timeForm.substr(0, 2) + ':' + timeForm.substr(2, 4)
    } else {
      return year + '.' + month + '.' + days + '  ' + timeForm.substr(0, 2) + ':' + timeForm.substr(2, 4)
    }
  }

  const deleteAlarm = async () => {
    const checkList = alarmList.filter((v) => {
      return v.check
    })

    let deleteIdx = ''

    checkList.forEach((v, i, self) => {
      if (i === self.length - 1) {
        deleteIdx += v.notiIdx
      } else {
        deleteIdx += v.notiIdx + '|'
      }
    })
    const res = await Api.deleteAlarm({
      delete_notiIdx: deleteIdx
    })
    if (res.result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: res.message,
        callback: () => {
          fetchData()
          dispatch(setGlobalCtxMessage({
            type: "alert",
            visible: false
          }))
        }
      }))
    } else {
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const a = alarmList.filter((v) => {
      return v.check
    })

    if (a.length === alarmList.length) {
      if (alarmList.length > 0) {
        setDeleteActive(true)
        setAllCheck(true)
      }
    } else {
      if (a.length > 0) setDeleteActive(true)
      else setDeleteActive(false)
      setAllCheck(false)
    }
  }, [alarmList])

  return (
    <div id="alarmWrap">
      <Header>
        <h2 className="header-title">
          알림
          {alarmList.length > 0 && <span className="header__count">{alarmList.length}</span>}
        </h2>
        <div className="header__right">
          <button className={`${deleteActive && 'isActive'} deleteIcon`} onClick={deleteAlarm}></button>
          <div className="allCheck">
            <DalbitCheckbox
              status={allCheck}
              size={20}
              callback={(e) => {
                setAlarmList(
                  alarmList.map((v) => {
                    v.check = !allCheck
                    return v
                  })
                )
              }}
            />
          </div>
        </div>
      </Header>
      <NoticeTab />
      <div className="contents">
        {alarmList.length > 0 &&
          alarmList.map((v, idx) => {
            return (
              <div key={idx} className="contents__list" onClick={() => handleClick(v)}>
                <div className="contents__list--img">
                  <img src={v.profImg.thumb88x88} />
                </div>
                <div className="contents__list--text">
                  <div className="contents__list--title" dangerouslySetInnerHTML={{__html: v.contents}}></div>
                  <div className="contents__list--time">{convertDate(v.regDt)}</div>
                </div>
                <div
                  className="contents__list--check"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}>
                  <DalbitCheckbox
                    status={v.check}
                    size={20}
                    callback={() => {
                      setAlarmList(
                        alarmList.map((v2, idx2) => {
                          if (idx === idx2) {
                            v2.check = !v2.check
                          }
                          return v2
                        })
                      )
                    }}
                  />
                </div>
              </div>
            )
          })}
        {empty && <NoResult />}
      </div>
    </div>
  )
}
