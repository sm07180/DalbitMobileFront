import React, {useContext, useEffect, useState} from 'react'

import Swiper from 'react-id-swiper'

import './showSwiper.scss'
import {isAndroid} from "context/hybrid";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxBackEventCallback, setGlobalCtxBackFunction, setGlobalCtxBackState} from "redux/actions/globalCtx";

const ShowSwiper = (props) => {
  const {imageList, popClose, imageKeyName, imageParam, initialSlide,
    showTopOptionSection, readerButtonAction, deleteButtonAction, swiperParam} = props
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [swiper, setSwiper] = useState();

  const swiperParams = {
    slidesPerView: 'auto',
    // slideClass: '',
    pagination: {
      el: '.showSwiper-pagination',
      type: 'fraction'
    },
    on: {
      init: function(){
        setSwiper(this);
      }
    },
    ...swiperParam
  }

  const clickPopClose = (e) => {
    const target = e.target
    if (target.className === 'popClose') {
      popClose(false)
    }
  }

  useEffect(() => {
    if (imageList.length > 1) {
      const swiper = document.querySelector('#popShowSwiper .swiper-container')?.swiper;
      swiper?.update();
      if(!swiperParam?.initialSlide) {  //initSlide 옵션이 있으면 슬라이드 이동 안함
        swiper?.slideTo(initialSlide);
      }
    }
  }, [imageList]);

  /* 안드로이드 물리 백버튼시 감지용 */
  useEffect(() => {
    if(isAndroid()) {
      dispatch(setGlobalCtxBackState(true))
      dispatch(setGlobalCtxBackFunction({name: 'callback'}))
      dispatch(setGlobalCtxBackEventCallback(() => {
        popClose(false)
      }));
    }

    return () => {
      if (isAndroid()) {
        if (globalState.backFunction.name.length === 1) {
          dispatch(setGlobalCtxBackState(null))
        }
        dispatch(setGlobalCtxBackFunction({name: ''}))
        dispatch(setGlobalCtxBackEventCallback(null));
      }
    }
  },[]);

  return (
    <div id="popShowSwiper">
      <div className="showWrapper">
        {showTopOptionSection &&
        <div className="buttonGroup">
          <button onClick={() => readerButtonAction(imageList[imageList.length>1 ? swiper?.activeIndex: 0]?.idx) }>대표 사진</button>
          <button onClick={() => deleteButtonAction(imageList[imageList.length>1 ? swiper?.activeIndex: 0]?.idx) }>삭제</button>
        </div>
        }
        {imageList.length > 1 ?
          <Swiper {...swiperParams}>
            {imageList.map((item, index) => {
              return (
                <div key={index}>
                  {/*프로필 편집에서 사용하는 영역*/}
                  <div className="photo">
                    <img src={`${item[imageKeyName]}${imageParam}`} alt="" />
                  </div>
                </div>
              )
            })}
          </Swiper>
          : imageList.length === 1 &&
          (
            <div>
              <div className="photo">
                <img src={`${imageList[0][imageKeyName]}${imageParam}`} alt="" />
              </div>
            </div>
          )
        }
        <button className='popClose' onClick={clickPopClose} />
      </div>
    </div>
  )
}

export default ShowSwiper

ShowSwiper.defaultProps = {
  imageKeyName: 'thumb500x500', //imageList 500x500이 없으면 이 값으로 사용 ex) 'url', 'thumb700x500'
  imageParam: '', //이미지 주소 비율 파라미터 ex) ?500x500
  initialSlide : 0,
  showTopOptionSection: false, // 대표 이미지버튼, 삭제 버튼 노출 여부
  readerButtonAction: ()=>{}, // 대표 이미지 버튼 클릭이벤트
  deleteButtonAction: ()=>{}, // 삭제 이미지 버튼 클릭이벤트
  swiperParam: {}
}
