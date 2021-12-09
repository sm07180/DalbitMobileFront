import React, {useState, useEffect, useContext, useCallback} from 'react'
import {Context} from 'context/index.js'
import Api from 'context/api'

import './search.scss'

export default (props) => {
  const context = useContext(Context)
  const {gganbuNo, memberNo} = props

  const [acceptType, setAcceptType] = useState('') //acceptance, application
  const [alertAccept, setAlertAccept] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closeAlert = () => {
    setAlertAccept(false)
  }

  const fetchGganbuSubList = async () => {
    const param = {
      insSlct: tabBtn,
      gganbuNo: gganbuNo
    }
    const {data, message} = await Api.postGganbuList(param)
    if (message === 'SUCCESS') {
      setGganbuSubList(data.list)
    } else {
      console.log(message)
    }
  }

  // 깐부 신청
  const postGganbuSub = async () => {
    const param = {
      gganbuNo: gganbuNo,
      ptrMemNo: memberNo // 대상자
    }
    const {data, message} = await Api.postGganbuSub(param)
    if (data === 1) {
      context.action.alert({
        msg: '신청 완료',
        callback: () => {
          closeAlert()
          searchStateCheck()
        }
      })
    } else {
      context.action.alert({
        msg: message,
        callback: () => {
          closeAlert()
          searchStateCheck()
        }
      })
    }
  }

  // 깐부 수락 버튼
  const postGganbuIns = async (memNo, memNick) => {
    const param = {
      gganbuNo: gganbuNo,
      memNo: memNo
    }
    const {data, message} = await Api.postGganbuIns(param)
    if (data === 1) {
      context.action.alert({
        msg: `${memNick}님과<br/>깐부를 맺었습니다.`,
        callback: () => {
          closeAlert()
        }
      })
    } else {
      console.log(message)
    }
  }

  useEffect(() => {
    fetchGganbuSubList()
  }, [tabBtn])

  // 신청 => 동의서, 실패
  const Accept = () => {
    return (
      <div className="alert">
        <div className="contentWrap">
          <h1 className="title">동의서</h1>
          {acceptType === 'application' ? (
            <>
              <div className="textWrap">
                <h2>제 1 항</h2>
                <p>
                  깐부는 최대 두 명에게 신청
                  <br />
                  가능하며 신청 후에 취소할 수 있습니다.
                </p>
                <h2>제 2 항</h2>
                <p>
                  상대가 수락 시 이번 회차에서 맺은 깐부는
                  <br />
                  중도 해체할 수 없습니다.
                </p>
                <h2>제 3 항</h2>
                <p>
                  평균 레벨이 낮을수록 구슬 주머니에서
                  <br />
                  좋은 점수를 얻을 수 있습니다.
                </p>
                <p>
                  <strong>정말 신청하시겠습니까?</strong>
                </p>
              </div>
              <div className="buttonWrap">
                <button onClick={closeAlert}>취소</button>
                <button onClick={() => postGganbuSub()}>신청</button>
              </div>
            </>
          ) : (
            <>
              <div className="textWrap">
                <h2>제 1 항</h2>
                <p>
                  이번 회차에서 맺은 깐부는
                  <br />
                  중도 해체할 수 없습니다.
                </p>
                <h2>제 2 항</h2>
                <p>
                  평균 레벨이 낮을수록 구슬 주머니에서
                  <br />
                  좋은 점수를 얻을 수 있습니다.
                </p>
                <p>
                  <strong>정말 깐부를 맺으시겠습니까?</strong>
                </p>
              </div>
              <div className="buttonWrap">
                <button onClick={closeAlert}>취소</button>
                <button onClick={() => postGganbuIns(memberNo, mem_nick)}>수락</button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // 수락 => 동의서, 실패
  const Accept = (props) => {
    return (
      <div className="alert">
        <div className="contentWrap">
          <h1 className="title">동의서</h1>
        </div>
      </div>
    )
  }
  const acceptBtn = (memNo, mem_nick) => {
    setAlertAccept(true)
    setMemberNo(memNo)
    return <Accept mem_nick={mem_nick} />
  }

  return (
    <div className="alert">
      <div className="contentWrap">
        <h1 className="title">동의서</h1>
        <div className="textWrap">
          <h2>제 1 항</h2>
          <p>
            이번 회차에서 맺은 깐부는
            <br />
            중도 해체할 수 없습니다.
          </p>
          <h2>제 2 항</h2>
          <p>
            평균 레벨이 낮을수록 구슬 주머니에서
            <br />
            좋은 점수를 얻을 수 있습니다.
          </p>
          <p>
            <strong>정말 깐부를 맺으시겠습니까?</strong>
          </p>
        </div>
        <div className="buttonWrap">
          <button onClick={closeAlert}>취소</button>
          <button onClick={() => postGganbuIns(memberNo, mem_nick)}>수락</button>
        </div>
      </div>
    </div>
  )
}
