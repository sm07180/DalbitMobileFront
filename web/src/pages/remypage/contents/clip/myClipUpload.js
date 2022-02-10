import React, {useState} from 'react'

import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import Swiper from 'react-id-swiper'

const uploadTab = ['마이 클립','청취 회원','좋아요 회원','선물한 회원']

const MyClipUpload =()=>{
  const [uploadType, setUploadType] = useState(uploadTab[0])
  const [morePop, setMorePop] = useState(false)
  
  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  }

  const openMorePop = () =>{
    setMorePop(!morePop)
  }

  const TotalWrap =()=>{
    switch(uploadType){
      case '마이 클립':
       return(
        <div className='total'>
          <div className="title">내가 등록한 클립:</div>
          <span className="count">0건</span>
        </div>
       )
      case '청취 회원':
        return(
          <div className='total'>
            <img src="https://image.dalbitlive.com/mypage/dalla/clip/ico_listener.png" className="icon" />
            <div className="title">최근 <span>3개월</span> 내 클립 청취 회원:</div>
            <span className="count">0명</span>
          </div>
        )
      case '좋아요 회원':
        return(
          <div className='total'>
            <img src="https://image.dalbitlive.com/mypage/dalla/clip/ico_heart.png" className="icon" />
            <div className="title">최근 <span>3개월</span> 내 클립 좋아요한 회원:</div>
            <span className="count">0명</span>
          </div>
        )
      case '선물한 회원':
        return(
          <div className='total'>
            <img src="https://image.dalbitlive.com/mypage/dalla/clip/ico_present.png" className="icon" />
            <div className="title">최근 <span>3개월</span> 내 클립 선물한 회원:</div>
            <span className="count">0명</span>
          </div>
        )
      default:
        return(
          <div className='total'>
            <div className="title">내가 등록한 클립:</div>
            <span className="count">0건</span>
          </div>
        )
    }
  }

  return(
    <>
      <ul className="tabmenu">
        {uploadTab.length > 0 && 
          <Swiper {...swiperParams}>
            {uploadTab.map((data, index)=>{
              const param ={
                item: data,
                tab: uploadType,
                setTab: setUploadType,
              }
              return(
                <div key={index}>
                  <TabBtn param={param} />
                </div>
              )
            })}
          </Swiper>
        }
      </ul>
      <section className="totalWrap">
        <div className='total'>
          <TotalWrap />
        </div>
      </section>
      <section className="listWrap">
          <ListRow>
            <div className="listInfo">
              <div className="listItem">
                <span className="title">창모 - 아름다워 (piano ver.)</span>
              </div>
              <div className="listItem">
                <GenderItems />
                <span className="nickNm">커버를 잘하는 달러</span>
              </div>
              <div className="listItem">
                <DataCnt type={"listenerCnt"} value={"123"}/>
                <DataCnt type={"presentCnt"} value={"123"}/>
                <DataCnt type={"replyCnt"} value={"123"}/>
                <DataCnt type={"goodCnt"} value={"123"}/>
              </div>
            </div>
            {uploadType === uploadTab[0] && 
              <div className="moreBtn" onClick={openMorePop}>
                {morePop && <div>비공개</div>}
              </div>
            }
          </ListRow>
          <div className="empty">
            <p>등록된 클립이 없어요<br/>클립을 업로드 해보세요!</p>
            <button>클립 업로드</button>
          </div>
        </section>
    </>
  )
}

export default MyClipUpload