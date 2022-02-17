// 메인팝업 - 이벤트 - 추석
import React, {useEffect, useState} from 'react'
import Api from 'context/api'
import {OS_TYPE} from 'context/config'
import Utility from 'components/lib/utility'
// style
import 'styles/layerpopup.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxVisible} from "redux/actions/globalCtx";

export default function LayerPopupAppDownLogin(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {appPopupState, setAppPopupState} = props
  const handleDimClick = () => {
    setAppPopupState(false)
    Utility.setCookie('AppPopup', true, 9999)
  }

  const [osCheck, setOsCheck] = useState(-1)
  const customHeader = JSON.parse(Api.customHeader)
  const AppDwonUrl = 'https://inforexseoul.page.link/Ws4t'

  useEffect(() => {
    setOsCheck(navigator.userAgent.match(/Android/i) != null ? 1 : navigator.userAgent.match(/iPhone|iPad|iPod/i) != null ? 2 : 3)
  }, [])

  const appCheckDwon = () => {
    window.location.href = 'https://inforexseoul.page.link/Ws4t'
  }

  const iosbutton = () => {
    var userAgent = navigator.userAgent
    var visitedAt = new Date().getTime()

    if (userAgent.match(/iPhone|iPad|iPod/)) {
      setTimeout(function () {
        if (new Date().getTime() - visitedAt < 2000) {
          location.href = 'https://itunes.apple.com/app/id1490208806'
        }
      }, 500)

      setTimeout(function () {
        location.href = 'https://inforexseoul.page.link/Ws4t'
      }, 0)
    }
  }

  return (
    <>
      {setAppPopupState && (
        <div id="mainLayerPopup" onClick={handleDimClick}>
          <div className="appDownloadPopup">
            <button
              className="appDownloadPopup__closeButton"
              onClick={() => {
                dispatch(setGlobalCtxVisible(false))
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
                    appCheckDwon()
                    dispatch(setGlobalCtxVisible(false))
                  }}>
                  달빛 라이브 어플 설치하기
                </button>
              ) : osCheck === OS_TYPE['IOS'] ? (
                <button
                  className="iosIcon"
                  onClick={() => {
                    iosbutton()
                    dispatch(setGlobalCtxVisible(false))
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
