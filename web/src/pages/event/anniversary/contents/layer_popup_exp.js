import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'
// static
import CloseBtn from '../../../menu/static/close_w_l.svg'
import 'styles/layerpopup.scss'

export default (props) => {
  const {setPopupExp} = props

  // reference
  const layerWrapRef = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const layerWrapNode = layerWrapRef.current
    layerWrapNode.style.touchAction = 'none'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupExp(false)
  }

  const data = [
    {tit: '교환하기', exp: '1', msg: '별 → 달 교환 1달당 1exp 획득 (제한없음)'},
    {tit: '방송하기', exp: '5', msg: '방송 10분당 5exp 획득 (하루 최대 120exp)'},
    {tit: '방송청취', exp: '1', msg: '청취 10분당 1exp 획득 (하루 최대 24exp)'},
    {tit: '보낸 선물', exp: '1', msg: '달 1개당 1exp 획득 (방송방, 클립, 메시지 / 제한 없음)'},
    {tit: '받은 선물', exp: '1', msg: '별 1개당 1exp 획득 (방송방, 클립, 메시지 / 제한 없음)'},
    {tit: '부스터 사용', exp: '10', msg: '사용자, DJ 각각 10exp 획득 (제한 없음)'},
    {tit: '좋아요', exp: '1', msg: '좋아요 1회당 1exp 획득 (하루 최대 10exp)'},
    {tit: '팬보드 작성', exp: '1', msg: '팬보드, 답글 작성 시 1exp 획득 (하루 최대 10exp)'}
  ]

  return (
    <LayerPopup>
      <div id="mainLayerPopup" ref={layerWrapRef} onClick={closePopup}>
        <div className="popup popup-exp">
          <div className="popup__wrap">
            <div className="popbox active">
              <div className="popup__box popup__text">
                <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                  <div className="popup__title">
                    <h3 className="h3-tit">레벨 올리는 방법 알아보기</h3>
                    <button className="close-btn" onClick={() => closePopup()}>
                      <img src={CloseBtn} alt="닫기" />
                    </button>
                  </div>
                  <div className="inner">
                    <div className="scroll__wrap">
                      <ul>
                        {data.map((data, index) => {
                          return (
                            <li key={index}>
                              <div className="ico-box">
                                <span className="txt">
                                  <em>
                                    {data.tit.split('\n').map((line, index) => {
                                      if (data.tit.match('\n')) {
                                        return (
                                          <React.Fragment key={index}>
                                            {line}
                                            <br />
                                          </React.Fragment>
                                        )
                                      } else {
                                        return <React.Fragment key={index}>{data.tit}</React.Fragment>
                                      }
                                    })}
                                  </em>
                                </span>
                                <span className="num">
                                  <em>Exp {data.exp}</em>
                                </span>
                              </div>
                              <em className="msg">
                                {data.msg.split('\n').map((line, index) => {
                                  if (data.msg.match('\n')) {
                                    return (
                                      <React.Fragment key={index}>
                                        {line}
                                        <br />
                                      </React.Fragment>
                                    )
                                  } else {
                                    return <React.Fragment key={index}>{data.msg}</React.Fragment>
                                  }
                                })}
                              </em>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayerPopup>
  )
}

const LayerPopup = styled.div`
  .popup-exp {
    width: 330px !important;
  }
  .txt > em {
    color: #3a36ff !important;
    background: #eae9ff !important;
  }
`
