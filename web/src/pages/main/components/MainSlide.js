import React, {useEffect, useState} from 'react';

import Api from 'context/api';
import Swiper from 'react-id-swiper';
// global components
import ListColumn from '../../../components/ui/listColumn/ListColumn';
import BadgeItems from '../../../components/ui/badgeItems/BadgeItems';
import photoCommon from "common/utility/photoCommon";

import {useHistory} from "react-router-dom";
import {RoomValidateFromClipMemNo} from "common/audio/clip_func";
import {useDispatch, useSelector} from "react-redux";

const MainSlide = (props) => {
  const {data, swiperRefresh, pullToRefreshPause} = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const common = useSelector(state => state.common);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [swiperList, setSwiperList] =  useState({photoSvrUrl: "", swiperList: []});

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

        const target = swiperList.swiperList[parseInt(this.realIndex)];
        if(target.idx > 0) {
          history.push(target.linkUrl);
        }else {
          if (target.room_no === "0") {
            goProfile(target.mem_no);
          } else {
            RoomValidateFromClipMemNo(target.room_no, target.mem_no, dispatch, globalState, history, target.mem_nick); // 방송방으로 이동
          }
        }
      },
    }
  }

  useEffect(() => {
    Api.getBannerList().then(res => {
      if (res.result === "success"){
        setSwiperList({photoSvrUrl: res.data.photoSvrUrl, swiperList: res.data.swiperList});
      }
    });
  }, []);

  useEffect(() => {
    if(common.isRefresh || !pullToRefreshPause) { // refresh 될때 슬라이드 1번으로
      swiperRefresh();
    }
  }, [common.isRefresh, pullToRefreshPause]);

  // 프로필 이동
  const goProfile = (memNo) => {
    if (memNo !== undefined && memNo > 0) history.push(`/profile/${memNo}`)
  }

  return (
    <>
      {swiperList.swiperList.length > 0 ?
        <Swiper {...swiperParams}>
          {swiperList.swiperList.map((list, index) => {
            return (
              <div key={index}>
                {list.idx > 0 ?
                  <ListColumn photo={list.image_profile} index={index}/>
                  :
                  <ListColumn photo={photoCommon.getPhotoUrl(swiperList.photoSvrUrl, list.image_profile, "700X700")} index={index}>
                    <div className='info'>
                      <div className='animation' data-swiper-parallax="-100" >
                        <div className="badgeGroup">
                          <BadgeItems data={list} type='isBadge' />
                        </div>
                        <span className="title">{list.title}</span>
                        <span className="nick">{list.mem_nick}</span>
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

export default MainSlide;
