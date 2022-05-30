import React, {useEffect, useState, useContext} from 'react'

// global components
import Swiper from 'react-id-swiper'
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// components
import FilterBtn from './FilterBtn'

import '../scss/clipDetail.scss'

const clipTitle = ['전체보기','최근 들은 클립','좋아요한 클립']
const clipTabmenu = ['ALL','커버/노래','작사/작곡','힐링','수다/대화','ASMR','고민/사연','성우','더빙']
const filterAlignList = ['인기순','최신순','좋아요 많은 순','재생 많은 순','받은 선물 순',]
const filterDateList = ['전체기간','최근 7일','오늘']

const ClipDetail = (props) => {
  const {data} = props
  const [clipType, setClipType] = useState(clipTabmenu[0])
  const [likeOnoff, setLikeOnoff] = useState(false)

  const clickLikeOnoff = () => {
    setLikeOnoff(!likeOnoff)
  }

  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  }

  return (
    <div id="clipDetail">
      <Header title={`${clipTitle[0]}`} type={'back'} />
      <section className="filterWrap">
        <div className="tabmenu">
          {clipTabmenu && clipTabmenu.length > 0 &&
            <Swiper {...swiperParams}>
              {clipTabmenu.map((data, index)=>{
                const param ={
                  item: data,
                  tab: clipType,
                  setTab: setClipType,
                  // setPage: setPage
                }
                return(
                  <ul key={index}>
                    <TabBtn param={param} />
                  </ul>
                )
              })}
            </Swiper>
          }
        </div>
        {clipType === clipTabmenu[0] && 
          <div className="filterGroup">
            <FilterBtn data={filterAlignList} />
            <FilterBtn data={filterDateList} />
          </div>
        }
      </section>
      <section className="detailList">
        {data.map((list,index) => {
          return (
            <ListRow photo={list.bgImg.thumb292x292} key={index}>
              <div className="listInfo">
                <div className="listItem">
                  <span className="title">{list.title}</span>
                </div>
                <div className="listItem">
                  {list.gender === 'n' ? <></> :<GenderItems data={list.gender} size={18} />}
                  <span className="nickNm">{list.nickName}</span>
                </div>
                <div className="listItem">
                  <DataCnt type={"replyCnt"} value={list.replyCnt ? list.replyCnt : "123"}/>
                  <DataCnt type={"goodCnt"} value={list.goodCnt ? list.replyCnt : "123"}/>
                </div>
              </div>
              <button className="heart" onClick={clickLikeOnoff}>
                {likeOnoff === false ? 
                  <img src="https://image.dallalive.com/clip/dalla/heartOff.png" />
                  :
                  <img src="https://image.dallalive.com/clip/dalla/heartOn.png" />
                }
              </button>
              <button className="trash">
                <img src="https://image.dallalive.com/clip/dalla/icoTrash.png" />
              </button>
            </ListRow>
          )
        })}
      </section>
    </div>
  )
}

export default ClipDetail