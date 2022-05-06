import React, {useContext, useEffect} from 'react'
import Swiper from 'react-id-swiper'

// global components
import ListColumn from 'components/ui/listColumn/ListColumn'
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
import {useHistory} from "react-router-dom";
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useDispatch, useSelector} from "react-redux";

const PrevMainSlide = (props) => {
  const {data, swiperRefresh, pullToRefreshPause} = props

  const history = useHistory();
  const dispatch = useDispatch();
  const common = useSelector(state => state.common);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const swiperParams = {
    loop: true,
    speed: 700,
    autoplay: {
      delay: 7000,
      disableOnInteraction: false
    },
    parallax: true,
    on:{
      click: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const target = data[parseInt(this.realIndex)];
        if(target.nickNm === 'banner' && target.roomType === 'link') {
          history.push(target.roomNo);
        }else {
          RoomValidateFromClipMemNo(target.roomNo, target.memNo, dispatch, globalState, history, target.nickNm); // 방송방으로 이동
        }
      },
    }
  }

  useEffect(() => {
    if((common.isRefresh || !pullToRefreshPause) && data.length > 0) { // refresh 될때 슬라이드 1번으로
      swiperRefresh();
    }
  }, [common.isRefresh, pullToRefreshPause]);


  return (
    <>
      {data.length > 0 ?
        <Swiper {...swiperParams}>
          {data.map((list, index) => {
            return (
              <div key={index}>
                {list.bannerUrl && list.nickNm === "banner" && list.roomType === 'link' ?
                  <ListColumn photo={list.profImg.thumb700x700} index={index} />
                  :
                  <ListColumn photo={list.profImg.thumb700x700} index={index}>
                    <div className='info'>
                      <div className='animation' data-swiper-parallax="-100" >
                        <div className="badgeGroup">
                          <BadgeItems data={list} type='isBadge' />
                        </div>
                        <span className="title">{list.title}</span>
                        <span className="nick">{list.nickNm}</span>
                      </div>
                    </div>
                  </ListColumn>
                }
              </div>
            )
          })}
        </Swiper>
        :
        <div className="empty" />
      }
    </>
  )
}

export default PrevMainSlide
