// React
import React, {useCallback, useState} from 'react'

// Context

// Api
import Api from 'context/api'

// lib
import {convertDateFormat} from 'components/lib/dalbit_moment'

// Component
import NoResult from 'components/ui/noResult'

import './index.scss'
import {useDispatch} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const PushMembers = () => {
  const dispatch = useDispatch();

  const [pushMembers, setPushMembers] = useState(null)

  const fetchData = useCallback(async () => {
    const {result, data, message} = await Api.getPushMembers()

    if (result === 'success') {
      setPushMembers(data.list)
    } else {
      callToast(message)
    }
  }, [])

  const deleteMembers = useCallback(async (memNo) => {
    const {result, data, message} = await Api.deletePushMembers({
      memNo
    })
    if (result === 'success') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '삭제가 완료되었습니다.'
      }))
      fetchData()
    } else {
      callToast(message)
    }
  }, [])

  const callDeleteConfirm = useCallback((memNo) => {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: `선택한 회원을 삭제하면
      방송시작에 대한 알림을 받을 수 없습니다.`,
      remsg: '삭제하시겠습니까?',
      callback: () => {
        deleteMembers(memNo)
      }
    }))
  }, [])

  const callToast = useCallback((message) => {
    dispatch(setGlobalCtxMessage({
      type: "toast",
      msg: message
    }))
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="pushMembers">
      {pushMembers !== null && pushMembers.length > 0 && (
        <p className="pushMembers__caption">
          팬으로 등록하지 않고도 🔔 알림받기를 설정하여 선택한 회원의 방송시작 알림을 받을 수 있습니다.
        </p>
      )}

      <ul className="pushMembers__list">
        {pushMembers !== null && (
          <>
            {pushMembers.length > 0 ? (
              pushMembers.map((v, i) => {
                const {nickNm, profImg, regDt, memNo} = v
                return (
                  <li key={i} className="pushMembersItem">
                    <div className="pushMembersItem__profImg">
                      <img src={profImg.url} />
                    </div>
                    <div className="pushMembersItem__text">
                      <p className="pushMembersItem__nickNm">{nickNm}</p>
                      <p className="pushMembersItem__date">설정일 : {convertDateFormat(regDt, 'YYYY년 MM월 DD일')}</p>
                    </div>
                    <button
                      className="pushMembersItem__icon"
                      onClick={() => {
                        callDeleteConfirm(memNo)
                      }}>
                      <img src={'https://image.dallalive.com/svg/icon_wastebasket.svg'} alt="알림회원 삭제" />
                    </button>
                  </li>
                )
              })
            ) : (
              <NoResult />
            )}
          </>
        )}
      </ul>
    </div>
  )
}

export default PushMembers
