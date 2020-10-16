// 메인팝업 - 이벤트 - 추석
import React, {useEffect, useState, useContext} from 'react'
import Api from 'context/api'
import {Context} from 'context'
import {OS_TYPE} from 'context/config'
import Utility from 'components/lib/utility'
// style
import 'styles/layerpopup.scss'

export default function LayerPopupAppDownLogin(props) {
  const context = useContext(Context)

  const {appPopupState, setAppPopupState} = props
  const handleDimClick = () => {
    setAppPopupState(false)
    Utility.setCookie('AppPopup')
  }

  const [osCheck, setOsCheck] = useState(-1)
  const customHeader = JSON.parse(Api.customHeader)

  useEffect(() => {
    setOsCheck(navigator.userAgent.match(/Android/i) != null ? 1 : navigator.userAgent.match(/iPhone|iPad|iPod/i) != null ? 2 : 3)
  }, [])

  return (
    <>
      {setAppPopupState && (
        <div id="mainLayerPopup" onClick={handleDimClick}>
          <div className="appDownloadPopup">
            <button
              className="appDownloadPopup__closeButton"
              onClick={() => {
                context.action.updatePopupVisible(false)
              }}>
              닫기
            </button>

            <div className="appDownloadPopup__content">
              <div className="appDownloadPopup__monnImg"></div>

              <b>달빛라이브 어플을 설치해 보세요!</b>

              <p>
                달빛라이브 어플을 설치하시면
                <br />
                더욱 다양한 편의기능을 이용하실 수 있습니다.
              </p>
              {osCheck === OS_TYPE['Android'] ? (
                <button
                  className="androidIcon"
                  onClick={() => {
                    ;(window.location.href = 'https://play.google.com/store/apps/details?id=kr.co.inforexseoul.radioproject'),
                      context.action.updatePopupVisible(false)
                  }}>
                  달빛 라이브 어플 설치하기
                </button>
              ) : osCheck === OS_TYPE['IOS'] ? (
                <button
                  className="iosIcon"
                  onClick={() => {
                    ;(window.location.href =
                      'https://apps.apple.com/kr/app/%EB%8B%AC%EB%B9%9B-%EB%9D%BC%EC%9D%B4%EB%B8%8C-%EA%B0%9C%EC%9D%B8-%EB%9D%BC%EB%94%94%EC%98%A4-%EB%B0%A9%EC%86%A1-%EB%9D%BC%EC%9D%B4%EB%B8%8C-%EC%84%9C%EB%B9%84%EC%8A%A4/id1490208806'),
                      context.action.updatePopupVisible(false)
                  }}>
                  달빛 라이브 어플 설치하기
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
