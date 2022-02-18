import React, {useEffect, useContext, useCallback, useState, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import {Context} from 'context'
import {KnowHowContext} from '../store'
import Api from 'context/api'

import Header from 'components/ui/new_header'

import Swiper from 'react-id-swiper'

import PcIcon from '../static/pc_yellow.svg'
import MobileIcon from '../static/mobile_b.svg'
import LevelIcon from '../static/level_g_s.svg'
import LikeIcon from '../static/like_g_s.svg'
import LikeRedIcon from '../static/like_red_s.svg'
import ViewIcon from '../static/view_g_s.svg'
import MoreIcon from '../static/morelist_g.svg'
import LikeOffIcon from '../static/like_g_m.svg'
import LikeOnIcon from '../static/like_red_m.svg'
import GridIcon from '../static/grid_w_s.svg'
import CloseIcon from '../static/close.svg'
function AttendDetail() {
  const history = useHistory()
  const params = useParams()

  const context = useContext(Context)
  const {KnowHowState, KnowHowAction} = useContext(KnowHowContext)

  const {list, order, condition} = KnowHowState

  const setList = KnowHowAction.setList
  const setMyCnt = KnowHowAction.setMyCnt
  const setMine = KnowHowAction.setMine

  const [detail, setDetail] = useState({})
  const [imgList, setImgList] = useState([])
  const [swiper, setSwiper] = useState(null)
  const [activeIndex, setAciveIndex] = useState(1)
  const SwiperWrapRef = useRef(null)
  const [catching, setCatching] = useState(false)
  const [isLike, setIsLike] = useState(false)
  const [goodCnt, setGoodCnt] = useState(0)
  const [more, setMore] = useState(false)
  const [isAdmin, setIsAdmin] = useState(0)

  const swiperParamas = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    getSwiper: (val) => {
      setSwiper(val)
    },
    on: {
      slideChange: function () {
        setAciveIndex(this.realIndex + 1)
      }
    }
  }

  const goNext = (e) => {
    swiper.slideNext()
  }

  const goPrev = (e) => {
    swiper.slidePrev()
  }

  const fetchData = useCallback(async () => {
    const res = await Api.knowhow_detail({
      idx: params.num,
      is_detail: 1
    })

    if (res.result === 'success') {
      setDetail(res.data.detail)
      setGoodCnt(res.data.detail.good_cnt)
      setIsLike(res.data.detail.is_good === 0 ? false : true)
      setIsAdmin(res.data.isAdmin)
      let arr = [res.data.detail.image_url, res.data.detail.image_url2, res.data.detail.image_url3]

      const detailIdx = list.findIndex((v) => {
        return v.idx === res.data.detail.idx
      })

      if (detailIdx !== -1) {
        list[detailIdx].view_cnt++
        setList(list)
      }

      setImgList(
        arr.filter((v) => {
          return v
        })
      )
    } else {
      context.action.alert({
        msg: '조회에 실패했습니다.',
        callback: () => {
          history.goBack()
        }
      })
    }
  }, [])

  const updateLike = useCallback(async () => {
    const res = await Api.knowhow_like({
      event_idx: detail.event_idx,
      add_idx: detail.idx
    })

    if (res.result === 'success') {
      setGoodCnt(res.data.good_cnt)
      setIsLike(!isLike)

      const findIndex = list.findIndex((v) => {
        return v.idx === detail.idx
      })
      if (findIndex !== -1) {
        list[findIndex].good_cnt = res.data.good_cnt
        list[findIndex].is_good = list[findIndex].is_good === 0 ? 1 : 0
        setList(list)
      }
    }
  }, [isLike, detail])

  const deleteKnowhow = useCallback(() => {
    context.action.confirm({
      msg: '노하우를 정말 삭제하시겠습니까?',
      callback: async () => {
        const res = await Api.knowhow_delete({
          idx: detail.idx
        })

        if (res.result === 'success') {
          setTimeout(() => {
            context.action.alert({
              msg: '삭제가 완료 되었습니다.',
              callback: async () => {
                if (
                  list.filter((v) => {
                    if (v.idx !== detail.idx) {
                      return v
                    }
                  }).length === 0
                ) {
                  const res = await Api.knowhow_list({
                    page: 1,
                    records: 10000,
                    slct_type: 0,
                    slct_platform: condition,
                    slct_order: order
                  })

                  if (res.result === 'success') {
                    setMine(0)
                    setList(res.data.list)
                    setMyCnt(res.data.myCnt)
                  }
                } else {
                  setList(
                    list.filter((v) => {
                      if (v.idx !== detail.idx) {
                        return v
                      }
                    })
                  )
                }
                history.goBack()
              }
            })
          })
        } else {
        }
      }
    })
  }, [detail, condition, order])

  const MakeImgSlider = () => {
    return (
      <>
        <Swiper {...swiperParamas}>
          {imgList.map((v, idx) => {
            return <img src={v} key={idx} />
          })}
        </Swiper>
        <button
          className={`attendDetailWrap__imgSlider--prev ${activeIndex === 1 && 'blind'}`}
          onClick={(e) => {
            goPrev(e)
            e.stopPropagation
          }}>
          {/*  */}
        </button>
        <button
          className={`attendDetailWrap__imgSlider--next ${activeIndex === imgList.length && 'blind'}`}
          onClick={(e) => {
            goNext(e)
          }}></button>
        <div className="attendDetailWrap__imgSlider--index">
          <img src={GridIcon} />
          {activeIndex}/{imgList.length}
        </div>
      </>
    )
  }

  useEffect(() => {
    if (swiper) {
      setAciveIndex(swiper.realIndex + 1)
    }
  }, [catching])

  useEffect(() => {
    if (params instanceof Object && params.num) {
      fetchData()

      if (SwiperWrapRef.current) {
        SwiperWrapRef.current.style.height = SwiperWrapRef.current.offsetWidth + 'px'
      }
    } else {
      history.goBack()
    }
  }, [])
  return (
    <div className="attendDetailWrap">
      <Header title={'방송 노하우 상세 보기'} />
      <div className="attendDetailWrap__contents">
        <div className="attendDetailWrap__header">
          <img
            src={detail.profImg && detail.profImg.url}
            onClick={() => {
              if (context.token.isLogin) {
                if (context.token.memNo === detail.mem_no) {
                  history.push('/myProfile')
                } else {
                  history.push(`/profile/${detail.mem_no}`)
                }
              } else {
                history.push('/login')
              }
            }}
          />
          <div className="attendDetailWrap__header--center">
            <div className="attendDetailWrap__header--nick">
              <img src={detail.slct_device === '1' || detail.slct_device === '2' ? PcIcon : MobileIcon} />
              <span>{detail.mem_nick}</span>
            </div>
            <div className="attendDetailWrap__header--icons">
              <span>
                <img src={LevelIcon} />
                {detail.level}
              </span>
              <span>
                <img src={ViewIcon} />
                {detail.view_cnt}
              </span>
              {isLike === false ? (
                <span>
                  <img src={LikeIcon} />
                  {goodCnt}
                </span>
              ) : (
                <span className="red">
                  <img src={LikeRedIcon} />
                  {goodCnt}
                </span>
              )}
            </div>
          </div>
          <div className="attendDetailWrap__header--other">
            <img
              src={isLike === false ? LikeOffIcon : LikeOnIcon}
              onClick={() => {
                if (context.token.isLogin) updateLike()
                else history.push('/login')
              }}
            />
            {context.token.isLogin && context.token.memNo === detail.mem_no && (
              <img
                src={MoreIcon}
                onClick={() => {
                  setMore(!more)
                }}
              />
            )}
            {context.token.isLogin && isAdmin === 1 && (
              <img
                src={CloseIcon}
                onClick={(e) => {
                  e.stopPropagation()
                  deleteKnowhow()
                }}
              />
            )}
          </div>
          {more && (
            <div className="attendDetailWrap__header--more">
              <p
                onClick={(e) => {
                  e.stopPropagation()
                  history.push(`/event_knowHow/add/${detail.idx}`)
                }}>
                수정하기
              </p>
              <p
                onClick={(e) => {
                  e.stopPropagation()
                  deleteKnowhow()
                }}>
                삭제하기
              </p>
            </div>
          )}
        </div>
        <div className="attendDetailWrap__title">
          <p>{detail.title}</p>
          <p className="attendDetailWrap__title--date">{detail.reg_date}</p>
        </div>
        <div className="attendDetailWrap__system">
          <span className="attendDetailWrap__system--title">나의 방송 시스템</span>
          <div className="attendDetailWrap__system--wrap">
            <span className="attendDetailWrap__system--type purple">디바이스</span>
            <span className="attendDetailWrap__system--value">
              {detail.slct_device === '1'
                ? '데스크탑'
                : detail.slct_device === '2'
                ? '노트북/맥북'
                : detail.slct_device === '3'
                ? '안드로이드폰'
                : detail.slct_device === '4'
                ? '아이폰'
                : '태블릿'}
            </span>
          </div>
          <div className="attendDetailWrap__system--wrap">
            <span className="attendDetailWrap__system--type">{detail.slct_device === '1' ? '마이크' : '기종'}</span>
            <span className="attendDetailWrap__system--value">{detail.device1}</span>
          </div>
          {detail.device2 !== '' && (
            <div className="attendDetailWrap__system--wrap">
              <span className="attendDetailWrap__system--type">{detail.slct_device === '1' ? '믹서/오인페' : '외부 스피커'}</span>
              <span className="attendDetailWrap__system--value">{detail.device2}</span>
            </div>
          )}
        </div>
        <div className="attendDetailWrap__imgSlider" ref={SwiperWrapRef}>
          {imgList.length > 0 && MakeImgSlider()}
        </div>
        <p className="attendDetailWrap__content">{detail.contents}</p>
      </div>
    </div>
  )
}

export default React.memo(AttendDetail)
