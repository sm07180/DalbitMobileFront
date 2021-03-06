import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'


import {IMG_SERVER} from 'context/config'

//components
import RandomBoxPop from './reward_randombox_pop'

//static
import CloseBtn from '../static/ic_close.svg'
import {DATE_TYPE, RANK_TYPE} from '../constant'
import {useDispatch, useSelector} from "react-redux";
import {setRankMyInfo} from "redux/actions/rank";

export default (props) => {
  const dispatch = useDispatch();
  const rankState = useSelector(({rankCtx}) => rankCtx);

  const {formState, myInfo} = rankState


  const {setPopup, rewardPop, setRewardPop} = props
  const [randomPopup, setRandomPopup] = useState(false)
  const closePopup = () => {
    setPopup(false)
    dispatch(setRankMyInfo({
      ...myInfo,
      isReward: false
    }))
  }

  const openRandomPopup = () => {
    setRandomPopup(true)
  }

  const popStateEvent = (e) => {
    if (e.state === null) {
      setRandomPopup(false)
    } else if (e.state === 'layer') {
      setRandomPopup(true)
    }
  }

  useEffect(() => {
    if (randomPopup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/rank/#layer')
      }
    } else if (!randomPopup) {
      if (window.location.hash === '#layer') {
        window.history.back()
      }
    }
  }, [randomPopup])

  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)

    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <PopupWrap>
      <div className="content-wrap">
        <button onClick={() => closePopup()} className="btn-close">
          <img src={CloseBtn} />
        </button>
        <div className="title-box">
          {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
            <p className="title">
              {formState[formState.pageType].dateType === DATE_TYPE.DAY ? '??????' : '??????'} ????????? ?????? {rewardPop.rank}???
            </p>
          ) : (
            <p className="title">{rewardPop.text}??? ???????????????.</p>
          )}

          <p className="sub-title">
            <img src={`${IMG_SERVER}/ranking/reward_pop_character3@2x.png`} width={41} height={26} /> ???????????????
          </p>
        </div>

        <div className="reward-content">
          {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
            <>
              <div className="reward-like-box">
                {formState[formState.pageType].dateType === DATE_TYPE.DAY ? (
                  <div className="reward">
                    <span>??????</span>
                    <label className="badge-label">
                      <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> ??? {rewardPop.rewardDal}
                    </label>
                  </div>
                ) : (
                  <div className="reward-badge">
                    <label className="badge-label">
                      {' '}
                      <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={28} height={28} /> ??? {rewardPop.rewardDal}
                    </label>{' '}
                    <div className="top-badge-box">
                      <span className="top-badge-title">TOP ??????</span>{' '}
                      <label
                        className="badge-label right"
                        style={{
                          background: `linear-gradient(to right, ${rewardPop.startColor}, ${rewardPop.endColor}`
                        }}>
                        <img src={rewardPop.icon} width={28} height={28} />
                        <span>{rewardPop.text}</span>
                      </label>
                    </div>
                  </div>
                )}

                <p className="notice">
                  ?????? ????????? <span>??????????????? &gt; ??? ??????</span>??????
                  <br />
                  ???????????? ??? ????????????.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="title">{rewardPop.text} ??????</p>

              <div>
                <div className="top-badge-box">
                  <span className="top-badge-title">TOP ??????</span>{' '}
                  <label
                    className="badge-label right"
                    style={{
                      background: `linear-gradient(to right, ${rewardPop.startColor}, ${rewardPop.endColor}`
                    }}>
                    <img src={rewardPop.icon} width={42} height={26} />
                    <span>{rewardPop.text}</span>
                  </label>
                </div>
                <div className="bottom-badge-box">
                  <label className="badge-label">
                    {' '}
                    <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> ??? {rewardPop.rewardDal}
                  </label>{' '}
                  <label className="badge-label right">
                    <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={28} height={28} /> ????????? ?????? ??????
                  </label>
                  {/* {myInfo.rewardPoint !== '' ? (
                    <label className="badge-label center">?????? ?????????DJ ?????? ??? ????????? {myInfo.rewardPoint}??? ??????</label>
                  ) : (
                    ''
                  )} */}
                </div>
              </div>
            </>
          )}
        </div>
        {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
          <button onClick={() => closePopup()} className="btn-random-box">
            ??????
          </button>
        ) : (
          <button onClick={() => openRandomPopup()} className="btn-random-box">
            ????????? ?????? ?????? ??????
          </button>
        )}

        {formState[formState.pageType].rankType !== RANK_TYPE.LIKE ? (
          <ul className="notice-box">
            <li>* ?????? ????????? ?????? ?????? ??????????????????.</li>
            <li>* ????????? ?????? ?????? ????????? ????????? ???????????? ????????? ??????????????????.</li>
            {/* <li>* ????????? ?????? ????????? ?????? 50 EXP ~ ?????? 500 EXP?????? ??????????? ?????? ??? ????????????.</li> */}
          </ul>
        ) : (
          <>
            {formState[formState.pageType].dateType === 1 ? (
              ''
            ) : (
              <ul className="notice-box">
                <li>* ?????? ????????? ?????? ?????? ??????????????????.</li>
              </ul>
            )}
          </>
        )}
      </div>
      {randomPopup && <RandomBoxPop setRandomPopup={setRandomPopup} setPopup={setPopup} />}
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

  img {
    vertical-align: middle;
  }

  .content-wrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 328px;
    padding: 50px 16px;
    border-radius: 16px;
    background-color: #fff;

    .btn-close {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    .title-box {
      margin-bottom: 20px;
      text-align: center;
      font-weight: 700;

      .title {
        font-size: 14px;
        line-height: 22px;
      }

      .sub-title {
        font-size: 24px;
        line-height: 27px;
      }
    }

    .reward-content {
      position: relative;
      margin-bottom: 25px;
      padding: 18px 19px 12px 19px;
      border-radius: 20px;
      border: 1px solid #FF3C7B;

      .title {
        display: inline-block;
        position: absolute;
        width: 58%;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 11px;
        color: #FF3C7B;
        text-align: center;
        font-size: 14px;
        background-color: #fff;
        text-align: center;
      }

      .top-badge-box {
        display: flex;
        justify-content: space-between;
        padding: 3px;
        height: 34px;
        border-radius: 20px;
        border: 1px dotted #e8e8e8;

        .top-badge-title {
          width: 38%;
          font-size: 12px;
          line-height: 27px;
          letter-spacing: -0.3px;
          color: #424242;
          text-align: center;
        }

        .badge-label {
          display: inline-block;
          width: 60%;
          border-radius: 18px;
          color: #fff;
          font-size: 12px;
          letter-spacing: -0.6px;
          line-height: 27px;
          text-align: center;
          font-weight: 700;
        }
      }

      .bottom-badge-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 6px;

        .badge-label {
          display: inline-block;
          width: 38%;
          height: 34px;
          border-radius: 18px;
          background-color: #efefef;
          color: #424242;
          font-size: 12px;
          letter-spacing: -0.6px;
          line-height: 34px;
          text-align: center;
          font-weight: 700;

          &.right {
            width: 60%;
          }

          &.center {
            margin-top: 6px;
            width: 100%;
          }
        }
      }

      .reward-like-box {
        .reward {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 14px;

          span {
            font-size: 18px;
            font-weight: bold;
            color: #FF3C7B;
          }

          label {
            margin-left: 8px;
            display: inline-block;
            width: 96px;
            height: 34px;
            border-radius: 18px;
            background-color: #efefef;
            color: #424242;
            font-size: 16px;
            letter-spacing: -0.6px;
            line-height: 34px;
            text-align: center;
            font-weight: 700;
          }
        }

        .reward-badge {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          justify-content: space-between;
          height: 34px;
          padding: 3px;

          & > .badge-label {
            display: flex;
            align-items: center;
            width: 34%;
            padding: 3px;
            margin-right: 4px;
            background-color: #efefef;
            border-radius: 20px;
            font-size: 12px;
            color: black;
          }

          & > .top-badge-box {
            width: 73%;
          }
        }

        .notice {
          font-size: 12px;
          color: #616161;
          line-height: 16px;
          text-align: center;

          span {
            text-decoration: underline;
          }
        }
      }
    }

    .btn-random-box {
      width: 100%;
      height: 44px;
      border-radius: 12px;
      background-color: #FF3C7B;
      letter-spacing: -0.4px;
      color: #ffffff;
      font-weight: 700;
    }

    .notice-box {
      margin-top: 12px;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: -0.18px;
      color: #757575;
    }
  }
`
