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
      <img src={imgList.topBgImg} alt="?????? ????????????" />
      {/* <img src={`${IMG_SERVER}/event/championship/4round/4round_title.png`} alt="?????? ????????????" /> */}
      <button className="btnBack" onClick={() => clickCloseBtn()}>
        <img src={`${IMG_SERVER}/svg/close_w_l.svg`} alt="close" />
      </button>
      <div className="tab_box">
        <button onClick={() => setEventMainType(1)}>
          <img
            src={`${IMG_SERVER}/event/championship/20210223/tab_star${eventMainType === 1 ? '_focus' : ''}.png`}
            alt="????????? ??????"
          />
        </button>

        <button onClick={() => setEventMainType(2)}>
          <img
            src={`${IMG_SERVER}/event/championship/20210223/tab_fan${eventMainType === 2 ? '_focus' : ''}.png`}
            alt="??? ?????? ??????(DJ)"
          />
        </button>
      </div>

      <div className="event_content_wrap">
        {/* Event Main Section */}
        {eventMainType === 1 ? (
          // ????????? ??????
          eventSubType === 1 ? (
            // ????????? ?????? > DJ ??????
            <div className="stage_wrap">
              <div className="tab_box">
                <button
                  onClick={() => {
                    setEventSubType(1)
                  }}>
                  <img src={`${IMG_SERVER}/event/championship/20210223/dj_rank_focus.png`} alt="DJ ??????" />
                </button>
                <button
                  onClick={() => {
                    setEventSubType(2)
                  }}>
                  <img src={`${IMG_SERVER}/event/championship/20210223/fan_rank.png`} alt="??? ??????" />
                </button>
              </div>
              <img src={imgList.djBgImg} alt="DJ ????????? ??????" />
              {/* <img src={`${IMG_SERVER}/event/championship/4round/4round_dj.png`} alt="DJ ????????? ??????" /> */}
              <div className="notice_box">
                <p>????????? ??????????????? ???????????????.</p>
                <p>
                  ????????? ????????? ??? ????????????
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
                  <span className="rank">{rankInfo.myRank}</span> <span>???</span>
                </div>
                <div className="my_rank_box">
                  <span>
                    <img src={`${IMG_SERVER}/event/video_open/ic_star@3x.png`} alt="star" /> ?????? ???
                  </span>
                  <span className="point">{rankInfo.myPoint.toLocaleString()}</span>
                </div>

                <button className="btn_refresh" onClick={refreshList}>
                  <img
                    src={`${IMG_SERVER}/event/video_open/ic_refresh_new.svg`}
                    alt="????????????"
                    className={`refresh-img${refresh ? ' active' : ''}`}
                  />
                </button>

                {rankInfo.myRank !== 1 && (
                  <div className="my_point">
                    {rankInfo.diffPoint <= 0 ? (
                      <>
                        ?????? <span>???</span>??? ????????????.
                      </>
                    ) : (
                      <>
                        <span>??? {rankInfo.diffPoint}???</span>??? ????????? <span>{rankInfo.opRank}???</span>??? ??? ??? ????????????.
                      </>
                    )}
                  </div>
                )}
              </div>

              <MainList djRankList={djRankList} eventSubType={eventSubType} />
            </div>
          ) : (
            // ????????? ?????? > ??? ??????
            <div className="stage_wrap">
              <div className="tab_box">
                <button
                  onClick={() => {
                    setEventSubType(1)
                  }}>
                  <img src={`${IMG_SERVER}/event/championship/20210223/dj_rank.png`} alt="DJ ??????" />
                </button>
                <button
                  onClick={() => {
                    setEventSubType(2)
                  }}>
                  <img src={`${IMG_SERVER}/event/championship/20210223/fan_rank_focus.png`} alt="??? ??????" />
                </button>
              </div>
              <img src={imgList.fanBgImg} alt="??? ????????? ??????" />
              {/* <img src={`${IMG_SERVER}/event/championship/4round/4round_fan.png`} alt="??? ????????? ??????" /> */}
              <div className="notice_box">
                <p>????????? ??????????????? ???????????????.</p>
                <p>
                  ????????? ????????? ??? ????????????
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
                  <span className="rank">{rankInfo.myRank}</span> <span>???</span>
                </div>
                <div className="my_rank_box">
                  <span>
                    <img src={`${IMG_SERVER}/event/video_open/ic_moon@3x.png`} alt="moon" /> ?????? ???
                  </span>
                  <span className="point">{rankInfo.myPoint.toLocaleString()}</span>
                </div>

                {rankInfo.myRank !== 1 && (
                  <div className="my_point">
                    {rankInfo.diffPoint <= 0 ? (
                      <>
                        ????????? <span>???</span>??? ????????????.
                      </>
                    ) : (
                      <>
                        <span>??? {rankInfo.diffPoint}???</span>??? ???????????? <span>{rankInfo.opRank}???</span>??? ??? ??? ????????????.
                      </>
                    )}
                  </div>
                )}

                <button className="btn_refresh" onClick={refreshList}>
                  <img
                    src={`${IMG_SERVER}/event/video_open/ic_refresh_new.svg`}
                    alt="????????????"
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
