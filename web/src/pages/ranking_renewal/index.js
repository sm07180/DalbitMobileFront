import React, {useState, useEffect, useContext, useCallback, useRef, useMemo} from 'react'

import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'
import Api from 'context/api'

import {
  convertDateFormat,
  convertSetSpecialDate,
  convertMonday,
  convertMonth,
  convertDateToText,
  convertDateTimeForamt
} from 'pages/common/rank/rank_fn'

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
import RankListTop from './components/rank_list/rank_list_top'
import LikeListWrap from './components/like_list'
import SpecialListWrap from './components/special_list'
import NoResult from 'components/ui/new_noResult'
import SpecialPointPop from './components/rank_list/special_point_pop'
import WeeklyPickWrap from './components/weekly_pick'
import SecondWrap from './components/second'
//constant
import {DATE_TYPE, RANK_TYPE, PAGE_TYPE} from './constant'

const arrowRefreshIcon = 'https://image.dalbitlive.com/main/common/ico_refresh.png'
import './index.scss'
import level from 'pages/level'

import benefitIcon from './static/benefit@3x.png'
import hallOfFameIcon from './static/ic_fame.svg'
import rankingPageIcon from './static/ic_ranking_page.svg'

let timer
let touchStartY = null
let touchEndY = null
let initial = true
const records = 50
function Ranking() {
  const history = useHistory()
  const context = useContext(Context)
  const {rankState, rankAction} = useContext(RankContext)

  const {
    formState,
    myInfo,
    rankList,
    levelList,
    likeList,
    totalPage,
    scrollY,
    weeklyList,
    secondList,

    rankTimeData
  } = rankState

  const formDispatch = rankAction.formDispatch
  const setMyInfo = rankAction.setMyInfo
  const setRankList = rankAction.setRankList
  const setLevelList = rankAction.setLevelList
  const setLikeList = rankAction.setLikeList
  const setTotalPage = rankAction.setTotalPage
  const setSpecialList = rankAction.setSpecialList
  const setWeeklyList = rankAction.setWeeklyList
  const setSecondList = rankAction.setSecondList
  const setRankTimeData = rankAction.setRankTimeData

  const setScrollY = rankAction.setScrollY
  const [empty, setEmpty] = useState(false)
  const [reloadInit, setReloadInit] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [popState, setPopState] = useState(false)

  const iconWrapRef = useRef()
  const arrowRefreshRef = useRef()
  const fixedWrapRef = useRef()
  const listWrapRef = useRef()
  const bottomWrapRef = useRef()
  const TopRef = useRef()
  const refreshDefaultHeight = 49

  const rankTouchStart = useCallback(
    (e) => {
      if (reloadInit === true || window.scrollY !== 0 || formState.pageType === PAGE_TYPE.FAME) return
      touchStartY = e.touches[0].clientY
    },
    [reloadInit, formState]
  )

  const rankTouchMove = useCallback(
    (e) => {
      if (reloadInit === true || window.scrollY !== 0 || formState.pageType === PAGE_TYPE.FAME) return
      const iconWrapNode = iconWrapRef.current
      const refreshIconNode = arrowRefreshRef.current

      touchEndY = e.touches[0].clientY
      const ratio = 3
      const heightDiff = (touchEndY - touchStartY) / ratio
      const heightDiffFixed = 80

      if (window.scrollY === 0 && typeof heightDiff === 'number' && heightDiff > 10) {
        if (heightDiff <= heightDiffFixed) {
          iconWrapNode.style.height = `${refreshDefaultHeight + heightDiff}px`
          refreshIconNode.style.transform = `rotate(${heightDiff * ratio}deg)`
        }
      }
    },
    [reloadInit, formState]
  )

  const rankTouchEnd = useCallback(
    async (e) => {
      if (reloadInit === true || formState.pageType === PAGE_TYPE.FAME) return

      const ratio = 3
      const transitionTime = 150
      const iconWrapNode = iconWrapRef.current
      const refreshIconNode = arrowRefreshRef.current

      const heightDiff = (touchEndY - touchStartY) / ratio
      const heightDiffFixed = 80
      if (heightDiff >= heightDiffFixed) {
        let current_angle = (() => {
          const str_angle = refreshIconNode.style.transform
          let head_slice = str_angle.slice(7)
          let tail_slice = head_slice.slice(0, 3)
          return Number(tail_slice)
        })()

        if (typeof current_angle === 'number') {
          setReloadInit(true)
          iconWrapNode.style.transitionDuration = `${transitionTime}ms`
          iconWrapNode.style.height = `${refreshDefaultHeight + 80}px`

          const loadIntervalId = setInterval(() => {
            if (Math.abs(current_angle) === 360) {
              current_angle = 0
            }
            current_angle += 10
            refreshIconNode.style.transform = `rotate(${current_angle}deg)`
          }, 17)

          if (formState.pageType === PAGE_TYPE.RANKING) {
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
      refreshIconNode.style.transform = 'rotate(0)'
      touchStartY = null
      touchEndY = null
    },
    [reloadInit, formState]
  )

  const promise = new Promise(function (resolve, reject) {
    return resolve()
  })

  const realTimeCheck = useMemo(() => {
    if (convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 0)) {
      return true
    } else {
      return false
    }
  }, [formState])

  //api fetchdata
  const fetchSpecialPoint = async (memNo) => {
    const {data, result, message} = await Api.get_special_point({
      params: {
        memNo: memNo
      }
    })

    if (result === 'success') {
      rankAction.setSpecialPoint(data)
      rankAction.setSpecialPointList(data.list)
    } else {
      //실패
    }
  }

  const specialPop = (memNo) => {
    setPopState(true)
    fetchSpecialPoint(memNo)
  }

  useEffect(() => {
    if (scrollY > 0) {
      window.scrollTo(0, scrollY)
      if (scrollY >= 50) {
        if (fixedWrapRef.current.classList.length === 0) {
          fixedWrapRef.current.className = 'fixed'
        }
        if (bottomWrapRef.current) {
          // bottomWrapRef.current.className = 'bottom'
          if (TopRef.current) {
            bottomWrapRef.current.marginTop = TopRef.current.offsetHeight + 190 + 'px'
          }
        }

        if (listWrapRef.current) {
          if (
            formState[formState.pageType].rankType === RANK_TYPE.DJ ||
            formState[formState.pageType].rankType === RANK_TYPE.FAN
          ) {
            if (context.token.isLogin) {
              if (listWrapRef.current.classList.length === 1) {
                listWrapRef.current.className = 'listFixed more'
              }
            } else {
              if (listWrapRef.current.classList.length === 0) {
                listWrapRef.current.className = 'listFixed'
              }
            }
          } else if (formState[formState.pageType].rankType === RANK_TYPE.SPECIAL) {
            listWrapRef.current.className = 'listFixed special'
          } else {
            listWrapRef.current.className = 'listFixed other'
          }
        }
      } else {
        fixedWrapRef.current.className = ''
        if (listWrapRef.current) {
          if (
            formState[formState.pageType].rankType === RANK_TYPE.DJ ||
            formState[formState.pageType].rankType === RANK_TYPE.FAN
          ) {
            if (context.token.isLogin) {
              listWrapRef.current.className = 'more'
            } else {
              listWrapRef.current.className = ''
            }
          } else if (formState[formState.pageType].rankType === RANK_TYPE.SPECIAL) {
            listWrapRef.current.className = 'special'
          } else {
            listWrapRef.current.className = 'other'
          }
        }
      }
    }

    return () => {
      initial = true
    }
  }, [])

  useEffect(() => {
    let didFetch = false
    let search = location.search
    if (initial && search) {
      const searchRankType = parseInt(search.match(/[1-9]/g)[0])
      const searchDateType = parseInt(search.match(/[1-9]/g)[1])
      let searchCurrentDate = new Date()

      if (searchDateType === DATE_TYPE.WEEK) {
        searchCurrentDate = convertMonday()
      } else if (searchDateType === DATE_TYPE.MONTH) {
        searchCurrentDate = convertMonth()
      }

      // 초기화.
      initial = false

      formDispatch({
        type: 'SEARCH',
        val: {
          rankType: searchRankType,
          dateType: searchDateType,
          currentDate: searchCurrentDate
        }
      })
    } else {
      if (formState[formState.pageType].rankType === RANK_TYPE.SPECIAL) {
        fetchSpecial()
      } else if (formState[formState.pageType].rankType === RANK_TYPE.WEEKLYPICK) {
        fetchWeekly()
      } else if (formState[formState.pageType].rankType === RANK_TYPE.SECOND) {
        fetchSecond()
      } else if (formState[formState.pageType].dateType === DATE_TYPE.TIME) {
        fetchRankTime()
      } else {
        fetchData()
      }

      if (formState[formState.pageType].dateType !== DATE_TYPE.TIME) {
        setRankTimeData({
          prevDate: '',
          nextDate: '',
          rankRound: 0,
          titleText: ''
        })
      }
    }

    async function fetchSpecial() {
      setFetching(true)
      const dateObj = convertSetSpecialDate(formState[formState.pageType].currentDate)
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

    async function fetchWeekly() {
      setFetching(true)
      const res = await Api.getWeeklyList({
        pageNo: formState.page,
        pageCnt: records
      })
      if (res.result === 'success') {
        if (formState.page > 1) {
          setWeeklyList(weeklyList.concat(res.data.list))
        } else {
          setWeeklyList(res.data.list)
        }
        setTotalPage(res.data.paging.totalPage)
        setEmpty(false)
      } else {
        setWeeklyList([])
        setEmpty(true)
      }
      setFetching(false)
    }

    async function fetchSecond() {
      setFetching(true)
      const res = await Api.getSecondList({
        pageNo: formState.page,
        pageCnt: records
      })
      if (res.result === 'success') {
        if (formState.page > 1) {
          setSecondList(secondList.concat(res.data.list))
        } else {
          setSecondList(res.data.list)
        }
        setTotalPage(res.data.paging.totalPage)
        setEmpty(false)
      } else {
        setSecondList([])
        setEmpty(true)
      }
      setFetching(false)
    }

    //////타임랭킹
    async function fetchRankTime() {
      setFetching(true)

      const res = await Api.getRankTimeList({
        rankSlct: formState[formState.pageType].rankType,
        page: formState.page,
        records: records,
        rankingDate: convertDateTimeForamt(formState[formState.pageType].currentDate, '-')
      })

      if (res.result === 'success') {
        setRankTimeData({
          ...rankTimeData,
          ...res.data
        })
        if (formState.page > 1) {
          setRankList(rankList.concat(res.data.list))
        } else {
          if (formState.page > 1) {
            setRankList(rankList.concat(res.data.list))
            setEmpty(false)
          } else {
            if (res.data.list.length < 6) {
              setEmpty(true)
            } else {
              setEmpty(false)
              setRankList(res.data.list)
            }
          }
          setLevelList([])
          setLikeList([])
          setTotalPage(res.data.paging.totalPage)
          setMyInfo({
            myInfo,
            ...res.data
          })
          console.log(setTotalPage)
        }
      } else {
        setRankList([])
        setEmpty(true)
      }
      setFetching(false)
    }

    async function fetchData() {
      if (!didFetch) {
        if (formState[formState.pageType].rankType === RANK_TYPE.LEVEL) {
          if (levelList.length > 0) {
            if (formState.page > 1) {
              const length = (formState.page - 1) * records
              if (levelList.length > length) {
                return
              }
            }
          }
        }
        if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
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
        const formatDate = convertDateFormat(formState[formState.pageType].currentDate, '-')

        const res = await Api.getRankList({
          rankSlct: formState[formState.pageType].rankType,
          rankType: formState[formState.pageType].dateType,
          page: formState.page,
          records: records,
          rankingDate: formatDate,
          type: formState[formState.pageType].rankType === RANK_TYPE.LEVEL ? 'level' : 'page'
        })
        if (res.result === 'success' && res.data.list instanceof Array) {
          if (res.data.list.length > 0) {
            if (formState[formState.pageType].rankType === RANK_TYPE.LEVEL) {
              // level
              if (formState.page > 1) {
                setLevelList(levelList.concat(res.data.list))
              } else {
                setLevelList(res.data.list)
              }
              setRankList([])
              setLikeList([])
              setTotalPage(res.data.paging.totalPage)
              setEmpty(false)
            } else {
              // dj, fan, like
              if (formState.page > 1) {
                setRankList(rankList.concat(res.data.list))
                setEmpty(false)
              } else {
                if (res.data.list.length < 6) {
                  setEmpty(true)
                } else {
                  setEmpty(false)
                  setRankList(res.data.list)
                }
              }
              setLevelList([])
              setLikeList([])
              setTotalPage(res.data.paging.totalPage)
              setMyInfo({
                myInfo,
                ...res.data
              })
            }
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
      }
    }

    return () => {
      didFetch = true
    }
  }, [formState, context.token.isLogin])

  useEffect(() => {
    let didFetch = false
    const windowScrollEvent = () => {
      // console.log(window.scrollY)
      let scroll = window.scrollY || window.pageYOffset
      if (scroll >= 50) {
        if (fixedWrapRef.current.classList.length === 0) {
          fixedWrapRef.current.className = 'fixed'
        }

        if (bottomWrapRef.current) {
          // bottomWrapRef.current.className = 'bottom'
          if (formState[formState.pageType].rankType === RANK_TYPE.SPECIAL) {
            bottomWrapRef.current.style.marginTop = '104px'
          }
          if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
            bottomWrapRef.current.style.marginTop = '140px'
          }
          if (formState[formState.pageType].rankType === RANK_TYPE.LEVEL) {
            bottomWrapRef.current.style.marginTop = '48px'
          } else {
            if (TopRef.current) {
              bottomWrapRef.current.style.marginTop = TopRef.current.offsetHeight + 140 + 'px'
            }
          }
        }
        if (listWrapRef.current) {
          if (
            formState[formState.pageType].rankType === RANK_TYPE.DJ ||
            formState[formState.pageType].rankType === RANK_TYPE.FAN
          ) {
            if (context.token.isLogin) {
              listWrapRef.current.className = 'listFixed more'
            } else {
              listWrapRef.current.className = 'listFixed'
            }
            // if (TopRef.current) console.log()
            // listWrapRef.current.style.marginTop = 190 + TopRef.current.offsetHeight + 'px'
          } else if (formState[formState.pageType].rankType === RANK_TYPE.SPECIAL) {
            listWrapRef.current.className = 'listFixed special'
          } else {
            listWrapRef.current.className = 'listFixed other'
          }
        }
      } else {
        if (bottomWrapRef.current) {
          fixedWrapRef.current.className = ''
          bottomWrapRef.current.className = ''
          bottomWrapRef.current.style.marginTop = '0'
          if (listWrapRef.current) {
            if (
              formState[formState.pageType].rankType === RANK_TYPE.DJ ||
              formState[formState.pageType].rankType === RANK_TYPE.FAN
            ) {
              if (context.token.isLogin) {
                listWrapRef.current.className = 'more'
              } else {
                listWrapRef.current.className = ''
              }
            } else if (formState[formState.pageType].rankType === RANK_TYPE.SPECIAL) {
              listWrapRef.current.className = 'special'
            } else {
              listWrapRef.current.className = 'other'
            }
          }
        } else {
          return null
        }
      }
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(function () {
        //스크롤
        setScrollY(window.scrollY)
        const diff = document.body.scrollHeight / (formState.page + 1)

        if (document.body.scrollHeight <= window.scrollY + window.innerHeight + diff) {
          if (!fetching) {
            if (!didFetch) {
              if (totalPage > formState.page) {
                if (
                  formState[formState.pageType].rankType === RANK_TYPE.DJ ||
                  formState[formState.pageType].rankType === RANK_TYPE.FAN
                ) {
                  if (
                    (formState.page < 20 &&
                      (formState[formState.pageType].dateType === DATE_TYPE.DAY ||
                        formState[formState.pageType].dateType === DATE_TYPE.WEEK ||
                        formState[formState.pageType].dateType === DATE_TYPE.TIME)) ||
                    (formState.page < 40 && formState[formState.pageType].dateType === DATE_TYPE.MONTH) ||
                    (formState.page < 60 && formState[formState.pageType].dateType === DATE_TYPE.YEAR)
                  ) {
                    formDispatch({
                      type: 'PAGE'
                    })
                  }
                } else if (
                  formState[formState.pageType].rankType === RANK_TYPE.LEVEL ||
                  formState[formState.pageType].rankType === RANK_TYPE.LIKE
                ) {
                  if (formState.page < 4) {
                    formDispatch({
                      type: 'PAGE'
                    })
                  }
                } else {
                  formDispatch({
                    type: 'PAGE'
                  })
                }
              }
            }
          }
        }
      }, 50)
    }

    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
      didFetch = true
    }
  }, [formState, totalPage, fetching])

  return (
    <Layout status={'no_gnb'}>
      <div id="ranking-page" onTouchStart={rankTouchStart} onTouchMove={rankTouchMove} onTouchEnd={rankTouchEnd}>
        <Header type="noBack">
          <h2 className="header-title">{formState.pageType === PAGE_TYPE.RANKING ? '랭킹' : '명예의 전당'}</h2>
          {formState.pageType === PAGE_TYPE.RANKING && (
            <div
              className="benefitSize"
              onClick={() => {
                setRankTimeData({
                  prevDate: '',
                  nextDate: '',
                  rankRound: 0,
                  titleText: ''
                })
                history.push({
                  pathname: `/rank/benefit`,
                  state: {
                    tabType: formState[PAGE_TYPE.RANKING].rankType
                  }
                })
              }}>
              <img src={benefitIcon} width={60} alt="혜택" />
            </div>
          )}
          {formState.pageType === PAGE_TYPE.RANKING ? (
            <div
              className="hallOfFame"
              onClick={() => {
                setRankTimeData({
                  prevDate: '',
                  nextDate: '',
                  rankRound: 0,
                  titleText: ''
                })
                formDispatch({
                  type: 'PAGE_TYPE',
                  val: PAGE_TYPE.FAME
                })
              }}>
              <img src={hallOfFameIcon}></img>
            </div>
          ) : (
            <div
              className="hallOfFame"
              onClick={() => {
                setRankTimeData({
                  prevDate: '',
                  nextDate: '',
                  rankRound: 0,
                  titleText: ''
                })
                formDispatch({
                  type: 'PAGE_TYPE',
                  val: PAGE_TYPE.RANKING
                })
              }}>
              <img src={rankingPageIcon}></img>
            </div>
          )}
        </Header>
        <div className="refresh-wrap rank" ref={iconWrapRef}>
          <div className="icon-wrap">
            <img className="arrow-refresh-icon" src={arrowRefreshIcon} ref={arrowRefreshRef} />
          </div>
        </div>
        <div ref={fixedWrapRef}>
          <div className="rankTopBox">
            <RankBtnWrap fetching={fetching} />
            {/* <div className="rankTopBox__update">{formState[formState.pageType].rankType !== 3 && formState[formState.pageType].rankType !== 4 && `${realTime()}`}</div> */}
          </div>
          {formState.pageType === PAGE_TYPE.RANKING && (
            <>
              <RankDateBtn fetching={fetching} />
              <RankHandleDateBtn fetching={fetching} />
            </>
          )}
          {formState.pageType === PAGE_TYPE.FAME && formState[formState.pageType].rankType === RANK_TYPE.SPECIAL && (
            <SpecialHistoryHandle fetching={fetching} />
          )}
        </div>

        {popState && <SpecialPointPop setPopState={setPopState} />}

        {(formState[formState.pageType].rankType === RANK_TYPE.FAN ||
          formState[formState.pageType].rankType === RANK_TYPE.DJ) && (
          <div ref={listWrapRef}>
            {empty === true ? (
              <NoResult type="default" text="조회 된 결과가 없습니다." />
            ) : (
              <div className={`rankTop3Box`} ref={TopRef}>
                <MyProfile fetching={fetching} />
                <RankListTop specialPop={specialPop} />
                {/* {!convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 0) && (
                  <RankListTop specialPop={specialPop} />
                )} */}
              </div>
            )}
          </div>
        )}

        {formState[formState.pageType].rankType === RANK_TYPE.LEVEL && (
          <div ref={bottomWrapRef} className="other">
            <LevelListWrap empty={empty} />
          </div>
        )}
        {formState[formState.pageType].rankType === RANK_TYPE.LIKE && (
          <div ref={bottomWrapRef} className="other">
            <LikeListWrap empty={empty} />
          </div>
        )}

        {formState[formState.pageType].rankType === RANK_TYPE.WEEKLYPICK && (
          <div ref={bottomWrapRef} className="other">
            <WeeklyPickWrap empty={empty} />
          </div>
        )}

        {formState[formState.pageType].rankType === RANK_TYPE.SECOND && (
          <div ref={bottomWrapRef} className="other">
            <SecondWrap empty={empty} />
          </div>
        )}

        {empty === true
          ? ''
          : (formState[formState.pageType].rankType === RANK_TYPE.FAN ||
              formState[formState.pageType].rankType === RANK_TYPE.DJ) && (
              <div ref={bottomWrapRef}>
                <RankListWrap empty={empty} />
              </div>
            )}

        {formState[formState.pageType].rankType === RANK_TYPE.SPECIAL && (
          <div ref={bottomWrapRef} className="special">
            <SpecialListWrap empty={empty} fetching={fetching} />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default React.memo(Ranking)
