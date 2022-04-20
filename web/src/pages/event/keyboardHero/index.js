import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import Swiper from 'react-id-swiper'
import {IMG_SERVER} from 'context/config'
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
import Api from "context/api";
import './style.scss'
import {Context} from "context";

const keyboardHero = () => {
  const history = useHistory()
  const context = useContext(Context)

  const swiperParams = {
    loop: true,
    direction: 'vertical',
    slidesPerColumnFill: 'row',
    slidesPerView: 2,
    autoplay: {
      delay: 2500
    }
  }

  //오늘의 당첨자 List State
  const [list, setList] = useState([]);

  //오늘의 당첨자 API
  useEffect(()=>{
    Api.keyboardHero({
      reqBody: false,
      params: {memNo: context.profile.memNo ? context.profile.memNo : "0", pageNo: 1, pagePerCnt: 1000},
      method: 'GET'
    }).then((res)=>{
      setList(res.data);
    })
  },[]);

  const imageNum = (preCode) => {
    switch (preCode){
      case "r01":
        return "1"    //10달
      case "r02":
        return "2"    //50달
      case "r03":
        return "3"    //100달
      case "k01":
        return "4"    //스타벅스 아메리카노
      case "k02":
        return "5"    //GS25 교환권 5000원
      case "k04":
        return "6"    //네이버페이 1만원 포인트
      case "k03":
        return "7"    //맘스터치 싸이버거 세트
      case "k05":
        return "8"    //배스킨라빈스31 2만원 교환권
    }
  }

  return (
    <div id="keyboardHero">
      <Header title="키보드 히어로 31" type="back"/>
      <img src={`${IMG_SERVER}/event/keyboardHero/mainTop.png`} alt="키보드 히어로 31" />
      <section className="winningWrap">
        <div className="winningBox">
          <div className="title">
            <img src={`${IMG_SERVER}/event/keyboardHero/todayWinningTitle.png`} alt="오늘의 당첨자" />
          </div>
          <div className="content">
            {(list && list.length > 0) ?
              <>
                <div className="welcome">축하드립니다!</div>
                <Swiper {...swiperParams}>
                  {list.map((data, index)=>{
                    let giftImg = `https://image.dalbitlive.com/event/keyboardHero/present-${imageNum(data.pre_code)}.png`;
                    return(
                      <div key={index}>
                        <ListRow photo={giftImg} key={index}>
                          <div className="listContent">
                            <div className="present">{data.code_name}</div>
                            <div className="nick">{data.mem_nick}</div>
                          </div>
                        </ListRow>
                      </div>
                    )
                  })}
                </Swiper>
                <button onClick={() => {history.push('/event/keyboardhero_todaywinning')}}>
                  <img src={`${IMG_SERVER}/event/keyboardHero/todayWinningButton.png`} alt="당첨자보기 및 선물받기" className="listMore"/>
                </button>
              </>
              :
              <img src={`${IMG_SERVER}/event/keyboardHero/listNone.png`} alt="아직 당첨자가 없어요!" />
            }
          </div>
        </div>
      </section>
      <section className="contentWrap">
        <img src={`${IMG_SERVER}/event/keyboardHero/mainContent.png`}  alt="메인콘텐츠"/>
      </section>
      <section className="noticeWrap">
        <img src={`${IMG_SERVER}/event/keyboardHero/notice.png`} alt="주의사항"/>
      </section>
    </div>
  );
};

export default keyboardHero;