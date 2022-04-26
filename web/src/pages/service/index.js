import React, {useContext, useEffect, useState} from 'react'
import {OS_TYPE} from 'context/config'
import {useHistory} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'
import Api from 'context/api'
import Layout from 'pages/common/layout'

import Header from 'components/ui/new_header'
import './index.scss'

export default function Service() {
  const hisotry = useHistory()
  const customHeader = JSON.parse(Api.customHeader)
  const [versionShow, setVersionShow] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentVersion, setCurrentVersion] = useState(false)
  const [storeUrl, setStoreUrl] = useState('')
  const osTypeConvertToText = () => {
    if (customHeader.os === OS_TYPE['Android']) {
      return <span className="serviceWrap__user--point">구글Play스토어</span>
    } else if (customHeader.os === OS_TYPE['IOS']) {
      return <span className="serviceWrap__user--point">애플App스토어</span>
    } else {
      return <span className="serviceWrap__user--point">모바일웹</span>
    }
  }

  const makeCallBtn = (callNum) => {
    if (customHeader.os === OS_TYPE['Android']) {
      return (
        // <></>
        <button
          onClick={() => {
            Hybrid('openCall', `tel:${callNum}`)
          }}>
          전화걸기
        </button>
      )
    } else if (customHeader.os === OS_TYPE['IOS']) {
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
    if (customHeader.os === OS_TYPE['Android']) {
      if (__NODE_ENV === 'dev' || customHeader.appBuild >= 48) {
        Hybrid('goToPlayStore')
      } else {
        Hybrid('openUrl', storeUrl)
      }
    } else if (customHeader.os === OS_TYPE['IOS']) {
      Hybrid(
        'openUrl',
        storeUrl
        // 'https://apps.apple.com/kr/app/%EB%8B%AC%EB%B9%9B-%EB%9D%BC%EC%9D%B4%EB%B8%8C-%EA%B0%9C%EC%9D%B8-%EB%9D%BC%EB%94%94%EC%98%A4-%EB%B0%A9%EC%86%A1-%EB%9D%BC%EC%9D%B4%EB%B8%8C-%EC%84%9C%EB%B9%84%EC%8A%A4/id1490208806'
      )
    }
  }

  useEffect(() => {
    async function fetchData() {
      const {data} = await Api.verisionCheck()

      setIsUpdate(data.isUpdate)
      setCurrentVersion(data.nowVersion)
      setStoreUrl(data.storeUrl)
    }
    if (customHeader.os === OS_TYPE['Android']) {
      setVersionShow(true)
    } else if (customHeader.os === OS_TYPE['IOS']) {
      setVersionShow(true)
    } else {
      setVersionShow(false)
    }

    fetchData()
  }, [])
  return (
    <Layout status="no_gnb">
      <div id="serviceWrap">
        <Header title="고객센터" />
        <div className="serviceWrap__contents">
          <div className="serviceWrap__contents--tip">
            달라에 대한 궁금한 사항이나 장애 등은
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
              <span className="gray">(상담시간 : 평일 10:00 ~ 18:00 토/일/공휴일 제외)</span>
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
    </Layout>
  )
}
