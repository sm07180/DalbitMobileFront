import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

//globalCtx
import {Context} from 'context'
import Api from 'context/api'

// component
import StatusList from './status_list'
import LayerTable from './layer_table'
import LayerPresent from './layer_present'

export default function Status() {
  const history = useHistory()
  const context = useContext(Context)

  const [layerPresent, setLayerPresent] = useState(false)
  const [layerPointTable, setLayerPointTable] = useState(false)
  const [scoreData, setScoreData] = useState([])
  const [myScoreData, setMyScoreData] = useState({
    myRank1: 0,
    myRank2: 0,
    myRank3: 0,
    myRank4: 0,
    myRank5: 0,
    myWinPoint1: 0,
    myWinPoint2: 0,
    myWinPoint3: 0,
    myWinPoint4: 0,
    myWinPoint5: 0,
    nowEventNo: 1,
    totalRank: 0,
    totalWinPoint: 0
  })

  async function fetchScoreData() {
    const {result, data, message} = await Api.getChampionshipPoint({
      slctType: 1
    })

    if (result === 'success') {
      setScoreData(data.list)
      console.log(data)
      setMyScoreData(data)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  const eventNo = () => {
    const eventNoList = [1, 2, 3, 4, 5]
    return eventNoList.map((number, index) => {
      if (myScoreData.nowEventNo === number) {
        return (
          <div className="score_item" key={index}>
            <dt className="active">{number}주차</dt>
            <dd>
              진행 <br />중
            </dd>
          </div>
        )
      } else if (myScoreData.nowEventNo > number) {
        const myRank = myScoreData[`myRank${number}`]
        const myPoint = myScoreData[`myWinPoint${number}`]
        return (
          <div className="score_item" key={index}>
            <dt className="complete">{number}주차</dt>
            <dd>
              <span>{myPoint}점</span>
              {`${myRank}`}등
            </dd>
          </div>
        )
      } else {
        return (
          <div className="score_item" key={index}>
            <dt>{number}주차</dt>
            <dd>
              진행 <br />
              예정
            </dd>
          </div>
        )
      }
    })
  }

  const checkPresent = async () => {
    const {result, message} = await Api.postChampionshipGift({})

    if (result === 'success') {
      context.action.alert({
        msg: message
      })
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  useEffect(() => {
    fetchScoreData()
  }, [])

  return (
    <>
      <div className="stage_wrap">
        <div className="img_box status">
          <img src="https://image.dalbitlive.com/event/championship/20210304/points_status.png" alt="승점 현황 안내" />
        </div>
        <div className="status_wrap">
          <img
            className="status_img"
            src="https://image.dalbitlive.com/event/championship/20210223/points_rank_status.png"
            alt="내 점수 및 순위 현황"
          />
          <dl className="score_list">
            {eventNo()}
            <article className="score_item total">
              <dt>합계</dt>
              <dd>
                {myScoreData.nowEventNo > 1 ? (
                  <>
                    <span>{myScoreData.totalWinPoint} 점</span>
                    {myScoreData.totalRank} 등
                  </>
                ) : (
                  '집계 중'
                )}
              </dd>
            </article>
          </dl>
          <div className="img_box">
            <img src="https://image.dalbitlive.com/event/championship/20210223/status_surprise.png" alt="surprise event" />
            <button
              className="receive_btn"
              onClick={() => {
                context.token.isLogin
                  ? checkPresent()
                  : history.push({
                      pathname: '/login',
                      state: {
                        state: 'event/championship'
                      }
                    })
              }}>
              <img src="https://image.dalbitlive.com/event/championship/20210223/status_receive.png" alt="선물 받기" />
            </button>
          </div>
        </div>
        <div className="img_box rank">
          <img src="https://image.dalbitlive.com/event/championship/20210223/rank_status.png" alt="전체 순위 현황" />
          <div className="btn_box">
            <button
              onClick={() => {
                setLayerPointTable(true)
              }}>
              <img
                src="https://image.dalbitlive.com/event/championship/20210223/view_points_table.png"
                alt="순위별 승점표 보기"
              />
            </button>
            <button
              onClick={() => {
                setLayerPresent(true)
              }}>
              <img
                src="https://image.dalbitlive.com/event/championship/20210223/view_surprise_present.png"
                alt="깜짝 선물 보기"
              />
            </button>
          </div>
        </div>
        {scoreData && <StatusList nowEventNo={myScoreData.nowEventNo} scoreData={scoreData} />}
      </div>
      {layerPointTable && (
        <LayerTable nowEventNo={myScoreData.nowEventNo} setLayerPointTable={setLayerPointTable} content={myScoreData.pointDesc} />
      )}
      {layerPresent && <LayerPresent setLayerPresent={setLayerPresent} />}
    </>
  )
}
