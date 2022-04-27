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
            alt="보이는 라디오 오픈기념 STAR &amp; FAN 특별이벤트"
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
                alt="방송에서 많이 선물받은 30분께 선물을 드립니다."
              />
              <div className="btn_wrap">
                <div className="btnWrap">
                  <h3>
                    최고 DJ를 위한 <span>추가 혜택</span>
                  </h3>
                  <p>
                    <span>매일!</span> 방송 선물을 제일 많이 받은 DJ분들께
                    <br />
                    추가로 <span>1,000달</span>을 더 드립니다!
                  </p>

                  <p className="memo">
                    ※ 일간 최고 DJ은 이벤트 기간 중 1회만 선정됩니다
                    <br />
                    (중복 선정 불가)
                  </p>

                  <button
                    className="btn"
                    onClick={() => {
                      setPopupType(1)
                      setLayerWinner(true)
                    }}>
                    일간 최고 DJ 확인
                  </button>
                </div>
              </div>
              <div className="notice_box">
                <p>순위는 실시간으로 집계됩니다.</p>
                <p>
                  당첨자 발표일 및 유의사항{' '}
                  <button
                    onClick={() => {
                      setLayerDetail(true)
                    }}>
                    자세히 보기 &gt;
                  </button>
                  <button
                    onClick={() => {
                      setLayerGift(true)
                    }}>
                    경품 상세소개 &gt;
                  </button>
                </p>
              </div>
              <div className="my_info_box">
                <div className="my_rank_box">
                  <span>내 순위</span>
                  <span className="rank">{videoRankInfo.myRank}</span> <span>등</span>
                </div>
                <div className="my_rank_box">
                  <span>
                    <img src="https://image.dalbitlive.com/event/video_open/ic_star@3x.png" alt="star" /> 받은 별
                  </span>
                  <span className="point">{videoRankInfo.myPoint.toLocaleString()}</span>
                </div>

                <div className="my_point">
                  {videoRankInfo.diffPoint <= 0 ? (
                    <>
                      받은 <span>별</span>이 없습니다.
                    </>
                  ) : (
                    <>
                      <span>별 {videoRankInfo.diffPoint}개</span>를 받으면 <span>{videoRankInfo.opRank}등</span>이 될 수 있습니다.
                    </>
                  )}
                  <button onClick={refreshList}>
                    <img
                      src={'https://image.dalbitlive.com/event/video_open/ic_refresh_new.svg'}
                      alt="새로고침"
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
                alt="방송에서 많이 선물한 30분께 선물을 드립니다."
              />
              <div className="btn_wrap">
                <div className="btnWrap">
                  <h3>
                    최고 팬을 위한 <span>추가 혜택</span>
                  </h3>
                  <p>
                    <span>매일!</span> 방송 선물을 제일 많이 보낸 팬분들께
                    <br />
                    추가로 <span>1,000달</span>을 더 드립니다!
                  </p>

                  <p className="memo">
                    ※ 일간 최고 팬은 이벤트 기간 중 1회만 선정됩니다
                    <br />
                    (중복 선정 불가)
                  </p>
                  <button
                    className="btn"
                    onClick={() => {
                      setPopupType(2)
                      setLayerWinner(true)
                    }}>
                    일간 최고 팬 확인
                  </button>
                </div>
              </div>
              <div className="notice_box">
                <p>순위는 실시간으로 집계됩니다.</p>
                <p>
                  당첨자 발표일 및 유의사항{' '}
                  <button
                    onClick={() => {
                      setLayerDetail(true)
                    }}>
                    자세히 보기 &gt;
                  </button>
                  <button
                    onClick={() => {
                      setLayerGift(true)
                    }}>
                    경품 상세소개 &gt;
                  </button>
                </p>
              </div>

              <div className="my_info_box">
                <div className="my_rank_box">
                  <span>내 순위</span>
                  <span className="rank">{videoRankInfo.myRank}</span> <span>등</span>
                </div>
                <div className="my_rank_box">
                  <span>
                    <img src="https://image.dalbitlive.com/event/video_open/ic_moon@3x.png" alt="moon" /> 보낸 달
                  </span>
                  <span className="point">{videoRankInfo.myPoint.toLocaleString()}</span>
                </div>

                <div className="my_point">
                  {videoRankInfo.diffPoint <= 0 ? (
                    <>
                      선물한 <span>달</span>이 없습니다.
                    </>
                  ) : (
                    <>
                      <span>별 {videoRankInfo.diffPoint}개</span>를 선물하면 <span>{videoRankInfo.opRank}등</span>이 될 수
                      있습니다.
                    </>
                  )}
                  <button onClick={refreshList}>
                    <img
                      src={'https://image.dalbitlive.com/event/video_open/ic_refresh_new.svg'}
                      alt="새로고침"
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
