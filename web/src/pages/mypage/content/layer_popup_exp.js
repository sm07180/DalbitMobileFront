import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'
// static
import CloseBtn from '../static/ic_close.svg'
import PlusIcon from '../static/ic_plus.svg'
// context
import {COLOR_MAIN, COLOR_WHITE} from 'context/color'
import {WIDTH_MOBILE_S} from 'context/config'

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

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'main-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  const data = [
    {tit: '방송하기', exp: '5', msg: '방송 10분당 5exp 획득 (하루 최대 120exp)'},
    {tit: '방송청취', exp: '1', msg: '청취 10분당 1exp 획득 (하루 최대 24exp)'},
    {tit: '보낸 선물', exp: '1', msg: '달 1개당 1exp 획득 (방송방 내 / 제한 없음)'},
    {tit: '받은 선물', exp: '1', msg: '별 1개당 1exp 획득 (제한 없음)'},
    {tit: '부스터 사용', exp: '10', msg: '사용자, DJ 각각 10exp 획득 (제한 없음)'},
    {tit: '좋아요', exp: '1', msg: '좋아요 1회당 1exp 획득 (하루 최대 10exp)'},
    {tit: '팬보드 작성', exp: '1', msg: '팬보드, 답글 작성 시 1exp 획득 (하루 최대 10exp)'}
  ]

  return (
    <PopupWrap id="main-layer-popup" ref={layerWrapRef} onClick={wrapClick} onTouchStart={wrapTouch} onTouchMove={wrapTouch}>
      <div className="content-wrap content-exp">
        <div className="title-wrap">
          <h3 className="h3-tit">경험치(exp)획득 방법</h3>
          <img src={CloseBtn} className="close-btn" onClick={() => closePopup()} />
        </div>
        <div className="contents-box">
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
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;
  .content-wrap {
    width: calc(100% - 32px);
    max-width: 578px;
    border-radius: 12px;
    background-color: ${COLOR_WHITE};
    text-align: center;
    .title-wrap {
      position: relative;
      border-bottom: 1px solid #e0e0e0;
      .h3-tit {
        padding: 13px 13px;
        font-weight: 600;
        font-size: 16px;
      }
      .close-btn {
        position: absolute;
        top: 6px;
        right: 7px;
      }
    }
    .contents-box {
      padding: 13px 17px 35px;
      li {
        padding-top: 16px;
        &:first-child {
          padding-top: 0;
        }
        .ico-box {
          display: flex;
          justify-content: center;
          align-content: center;
          align-items: flex-start;
          span {
            display: block;
            width: 50%;
            padding: 0 5px;
            em {
              display: inline-block;
              min-width: 94px;
              min-height: 28px;
              padding: 6px 8px 4px;
              text-align: center;
              border-radius: 10px;
              font-size: 14px;
              line-height: 1.2;
              font-weight: 600;
              font-style: normal;
            }
            &.txt {
              text-align: right;
              em {
                color: ${COLOR_MAIN};
                background: #f5f5f5;
              }
            }
            &.num {
              text-align: left;
              em {
                padding-top: 4px;
                color: ${COLOR_WHITE};
                background: #ffa72e;
                border: 1px solid #ffa72e;
                &::before {
                  display: inline-block;
                  content: '';
                  position: relative;
                  top: 2px;
                  margin-right: 2px;
                  width: 14px;
                  height: 14px;
                  background: url('${PlusIcon}') no-repeat 0 0;
                }
              }
            }
          }
        }
        .msg {
          display: block;
          padding-top: 8px;
          font-size: 12px;
          color: #424242;
          font-style: normal;
          font-weight: 600;
        }
      }
    }
  }
  @media (max-width: ${WIDTH_MOBILE_S}) {
    .content-wrap {
      height: 88%;
    }
    .contents-box {
      height: 88%;
      overflow-y: auto;
      ul {
        height: 100%;
      }
    }
  }
`
