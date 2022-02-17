import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

//globalCtx
import Api from 'context/api'

//component
import LayerDetail from './components/layer_detail'
import LayerGift from './components/layer_gift'
import MainList from './components/main_list'
import Status from './components/status/status'

import './index.scss'
import {IMG_SERVER} from 'context/config'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  const [eventMainType, setEventMainType] = useState(1) // main, points -> 1,2
  const [eventSubType, setEventSubType] = useState(1) // dj, fan -> 1,2
  const [djRankList, setDjRankList] = useState([])
  const [imgList, setImgList] = useState({
    topBgImg: '',
    djBgImg: '',
    fanBgImg: ''
  })
  const [rankInfo, setRankInfo] = useState({
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
  const [championData, setChampionData] = useState([])

  const clickCloseBtn = () => {
    return history.goBack()
  }
  async function fetchChampionshipData() {
    const {result, data, message} = await Api.getChampionship({
      slctType: eventSubType
    })

    if (result === 'success') {
      setChampionData(data)
      setImgList((prevImg) => {
        return {
          ...prevImg,
          topBgImg: data.topBgImg
        }
      })
      setImgList((prevImg) => {
        return {
          ...prevImg,
          djBgImg: data.djBgImg
        }
      })
      setImgList((prevImg) => {
        return {
          ...prevImg,
          fanBgImg: data.fanBgImg
        }
      })

      setDjRankList(data.list)
      setRankInfo({
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

  const refreshList = () => {
    fetchChampionshipData()
    setRefresh(true)

    setTimeout(() => {
      setRefresh(false)
    }, 360)
  }

  useEffect(() => {
    fetchChampionshipData()
  }, [eventSubType])

  return (
    <div id="championship_page">
      <img src={imgList.topBgImg} alt="달빛라이브 챔피언십" />
      {/* <img src={`${IMG_SERVER}/event/championship/4round/4round_title.png`} alt="달빛라이브 챔피언십" /> */}
      <button className="btnBack" onClick={() => clickCloseBtn()}>
        <img src={`${IMG_SERVER}/svg/close_w_l.svg`} alt="close" />
      </button>
      <div className="tab_box">
        <button onClick={() => setEventMainType(1)}>
          <img
            src={`${IMG_SERVER}/event/championship/20210223/tab_star${eventMainType === 1 ? '_focus' : ''}.png`}
            alt="이벤트 메인"
          />
        </button>

        <button onClick={() => setEventMainType(2)}>
          <img
            src={`${IMG_SERVER}/event/championship/20210223/tab_fan${eventMainType === 2 ? '_focus' : ''}.png`}
            alt="총 승점 현황(DJ)"
          />
        </button>
      </div>

      <div className="event_content_wrap">
        {/* Event Main Section */}
        {eventMainType === 1 ? (
          // 이벤트 메인
          eventSubType === 1 ? (
            // 이벤트 메인 > DJ 랭킹
            <div className="stage_wrap">
              <div className="tab_box">
                <button
                  onClick={() => {
                    setEventSubType(1)
                  }}>
                  <img src={`${IMG_SERVER}/event/championship/20210223/dj_rank_focus.png`} alt="DJ 랭킹" />
                </button>
                <button
                  onClick={() => {
                    setEventSubType(2)
                  }}>
                  <img src={`${IMG_SERVER}/event/championship/20210223/fan_rank.png`} alt="팬 랭킹" />
                </button>
              </div>
              <img src={imgList.djBgImg} alt="DJ 이벤트 안내" />
              {/* <img src={`${IMG_SERVER}/event/championship/4round/4round_dj.png`} alt="DJ 이벤트 안내" /> */}
              <div className="notice_box">
                <p>순위는 실시간으로 집계됩니다.</p>
                <p>
                  당첨자 발표일 및 유의사항
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
                  <span className="rank">{rankInfo.myRank}</span> <span>등</span>
                </div>
                <div className="my_rank_box">
                  <span>
                    <img src={`${IMG_SERVER}/event/video_open/ic_star@3x.png`} alt="star" /> 받은 별
                  </span>
                  <span className="point">{rankInfo.myPoint.toLocaleString()}</span>
                </div>

                <button className="btn_refresh" onClick={refreshList}>
                  <img
                    src={`${IMG_SERVER}/event/video_open/ic_refresh_new.svg`}
                    alt="새로고침"
                    className={`refresh-img${refresh ? ' active' : ''}`}
                  />
                </button>

                {rankInfo.myRank !== 1 && (
                  <div className="my_point">
                    {rankInfo.diffPoint <= 0 ? (
                      <>
                        받은 <span>별</span>이 없습니다.
                      </>
                    ) : (
                      <>
                        <span>별 {rankInfo.diffPoint}개</span>를 받으면 <span>{rankInfo.opRank}등</span>이 될 수 있습니다.
                      </>
                    )}
                  </div>
                )}
              </div>

              <MainList djRankList={djRankList} eventSubType={eventSubType} />
            </div>
          ) : (
            // 이벤트 메인 > 팬 랭킹
            <div className="stage_wrap">
              <div className="tab_box">
                <button
                  onClick={() => {
                    setEventSubType(1)
                  }}>
                  <img src={`${IMG_SERVER}/event/championship/20210223/dj_rank.png`} alt="DJ 랭킹" />
                </button>
                <button
                  onClick={() => {
                    setEventSubType(2)
                  }}>
                  <img src={`${IMG_SERVER}/event/championship/20210223/fan_rank_focus.png`} alt="팬 랭킹" />
                </button>
              </div>
              <img src={imgList.fanBgImg} alt="팬 이벤트 안내" />
              {/* <img src={`${IMG_SERVER}/event/championship/4round/4round_fan.png`} alt="팬 이벤트 안내" /> */}
              <div className="notice_box">
                <p>순위는 실시간으로 집계됩니다.</p>
                <p>
                  당첨자 발표일 및 유의사항
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
                  <span className="rank">{rankInfo.myRank}</span> <span>등</span>
                </div>
                <div className="my_rank_box">
                  <span>
                    <img src={`${IMG_SERVER}/event/video_open/ic_moon@3x.png`} alt="moon" /> 보낸 달
                  </span>
                  <span className="point">{rankInfo.myPoint.toLocaleString()}</span>
                </div>

                {rankInfo.myRank !== 1 && (
                  <div className="my_point">
                    {rankInfo.diffPoint <= 0 ? (
                      <>
                        선물한 <span>달</span>이 없습니다.
                      </>
                    ) : (
                      <>
                        <span>달 {rankInfo.diffPoint}개</span>를 선물하면 <span>{rankInfo.opRank}등</span>이 될 수 있습니다.
                      </>
                    )}
                  </div>
                )}

                <button className="btn_refresh" onClick={refreshList}>
                  <img
                    src={`${IMG_SERVER}/event/video_open/ic_refresh_new.svg`}
                    alt="새로고침"
                    className={`refresh-img${refresh ? ' active' : ''}`}
                  />
                </button>
              </div>

              <MainList djRankList={djRankList} eventSubType={eventSubType} />
            </div>
          )
        ) : (
          <Status />
        )}
      </div>
      {layerDetail && <LayerDetail setLayerDetail={setLayerDetail} content={rankInfo.detailDesc} />}
      {layerGift && <LayerGift setLayerGift={setLayerGift} content={rankInfo.giftDesc} />}
    </div>
  )
}
