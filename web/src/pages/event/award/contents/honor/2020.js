import React, {useState, useEffect, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Hybrid, isHybrid} from 'context/hybrid'
import qs from 'query-string'

//constant
import {AWARD_PAGE_TYPE} from './constant'

import AwardsWinnersList from './components/awards_winners_list'
import AwardsTab from './components/awards_tab'
import TabDJ from './tab_dj'
import TabFan from './tab_fan'
import {useDispatch} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function awardEvent() {
  const history = useHistory()
  const {webview, type} = qs.parse(location.search)
  const [awardsHonorsDJList, setAwardsHonorsDJList] = useState([])
  const [awardsHonorsFanList, setAwardsHonorsFanList] = useState([])
  const [pageType, setPageType] = useState(AWARD_PAGE_TYPE.DJTOP)
  const [selectedDJIndex, setSelectedDJIndex] = useState(0)
  const dispatch = useDispatch();
  const fetchDataListLatest = useCallback(
    async (pageType) => {
      if (awardsHonorsDJList.length > 0 && awardsHonorsFanList.length > 0) return // prevents from calling api unnecessarily

      const {
        result,
        data: {list},
        message
      } = await Api.getAwardHonor({
        slctType: pageType
      })
      if (result === 'success') {
        if (pageType === AWARD_PAGE_TYPE.DJTOP) {
          setAwardsHonorsDJList(list)
        } else {
          setAwardsHonorsFanList(list)
        }
      } else {

        dispatch(setGlobalCtxMessage({type:'alert',
          msg: message
        }))
      }
    },
    [awardsHonorsDJList, awardsHonorsFanList]
  )

  const toggleTab = (type) => setPageType(type)

  const onDJClickHandler = (idx) => {
    setSelectedDJIndex(idx)
  }

  const clickCloseBtn = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      history.goBack()
    }
  }

  useEffect(() => {
    fetchDataListLatest(pageType)
  }, [pageType])

  return (
    <>
      <div className="awardRankPage">
        <button className="btnBack" onClick={clickCloseBtn}>
          <img src="https://image.dallalive.com/svg/close_w_l.svg" alt="close" />
        </button>
        <img src="https://image.dallalive.com/event/award_rank/awrad_visual.png" alt="영예의 수상자" />

        <AwardsTab pageType={pageType} toggleTab={toggleTab} />

        {/* Toggle - DJ : Fan */}
        {pageType === AWARD_PAGE_TYPE.DJTOP ? (
          <div className="djBox">
            <AwardsWinnersList
              awardsHonorsDJList={awardsHonorsDJList}
              selectedDJIndex={selectedDJIndex}
              onDJClickHandler={onDJClickHandler}
            />
            {awardsHonorsDJList?.length > 0 && <TabDJ djMemNo={awardsHonorsDJList[selectedDJIndex].memNo} />}
          </div>
        ) : (
          awardsHonorsFanList.map((eachFan, idx) => <TabFan key={`${idx}-${eachFan.memNo}`} eachFan={eachFan} />)
        )}
      </div>
    </>
  )
}
