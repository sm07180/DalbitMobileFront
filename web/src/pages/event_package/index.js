import React, {useCallback, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'
import {PAGE_TYPE} from './constant'
import API from 'context/api'

import Write from './content/write'
import './package.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  // 페이징 체크
  const [viewType, setViewType] = useState(0)
  const [timeCheck, setTimeCheck] = useState(true)
  const [alertMessage, setAlertMessage] = useState('')
  const [time, setTime] = useState('')
  const [code, setCode] = useState('')

  // 이벤트 10시간체크
  const [eventCheck, setEventCheck] = useState(0)

  const handleStatus = () => {
    if (globalState.token.isLogin !== true)
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push({
            pathname: '/login',
            state: {
              state: 'event_package'
            }
          })
        }
      }))
  }

  const writeCheck = () => {
    if (timeCheck === true) {
      setViewType(PAGE_TYPE.WRITE)
    } else if (code === '1') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: alertMessage,
        callback: () => {
          return
        }
      }))
    } else if (code === '2') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: `${alertMessage}\n (누적 방송 시간 : ${time.airHour}시간)`,
        callback: () => {
          return
        }
      }))
    }
  }

  const packageEventCheck = useCallback(async () => {
    const {result, data, message, code} = await API.eventPackageJoinCheck({})

    if (result === 'success') {
      setEventCheck(0)
    } else {
      setTimeCheck(false)
      setAlertMessage(message)
      setTime(data)
      setCode(code)
    }
  }, [globalState])

  useEffect(() => {
    packageEventCheck()
  }, [viewType, globalState.token.isLogin])

  return (
    <Layout status="no_gnb">
      <div id="evnetPackage">
        {viewType === PAGE_TYPE.WRITE && <Write viewType={viewType} setViewType={setViewType} />}

        {viewType === PAGE_TYPE.MAIN && (
          <>
            <Header title="방송 장비지원 이벤트" />

            <div className="content">
              <img src="https://image.dalbitlive.com/event/package/20200904/new_img01.jpg" />
              <img src="https://image.dalbitlive.com/event/package/20200904/new_img02.jpg" />
              <img src="https://image.dalbitlive.com/event/package/20200904/new_img03.jpg" />
              <img src="https://image.dalbitlive.com/event/package/20200904/new_img04.jpg" />
              <img src="https://image.dalbitlive.com/event/package/20200904/new_img05.jpg" />

              {viewType === PAGE_TYPE.MAIN && globalState.token.isLogin === true ? (
                <>
                  {(viewType === PAGE_TYPE.MAIN && code === '1') || code === '2' ? (
                    <>
                      <button onClick={() => writeCheck()}>
                        <img src="https://image.dalbitlive.com/event/package/20200831/button_off.jpg"/>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => writeCheck()}>
                        <img src="https://image.dalbitlive.com/event/package/20200831/button.jpg" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <button onClick={() => handleStatus()}>
                  <img src="https://image.dalbitlive.com/event/package/20200831/button_off.jpg" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
