import React, {useContext, useEffect, useState} from 'react'
import {Context} from 'context'
import Api from 'context/api'
import {OS_TYPE} from 'context/config'

import {useHistory} from 'react-router-dom'

import BackBtn from './static/ic_back.svg'
import {Hybrid} from 'context/hybrid'
import './index.scss'
export default function Service() {
  const context = useContext(Context)
  const hisotry = useHistory()
  const customerHeader = JSON.parse(Api.customHeader)
  const [versionShow, setVersionShow] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentVersion, setCurrentVersion] = useState(false)
  const osTypeConvertToText = () => {
    if (customerHeader.os === OS_TYPE['Android']) {
      return <span className="serviceWrap__user--point">구글Play스토어</span>
    } else if (customerHeader.os === OS_TYPE['IOS']) {
      return <span className="serviceWrap__user--point">애플App스토어</span>
    } else {
      return <span className="serviceWrap__user--point">모바일웹</span>
    }
  }

  const makeCallBtn = (callNum) => {
    if (customerHeader.os === OS_TYPE['Android']) {
      return (
        // <></>
        <button
          onClick={() => {
            Hybrid('openCall', `tel:${callNum}`)
          }}>
          전화걸기
        </button>
      )
    } else if (customerHeader.os === OS_TYPE['IOS']) {
      return (
        <button
          onClick={() => {
            Hybrid('openUrl', `tel:${callNum}`)
          }}>
          전화걸기
        </button>
      )
    } else {
      return (
        <button
          onClick={() => {
            window.location.href = `tel:${callNum}`
          }}>
          전화걸기
        </button>
      )
    }
  }

  const updateApp = () => {
    if (customerHeader.os === OS_TYPE['Android']) {
      Hybrid('openUrl', 'https://play.google.com/store/apps/details?id=kr.co.inforexseoul.radioproject')
    } else if (customerHeader.os === OS_TYPE['IOS']) {
      Hybrid(
        'openUrl',
        'https://apps.apple.com/kr/app/%EB%8B%AC%EB%B9%9B-%EB%9D%BC%EC%9D%B4%EB%B8%8C-%EA%B0%9C%EC%9D%B8-%EB%9D%BC%EB%94%94%EC%98%A4-%EB%B0%A9%EC%86%A1-%EB%9D%BC%EC%9D%B4%EB%B8%8C-%EC%84%9C%EB%B9%84%EC%8A%A4/id1490208806'
      )
    }
  }

  useEffect(() => {
    async function fetchData() {
      const {data} = await Api.splash()

      setIsUpdate(data.isUpdate)
      setCurrentVersion(data.version)
    }
    if (customerHeader.os === OS_TYPE['Android']) {
      setVersionShow(true)
    } else if (customerHeader.os === OS_TYPE['IOS']) {
      setVersionShow(true)
    } else {
      setVersionShow(false)
    }

    fetchData()
  }, [])
  return (
    <div id="serviceWrap">
      <div className="serviceWrap__header">
        <img src={BackBtn} className="serviceWrap__header--button" onClick={() => hisotry.goBack()}></img>
        <h3 className="serviceWrap__header--title">고객센터</h3>
      </div>
      <div className="serviceWrap__contents">
        <div className="serviceWrap__contents--tip">
          달빛 라이브에 대한 궁금한 사항이나 장애 등은
          <br />
          고객센터 전화문의 또는 1:1문의로 접수해주세요.
          <br />
          빠른 시간내에 처리하여 답변 드리겠습니다.
        </div>
        <div className="serviceWrap__user">
          <div className="serviceWrap__user--os">회원님은 {osTypeConvertToText()} 사용자입니다.</div>
          {versionShow && (
            <div className="serviceWrap__user--version">
              {isUpdate === true ? (
                <>
                  <div>현재 앱버전은 최신 버전이 아닙니다.</div>
                  <div className="serviceWrap__user--version--gray">
                    <span>현재 앱버젼 : {currentVersion}</span>
                    <button onClick={updateApp}>업데이트</button>
                  </div>
                </>
              ) : (
                <>
                  <div>현재 앱버전은 최신 버전입니다.</div>
                  <div className="serviceWrap__user--version--gray">현재 앱버젼 : {currentVersion}</div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="serviceWrap__caption">
          <div className="serviceWrap__caption--wait">잠깐!!</div>
          <div className="serviceWrap__caption--question">
            문의 전 궁금하신 사항을{' '}
            <span className="serviceWrap__caption--question--point" onClick={() => (window.location.href = '/customer/faq')}>
              [FAQ]
            </span>
            에서 확인해 보시겠습니까?
          </div>
          <div className="serviceWrap__caption--box">
            <span>
              <span>고객센터 (국내)</span> <span className="bold">1522-0251</span> {makeCallBtn('1522-0251')}
            </span>
            <span>
              <span>고객센터 (해외)</span> <span className="bold">+82-1522-0251</span> {makeCallBtn('+82-1522-0251')}
            </span>
            <span className="gray">(상담시간 : 평일 09:30 ~ 17:30 토/일/공휴일 제외)</span>
          </div>
        </div>
        <div className="serviceWrap__personal">
          <button className="serviceWrap__personal--button" onClick={() => (window.location.href = '/customer/personal')}>
            1:1 문의하기
          </button>
        </div>
        <div className="serviceWrap__policy">
          <span
            onClick={() => {
              window.location.href = '/customer/appInfo/service'
            }}>
            이용약관
          </span>
          <span> | </span>
          <span
            onClick={() => {
              window.location.href = '/customer/appInfo/privacy'
            }}>
            개인정보
          </span>
          <span> | </span>
          <span
            onClick={() => {
              window.location.href = '/customer/appInfo/youthProtect'
            }}>
            청소년보호
          </span>
          <span> | </span>
          <span
            onClick={() => {
              window.location.href = '/customer/appInfo/operating'
            }}>
            운영정책
          </span>
        </div>
      </div>
    </div>
  )
}
