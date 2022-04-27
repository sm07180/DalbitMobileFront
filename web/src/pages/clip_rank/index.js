import React, {useContext, useRef, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {setClipRankList, setMyInfo} from "redux/actions/clipRank";
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'
import NoResult from 'components/ui/new_noResult'

import './index.scss'
import ClipRankDateBtn from './components/clip_ranking_date_btn'
import ClipRankHandleDateBtn from './components/clip_ranking_handle_date_btn'
import ClipRankingMyRank from './components/clip_ranking_my_rank'
import ClipRankingListTop3 from './components/clip_ranking_list_top3'
import ClipRankingList from './components/clip_ranking_list'
import {useDispatch, useSelector} from "react-redux";

const records = 100
let topBoxHeight

function CilpRank() {
  const history = useHistory()
  const dispatch = useDispatch()
  const clipRankState = useSelector(({clipRankCtx}) => clipRankCtx);
  const {formState, clipRankList} = clipRankState
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)

  const TopRef = useRef()
  const FixedWrapRef = useRef()
  const TopItemWrap = useRef()
  const BottomList = useRef()
  const TopItemHeight = useRef()

  async function fetchData() {
    const resParams = {
      rankType: formState.dateType,
      rankingDate: formState.rankingDate,
      page: 1,
      records: records
    }
    localStorage.setItem('clipPlayListInfo', JSON.stringify(resParams))
    const res = await Api.getClipRankingList({...resParams})
    if (res.result === 'success') {
      setLoading(false)
      if (res.data.list.length > 5) {
        dispatch(setClipRankList(res.data.list))
        setEmpty(false)
      } else {
        dispatch(setClipRankList([]))
        setEmpty(true)
      }
      dispatch(setMyInfo(res.data));
    } else {
      setLoading(true)
      dispatch(setMyInfo({}));
      dispatch(setClipRankList([]))
    }
  }

  useEffect(() => {
    fetchData()
  }, [formState])

  useEffect(() => {
    window.scrollTo(0, 0)
    const windowScrollEvent = () => {
      const scrollY = window.scrollY

      if (TopItemHeight.current.offsetHeight > 50) {
        topBoxHeight = TopItemHeight.current.offsetHeight - 50
      }
      if (scrollY >= 50) {
        FixedWrapRef.current.className = 'rankTabFixed'
        TopItemWrap.current.className = 'topTimeFiexd'
        TopRef.current.style.marginTop = '92px'

        BottomList.current.style.marginTop = `${topBoxHeight}px` //소감보기 버튼 활성화
      } else {
        FixedWrapRef.current.className = ''
        TopItemWrap.current.className = ''
        TopRef.current.style.marginTop = '0px'
        BottomList.current.style.marginTop = '0px'
      }
    }

    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)

      topBoxHeight = 0
    }
  }, [formState])

  return (
    <Layout status="no_gnb">
      {!loading && (
        <div id="clipRank" className="subContent gray">
          <div ref={TopItemHeight}>
            <Header>
              <h2 className="header-title">클립 랭킹</h2>

              <div
                className="benefitMore"
                onClick={() => {
                  history.push({
                    pathname: `/clip_rank/guidance`
                  })
                }}>
                <img src="https://image.dalbitlive.com/images/clip_rank/benefit@2x.png " width={60} alt="혜택" />
              </div>
            </Header>

            <div ref={FixedWrapRef}>
              <ClipRankDateBtn />
              <ClipRankHandleDateBtn />
            </div>

            <div ref={TopItemWrap}>
              {clipRankList.length > 0 ? (
                <div className="rankTop3Box" ref={TopRef}>
                  {/* 랭킹 보상 & 내 클립 랭킹 영역 */}
                  <ClipRankingMyRank />
                  {/* 어제 랭킹 1,2,3 트로피 영역 */}
                  <ClipRankingListTop3 />
                </div>
              ) : (
                empty &&
                clipRankList.length > 0 && (
                  <div className="noResultBox">
                    <NoResult type="default" text="조회 된 결과가 없습니다." />
                  </div>
                )
              )}
            </div>
          </div>
          {/* 4등 부터 리스트 시작 */}
          {clipRankList.length > 0 ? (
            <div ref={BottomList}>
              <ClipRankingList />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </Layout>
  )
}

export default CilpRank
