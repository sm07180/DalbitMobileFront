import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

//globalCtx
import Api from 'context/api'

//component
import './index.scss'
import LayerDetail from './content/layer_detail'
import LayerGift from './content/layer_gift'
import List from './content/list'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function VideoOpenEvent() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const [eventType, setEventType] = useState(1) // star, fan
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
  const [layerDetail, setLayerDetail] = useState(false)
  const [layerGift, setLayerGift] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const clickCloseBtn = () => {
    return history.goBack()
  }

  async function fetchInitData() {
    const {result, data} = await Api.getVideoOpenEvent({
      slctType: eventType,
      eventNo: 1
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

  //----------------------------

  useEffect(() => {
    fetchInitData()
  }, [eventType])

  const refreshList = () => {
    fetchInitData()
    setRefresh(true)

    setTimeout(() => {
      setRefresh(false)
    }, 360)
  }

  return (
    <div>
      <div id="event_page">
        <div className="event_main_wrap">
          <img
            src="https://image.dalbitlive.com/event/video_open/top_visual@3x.png"
            alt="????????? ????????? ???????????? STAR &amp; FAN ???????????????"
          />
          <button className="btnBack" onClick={() => clickCloseBtn()}>
            <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
          </button>
        </div>
        <div className="tab_box">
          <button className="tab" onClick={() => setEventType(1)}>
            <img src={`https://image.dalbitlive.com/event/video_open/tab_star${eventType === 1 ? '_focus' : ''}@3x.png`} />
          </button>
          <button className="tab" onClick={() => setEventType(2)}>
            <img src={`https://image.dalbitlive.com/event/video_open/tab_fan${eventType === 2 ? '_focus' : ''}@3x.png`} />
          </button>
        </div>

        <div className="event_content_wrap">
          {/* Star Event Section */}
          {eventType === 1 && (
            <div className="stage_wrap">
              <img
                src="https://image.dalbitlive.com/event/video_open/event_satr_img@3x.png"
                alt="???????????? ?????? ???????????? 30?????? ????????? ????????????."
              />

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
                src="https://image.dalbitlive.com/event/video_open/event_fan_img@3x.png"
                alt="???????????? ?????? ????????? 30?????? ????????? ????????????."
              />
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
    </div>
  )
}
