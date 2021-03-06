import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

//globalCtx
import Api from 'context/api'

//component
import './index.scss'
import LayerDetail from './content/layer_detail'
import LayerGift from './content/layer_gift'
import LayerWinner from './content/layer_winner'
import List from './content/list'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function VideoOpenEvent() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const [eventType, setEventType] = useState(1) // star, fan
  const [popupType, setPopupType] = useState(0) // star, fan
  // const [eventRound, setEventRound] = useState(0);
  const [videoRankList, setVideoRankList] = useState([
    {
      profImg: {
        thumb120x120: ''
      }
    }
  ])
  const [videoRankInfo, setVideoRankInfo] = useState({
    diffPoint: 0,
    myPoint: 0,
    myRank: 0,
    opRank: 0,
    detailDesc: '',
    giftDesc: ''
  })
  const [videoWinnerInfo, setVideoWinnerInfo] = useState([])
  const [layerDetail, setLayerDetail] = useState(false)
  const [layerGift, setLayerGift] = useState(false)
  const [layerWinner, setLayerWinner] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const clickCloseBtn = () => {
    return history.goBack()
  }

  const switchType = (type) => {
    setEventType(type)
  }

  async function fetchInitData() {
    const {result, data} = await Api.getVideoOpenEvent({
      slctType: eventType,
      eventNo: 2
    })

    if (result === 'success') {
      setVideoRankList(data.list)
      setVideoRankInfo({
        diffPoint: data.diffPoint,
        myPoint: data.myPoint,
        myRank: data.myRank,
        opRank: data.opRank,
        detailDesc: data.detailDesc,
        giftDesc: data.giftDesc
      })
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
  }

  async function fetchInitBestData() {
    const {result, data} = await Api.getVideoOpenBest({
      slctType: popupType,
      eventNo: 2
    })

    if (result === 'success') {
      setVideoWinnerInfo(data.list)
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
  }
  const refreshList = () => {
    fetchInitData()
    setRefresh(true)

    setTimeout(() => {
      setRefresh(false)
    }, 360)
  }

  useEffect(() => {
    fetchInitData()
  }, [eventType])

  useEffect(() => {
    if (popupType !== 0) fetchInitBestData()
  }, [popupType])

  return (
    <div>
      <div id="event_page_2nd">
        <div className="event_main_wrap">
          <img
            src="https://image.dalbitlive.com/event/video_open/20210217/top_visual@3x.png"
            alt="????????? ????????? ???????????? STAR &amp; FAN ???????????????"
          />
          <button className="btnBack" onClick={() => clickCloseBtn()}>
            <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
          </button>
        </div>
        <div className="tab_box">
          <button className="tab" onClick={() => switchType(1)}>
            <img
              src={`https://image.dalbitlive.com/event/video_open/20210217/tab_star${eventType === 1 ? '_focus' : ''}@3x.png`}
            />
          </button>
          <button className="tab" onClick={() => switchType(2)}>
            <img
              src={`https://image.dalbitlive.com/event/video_open/20210217/tab_fan${eventType === 2 ? '_focus' : ''}@3x.png`}
            />
          </button>
        </div>

        <div className="event_content_wrap">
          {/* Star Event Section */}
          {eventType === 1 && (
            <div className="stage_wrap">
              <img
                src="https://image.dalbitlive.com/event/video_open/20210217/event_star_img@3x.png"
                alt="???????????? ?????? ???????????? 30?????? ????????? ????????????."
              />
              <div className="btn_wrap">
                <div className="btnWrap">
                  <h3>
                    ?????? DJ??? ?????? <span>?????? ??????</span>
                  </h3>
                  <p>
                    <span>??????!</span> ?????? ????????? ?????? ?????? ?????? DJ?????????
                    <br />
                    ????????? <span>1,000???</span>??? ??? ????????????!
                  </p>

                  <p className="memo">
                    ??? ?????? ?????? DJ??? ????????? ?????? ??? 1?????? ???????????????
                    <br />
                    (?????? ?????? ??????)
                  </p>

                  <button
                    className="btn"
                    onClick={() => {
                      setPopupType(1)
                      setLayerWinner(true)
                    }}>
                    ?????? ?????? DJ ??????
                  </button>
                </div>
              </div>
              <div className="notice_box">
                <p>????????? ??????????????? ???????????????.</p>
                <p>
                  ????????? ????????? ??? ????????????{' '}
                  <button
                    onClick={() => {
                      setLayerDetail(true)
                    }}>
                    ????????? ?????? &gt;
                  </button>
                  <button
                    onClick={() => {
                      setLayerGift(true)
                    }}>
                    ?????? ???????????? &gt;
                  </button>
                </p>
              </div>
              <div className="my_info_box">
                <div className="my_rank_box">
                  <span>??? ??????</span>
                  <span className="rank">{videoRankInfo.myRank}</span> <span>???</span>
                </div>
                <div className="my_rank_box">
                  <span>
                    <img src="https://image.dalbitlive.com/event/video_open/ic_star@3x.png" alt="star" /> ?????? ???
                  </span>
                  <span className="point">{videoRankInfo.myPoint.toLocaleString()}</span>
                </div>

                <div className="my_point">
                  {videoRankInfo.diffPoint <= 0 ? (
                    <>
                      ?????? <span>???</span>??? ????????????.
                    </>
                  ) : (
                    <>
                      <span>??? {videoRankInfo.diffPoint}???</span>??? ????????? <span>{videoRankInfo.opRank}???</span>??? ??? ??? ????????????.
                    </>
                  )}
                  <button onClick={refreshList}>
                    <img
                      src={'https://image.dalbitlive.com/event/video_open/ic_refresh_new.svg'}
                      alt="????????????"
                      className={`refresh-img${refresh ? ' active' : ''}`}
                    />
                  </button>
                </div>
              </div>
              <List videoRankList={videoRankList} />
            </div>
          )}

          {/* Fan Event Section */}
          {eventType === 2 && (
            <div className="stage_wrap">
              <img
                src="https://image.dalbitlive.com/event/video_open/20210217/event_fan_img@3x.png"
                alt="???????????? ?????? ????????? 30?????? ????????? ????????????."
              />
              <div className="btn_wrap">
                <div className="btnWrap">
                  <h3>
                    ?????? ?????? ?????? <span>?????? ??????</span>
                  </h3>
                  <p>
                    <span>??????!</span> ?????? ????????? ?????? ?????? ?????? ????????????
                    <br />
                    ????????? <span>1,000???</span>??? ??? ????????????!
                  </p>

                  <p className="memo">
                    ??? ?????? ?????? ?????? ????????? ?????? ??? 1?????? ???????????????
                    <br />
                    (?????? ?????? ??????)
                  </p>
                  <button
                    className="btn"
                    onClick={() => {
                      setPopupType(2)
                      setLayerWinner(true)
                    }}>
                    ?????? ?????? ??? ??????
                  </button>
                </div>
              </div>
              <div className="notice_box">
                <p>????????? ??????????????? ???????????????.</p>
                <p>
                  ????????? ????????? ??? ????????????{' '}
                  <button
                    onClick={() => {
                      setLayerDetail(true)
                    }}>
                    ????????? ?????? &gt;
                  </button>
                  <button
                    onClick={() => {
                      setLayerGift(true)
                    }}>
                    ?????? ???????????? &gt;
                  </button>
                </p>
              </div>

              <div className="my_info_box">
                <div className="my_rank_box">
                  <span>??? ??????</span>
                  <span className="rank">{videoRankInfo.myRank}</span> <span>???</span>
                </div>
                <div className="my_rank_box">
                  <span>
                    <img src="https://image.dalbitlive.com/event/video_open/ic_moon@3x.png" alt="moon" /> ?????? ???
                  </span>
                  <span className="point">{videoRankInfo.myPoint.toLocaleString()}</span>
                </div>

                <div className="my_point">
                  {videoRankInfo.diffPoint <= 0 ? (
                    <>
                      ????????? <span>???</span>??? ????????????.
                    </>
                  ) : (
                    <>
                      <span>??? {videoRankInfo.diffPoint}???</span>??? ???????????? <span>{videoRankInfo.opRank}???</span>??? ??? ???
                      ????????????.
                    </>
                  )}
                  <button onClick={refreshList}>
                    <img
                      src={'https://image.dalbitlive.com/event/video_open/ic_refresh_new.svg'}
                      alt="????????????"
                      className={`refresh-img${refresh ? ' active' : ''}`}
                    />
                  </button>
                </div>
              </div>

              <List videoRankList={videoRankList} />
            </div>
          )}
        </div>
      </div>
      {layerDetail && <LayerDetail setLayerDetail={setLayerDetail} content={videoRankInfo.detailDesc} />}
      {layerGift && <LayerGift setLayerGift={setLayerGift} content={videoRankInfo.giftDesc} />}
      {layerWinner && (
        <LayerWinner setLayerWinner={setLayerWinner} list={videoWinnerInfo} popupType={popupType} setPopupType={setPopupType} />
      )}
    </div>
  )
}
