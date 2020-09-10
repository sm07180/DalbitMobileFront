import React, {useState, useEffect, useContext, useCallback, useRef} from 'react'

import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'
import Api from 'context/api'

import {convertDateFormat, convertSetSpecialDate} from './lib/common_fn'

//components
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'
import RankBtnWrap from './components/rank_btn_wrap'
import RankHandleDateBtn from './components/rank_handle_date_btn'
import RankDateBtn from './components/date_btn_wrap'
import MyProfile from './components/MyProfile'
import SpecialHistoryHandle from './components/special_history_handle'
import RankListWrap from './components/rank_list'
import LevelListWrap from './components/level_list'
import LikeListWrap from './components/like_list'
import SpecialListWrap from './components/special_list'
//constant
import {RANK_TYPE} from './constant'

import arrowRefreshIcon from './static/ic_arrow_refresh.svg'
import './index.scss'
import level from 'pages/level'

let timer
let touchStartY = null
let touchEndY = null
const records = 50
function Ranking() {
  const context = useContext(Context)
  const {rankState, rankAction} = useContext(RankContext)

  const {formState, myInfo, rankList, levelList, likeList, totalPage, scrollY} = rankState

  const formDispatch = rankAction.formDispatch
  const setMyInfo = rankAction.setMyInfo
  const setRankList = rankAction.setRankList
  const setLevelList = rankAction.setLevelList
  const setLikeList = rankAction.setLikeList
  const setTotalPage = rankAction.setTotalPage
  const setSpecialList = rankAction.setSpecialList
  const setScrollY = rankAction.setScrollY
  const [empty, setEmpty] = useState(false)
  const [reloadInit, setReloadInit] = useState(false)
  const [fetching, setFetching] = useState(false)

  const iconWrapRef = useRef()
  const arrowRefreshRef = useRef()
  const fixedWrapRef = useRef()
  const listWrapRef = useRef()
  const refreshDefaultHeight = 49

  const rankTouchStart = useCallback(
    (e) => {
      if (
        reloadInit === true ||
        window.scrollY !== 0 ||
        formState.rankType === RANK_TYPE.LEVEL ||
        formState.rankType === RANK_TYPE.LIKE
      )
        return
      touchStartY = e.touches[0].clientY
    },
    [reloadInit, formState]
  )

  const rankTouchMove = useCallback(
    (e) => {
      if (
        reloadInit === true ||
        window.scrollY !== 0 ||
        formState.rankType === RANK_TYPE.LEVEL ||
        formState.rankType === RANK_TYPE.LIKE
      )
        return
      const iconWrapNode = iconWrapRef.current
      const refreshIconNode = arrowRefreshRef.current

      touchEndY = e.touches[0].clientY

      const ratio = 3
      const heightDiff = (touchEndY - touchStartY) / ratio

      if (window.scrollY === 0 && typeof heightDiff === 'number' && heightDiff > 10) {
        iconWrapRef.current.style.display = 'block'
        iconWrapNode.style.height = `${refreshDefaultHeight + heightDiff}px`
        refreshIconNode.style.transform = `rotate(${-(heightDiff * ratio)}deg)`
      }
    },
    [reloadInit, formState]
  )

  const rankTouchEnd = useCallback(
    async (e) => {
      if (reloadInit === true || formState.rankType === RANK_TYPE.LEVEL || formState.rankType === RANK_TYPE.LIKE) return

      const ratio = 3
      const transitionTime = 150
      const iconWrapNode = iconWrapRef.current
      const refreshIconNode = arrowRefreshRef.current

      const heightDiff = (touchEndY - touchStartY) / ratio

      if (heightDiff >= 100) {
        let current_angle = (() => {
          const str_angle = refreshIconNode.style.transform
          let head_slice = str_angle.slice(7)
          let tail_slice = head_slice.slice(0, 4)
          return Number(tail_slice)
        })()

        if (typeof current_angle === 'number') {
          setReloadInit(true)
          iconWrapNode.style.transitionDuration = `${transitionTime}ms`
          iconWrapNode.style.height = `${refreshDefaultHeight}px`

          const loadIntervalId = setInterval(() => {
            if (Math.abs(current_angle) === 360) {
              current_angle = 0
            }
            current_angle -= 10
            refreshIconNode.style.transform = `rotate(${current_angle}deg)`
          }, 17)

          if (formState.rankType === RANK_TYPE.DJ || formState.rankType === RANK_TYPE.FAN) {
            formDispatch({
              type: 'INIT'
            })
          }

          await new Promise((resolve, _) => setTimeout(() => resolve(), 300))
          clearInterval(loadIntervalId)
          setReloadInit(false)
        }
      }
      const promiseSync = () =>
        new Promise((resolve, _) => {
          iconWrapNode.style.transitionDuration = `${transitionTime}ms`
          iconWrapNode.style.height = `${refreshDefaultHeight}px`
          setTimeout(() => resolve(), transitionTime)
        })

      await promiseSync()
      iconWrapNode.style.transitionDuration = '0ms'
      iconWrapNode.style.display = 'none'
      refreshIconNode.style.transform = 'rotate(0)'
      touchStartY = null
      touchEndY = null
    },
    [reloadInit, formState]
  )

  const promise = new Promise(function (resolve, reject) {
    return resolve()
  })

  const fetchData = useCallback(async () => {
    if (formState.rankType === RANK_TYPE.LEVEL) {
      if (levelList.length > 0) {
        if (formState.page > 1) {
          const length = (formState.page - 1) * records
          if (levelList.length > length) {
            return
          }
        }
      }
    } else if (formState.rankType === RANK_TYPE.LIKE) {
      if (likeList.length > 0) {
        if (formState.page > 1) {
          const length = (formState.page - 1) * records
          if (likeList.length > length) {
            return
          }
        }
      }
    } else {
      if (rankList.length > 0) {
        if (formState.page > 1) {
          const length = (formState.page - 1) * records
          if (rankList.length > length) {
            return
          }
        }
      }
    }
    setFetching(true)
    const formatDate = convertDateFormat(formState.currentDate, '-')

    const res = await Api.getRankList({
      rankSlct: formState.rankType,
      rankType: formState.dateType,
      page: formState.page,
      records: records,
      rankingDate: formatDate,
      type: formState.rankType === 3 ? 'level' : formState.rankType === 4 ? 'good' : 'page'
    })
    if (res.result === 'success' && res.data.list instanceof Array) {
      if (res.data.list.length > 0) {
        if (formState.rankType === 3) {
          // level
          if (formState.page > 1) {
            if (levelList.length === 0) {
              const res2 = await Api.getRankList({
                rankSlct: formState.rankType,
                rankType: formState.dateType,
                page: 1,
                records: records,
                rankingDate: formatDate,
                type: formState.rankType === 3 ? 'level' : formState.rankType === 4 ? 'good' : 'page'
              })

              if (res2.result === 'success') {
                setLevelList(res2.data.list.concat(res.data.list))
              }
            } else {
              setLevelList(levelList.concat(res.data.list))
            }
          } else {
            setLevelList(res.data.list)
          }
          setRankList([])
          setLikeList([])
          setTotalPage(res.data.paging.totalPage)
        } else if (formState.rankType === 4) {
          //good
          if (formState.page > 1) {
            if (likeList.length === 0) {
              const res2 = await Api.getRankList({
                rankSlct: formState.rankType,
                rankType: formState.dateType,
                page: 1,
                records: records,
                rankingDate: formatDate,
                type: formState.rankType === 3 ? 'level' : formState.rankType === 4 ? 'good' : 'page'
              })

              if (res2.result === 'success') {
                setLikeList(res2.data.list.concat(res.data.list))
              }
            } else {
              setLikeList(likeList.concat(res.data.list))
            }
          } else {
            setLikeList(res.data.list)
          }
          setLevelList([])
          setRankList([])
          setTotalPage(res.data.paging.totalPage)
        } else {
          // dj, fan
          if (formState.page > 1) {
            if (rankList.length === 0) {
              const res2 = await Api.getRankList({
                rankSlct: formState.rankType,
                rankType: formState.dateType,
                page: 1,
                records: records,
                rankingDate: formatDate,
                type: formState.rankType === 3 ? 'level' : formState.rankType === 4 ? 'good' : 'page'
              })

              if (res2.result === 'success') {
                setRankList(res2.data.list.concat(res.data.list))
              }
            } else {
              setRankList(rankList.concat(res.data.list))
            }
          } else {
            setRankList(res.data.list)
          }
          setLevelList([])
          setLikeList([])
          setTotalPage(res.data.paging.totalPage)
          setMyInfo({
            myInfo,
            ...res.data
          })
        }
        setEmpty(false)
      } else {
        setEmpty(true)
        setRankList([])
        setLevelList([])
        setLikeList([])
        setMyInfo({...myInfo})
      }
    } else {
      setEmpty(true)
      setRankList([])
      setLevelList([])
      setLikeList([])
      setMyInfo({...myInfo})
    }

    setFetching(false)
  }, [formState, myInfo, rankList, levelList, likeList])

  useEffect(() => {
    if (scrollY > 0) {
      window.scrollTo(0, scrollY - 114)
    }
  }, [])

  useEffect(() => {
    if (formState.rankType !== RANK_TYPE.SPECIAL) fetchData()
    else {
      fetchSpecial()
    }
    async function fetchSpecial() {
      setFetching(true)
      const dateObj = convertSetSpecialDate(formState.currentDate)
      const res = await Api.getSpecialDjHistory({
        yy: dateObj.year,
        mm: dateObj.month
      })
      if (res.result === 'success') {
        if (res.data.list.length > 0) {
          setSpecialList(res.data.list)
          setEmpty(false)
        } else {
          setEmpty(true)
          setSpecialList([])
        }
      }

      setFetching(false)
    }
  }, [formState, context.token.isLogin])

  useEffect(() => {
    console.log(window.scrollY)
    const windowScrollEvent = () => {
      if (window.scrollY >= 48) {
        if (fixedWrapRef.current.classList.length === 0) {
          fixedWrapRef.current.className = 'fixed'
        }
        if (listWrapRef.current) {
          if (formState.rankType !== RANK_TYPE.SPECIAL) {
            if (context.token.isLogin) {
              if (listWrapRef.current.classList.length === 1) {
                listWrapRef.current.className = 'listFixed more'
              }
            } else {
              if (listWrapRef.current.classList.length === 0) {
                listWrapRef.current.className = 'listFixed'
              }
            }
          } else {
            listWrapRef.current.className = 'listFixed special'
          }
        }
      } else {
        fixedWrapRef.current.className = ''
        if (listWrapRef.current) {
          if (formState.rankType !== RANK_TYPE.SPECIAL) {
            if (context.token.isLogin) {
              listWrapRef.current.className = 'more'
            } else {
              listWrapRef.current.className = ''
            }
          } else {
            listWrapRef.current.className = 'special'
          }
        }
      }
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(function () {
        //스크롤
        setScrollY(window.scrollY)
        const diff = document.body.scrollHeight / (formState.page + 1)
        if (document.body.scrollHeight <= window.scrollY + window.innerHeight + diff) {
          if (totalPage > formState.page && formState.page < 25) {
            if (!fetching) {
              formDispatch({
                type: 'PAGE'
              })
            }
          }
        }
      }, 50)
    }

    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [formState, totalPage, fetching])

  return (
    <Layout status={'no_gnb'}>
      <div id="ranking-page" onTouchStart={rankTouchStart} onTouchMove={rankTouchMove} onTouchEnd={rankTouchEnd}>
        <Header title="랭킹" />
        <div className="refresh-wrap" ref={iconWrapRef}>
          <div className="icon-wrap">
            <img className="arrow-refresh-icon" src={arrowRefreshIcon} ref={arrowRefreshRef} />
          </div>
        </div>
        <div ref={fixedWrapRef}>
          <div className="rankTopBox">
            <RankBtnWrap fetching={fetching} />
            {/* <div className="rankTopBox__update">{formState.rankType !== 3 && formState.rankType !== 4 && `${realTime()}`}</div> */}
          </div>
          {(formState.rankType === RANK_TYPE.DJ || formState.rankType === RANK_TYPE.FAN) && (
            <>
              <RankDateBtn fetching={fetching} />
              <RankHandleDateBtn fetching={fetching} />
              <MyProfile fetching={fetching} />
            </>
          )}
          {formState.rankType === RANK_TYPE.SPECIAL && <SpecialHistoryHandle fetching={fetching} />}
        </div>
        {formState.rankType === RANK_TYPE.LEVEL && <LevelListWrap empty={empty} />}
        {formState.rankType === RANK_TYPE.LIKE && <LikeListWrap empty={empty} />}
        {(formState.rankType === RANK_TYPE.FAN || formState.rankType === RANK_TYPE.DJ) && (
          <div ref={listWrapRef} className={`${context.token.isLogin && 'more'}`}>
            <RankListWrap empty={empty} />
          </div>
        )}
        {formState.rankType === RANK_TYPE.SPECIAL && (
          <div ref={listWrapRef} className="special">
            <SpecialListWrap empty={empty} fetching={fetching} />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default React.memo(Ranking)
