import React, {useState, useEffect, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'
import {PAGE_TYPE} from './constant'
import API from 'context/api'

import Write from './content/write'
import './package.scss'

export default (props) => {
  const history = useHistory()

  const global_ctx = useContext(Context)
  // 페이징 체크
  const [viewType, setViewType] = useState(0)
  const [timeCheck, setTimeCheck] = useState(true)

  // 이벤트 10시간체크
  const [eventCheck, setEventCheck] = useState(0)

  const handleStatus = () => {
    if (global_ctx.token.isLogin !== true)
      global_ctx.action.alert({
        msg: '로그인을 해주세요',
        callback: () => {
          global_ctx.action.alert(history.push('/login'))
        }
      })
  }

  const writeCheck = () => {
    if (timeCheck === true) {
      setViewType(PAGE_TYPE.WRITE)
    } else if (timeCheck === false) {
      global_ctx.action.alert({
        msg: '방송시간 10시간을 채워주셔야합니다.',
        callback: () => {
          return
        }
      })
    }
  }

  const complete = () => {
    global_ctx.action.alert({
      msg: '이미 참여 하셨습니다.',
      callback: () => {
        return
      }
    })
  }

  const packageEventCheck = useCallback(async () => {
    const {result, data} = await API.eventPackageJoinCheck({})

    if (result === 'success') {
      setEventCheck(0)
    } else if (result === 'fail' || code === '1') {
      setEventCheck(1)
    } else {
      if (result === 'fail' || code === '2') {
        setTimeCheck(false)
      }
    }
  }, [])

  useEffect(() => {
    packageEventCheck()
  }, [])
  return (
    <Layout status="no_gnb">
      <div id="evnetPackage">
        {viewType === PAGE_TYPE.WRITE && <Write viewType={viewType} setViewType={setViewType} />}

        {viewType === PAGE_TYPE.MAIN && (
          <>
            <Header title="방송 장비지원 이벤트" />

            <div className="content">
              <img src="https://image.dalbitlive.com/event/package/20200831/content01.jpg" />
              <img src="https://image.dalbitlive.com/event/package/20200831/content02.jpg" />
              <img src="https://image.dalbitlive.com/event/package/20200831/content03.jpg" />
              <img src="https://image.dalbitlive.com/event/package/20200831/content04.jpg" />
              <img src="https://image.dalbitlive.com/event/package/20200831/content05.jpg" />

              {viewType === PAGE_TYPE.MAIN && global_ctx.token.isLogin === true ? (
                <>
                  {eventCheck === 0 ? (
                    <>
                      <button onClick={() => writeCheck()}>
                        <img src="https://image.dalbitlive.com/event/package/20200831/button.jpg" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => complete()}>
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
