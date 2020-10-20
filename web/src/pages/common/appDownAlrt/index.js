import React, {useEffect, useContext, useState} from 'react'

//context
import Api from 'context/api'
import {Context} from 'context'
import {OS_TYPE} from 'context/config'

import './index.scss'

export default (props) => {
  const context = useContext(Context)
  const [osCheck, setOsCheck] = useState(-1)

  useEffect(() => {
    setOsCheck(navigator.userAgent.match(/Android/i) != null ? 1 : navigator.userAgent.match(/iPhone|iPad|iPod/i) != null ? 2 : 3)
  }, [])

  const pageName = context.popup_code[2]

  //---------------------------------------------------------------------
  return (
    <div className="appDownloadPopup">
      <div className="appDownloadPopup__content">
        <div className="appDownloadPopup__monnImg"></div>

        <b>
          {pageName == 1 ? (
            '방송방 생성 및 클립 등록을 '
          ) : pageName == 2 ? (
            '방송방 청취를 '
          ) : pageName == 3 ? (
            '클립 등록을 '
          ) : pageName == 4 ? (
            '클립 청취를 '
          ) : (
            <></>
          )}
          위해
          <br /> 달빛라이브 어플을 설치하신 후<br /> 이용해 주세요.
        </b>

        <p>
          달빛라이브 어플을 설치하시면
          <br />
          더욱 다양한 편의기능을
          <br />
          이용하실 수 있습니다.
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
  )
}
