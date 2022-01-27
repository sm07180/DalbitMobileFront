import React, {useState, useCallback, useEffect} from 'react'
//context
import API from 'context/api'
import Swiper from 'react-id-swiper'
// component
import Header from 'components/ui/header/Header.js'
import SwipeList from './components/swipeList'
import SearchHistory from './components/searchHistory'
import SearchResult from './components/searchResult'

//scss
import './style.scss'

export default (props) => {  
  const [searchVal, setSearchVal] = useState('') // 검색 value 값
  const [searching, setSearching] = useState('noValue');

  const [djSearch, setDjSearch] = useState('') 
  const [liveSearch, setLiveSearch] = useState('') 
  const [clipSearch, setClipSearch] = useState('') 

  const selectedAgeArr = [1, 2, 3, 4]
  const selectedGenderArr = ['m', 'f']
  const joinChar = (state) => state.join('|')

  const fetchRecommendedDJList = useCallback(async () => {
    const ageList = joinChar(selectedAgeArr)
    const gender = joinChar(selectedGenderArr)

    const {result, data} = await API.getRecommendedDJ({ageList, gender})
    if (result === 'success') {
      setDjSearch(data.list);
    }
  })

  const fetchInitialList = async () => {
      const resLive = await API.getSearchRecomend({
        page: 1,
        records: 20
      })
      if (resLive.result === 'success') {
        setLiveSearch(resLive.data.list)
      }

      const resClip = await API.getPopularList({
        page: 1,
        records: 20
      })
      if (resClip.result === 'success') {
        setClipSearch(resClip.data.list)
      }
  }

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 12
  }

  useEffect(() => {
    fetchRecommendedDJList();
    fetchInitialList();
  }, [])

  useEffect(() => {
    // fetchSearchMember();
  }, [searchVal])

  return (
    <div id="search">
      <Header title={"검색"} setSearchVal={setSearchVal} setSearching={setSearching}></Header>
      <div className='content'>
        {
          searching === "noValue" ?
            <>
              <section className='djSection'>
                {djSearch && djSearch.length > 0 &&
                  <SwipeList title={"믿고 보는 DJ"}>
                      <Swiper {...swiperParams}>
                        {djSearch.map((list,index) => {
                          return (
                            <div className='swipeList' key={index}>
                              <div className='swipeImg'>
                                <img src={list.profImg.thumb190x190} alt={list.nickNm} className=''/>
                              </div>
                              <div className='swipeText'>
                                <span className={`gender ${list.gender === "m" ? "male" : "female"}`}></span>
                                <span className='swipeNick'>{list.nickNm}</span>
                              </div>
                              {list.isFan ? <button className='followBtn'>팔로잉</button> : <button className='fanBtn'>+ 팬</button>}
                            </div>
                          )
                        })}
                      </Swiper>
                  </SwipeList>
                }
              </section>

              <section className='liveSection'>
                {liveSearch && liveSearch.length > 0 &&
                  <SwipeList title={"🔥 지금 핫한 라이브"}>
                      <Swiper {...swiperParams}>
                        {liveSearch.map((list,index) => {
                          return (
                            <div className='swipeList' key={index} style={{backgroundImage: `url(${list.bgImg.thumb190x190})`}}>
                              {!list.isVideo && <div className='videoTag'></div>}
                              <div className='swipeText'>{list.title}</div>
                            </div>
                          )
                        })}
                      </Swiper>
                  </SwipeList>
                }
              </section>
              
              <section className='clipSection'>
                {clipSearch && clipSearch.length > 0 &&
                  <SwipeList title={"오늘 인기 있는 클립"}>
                      <Swiper {...swiperParams}>
                        {clipSearch.map((list,index) => {
                          return (
                            <div className='swipeList' key={index}>
                              <div className='swipeImg'>
                                <img src={list.bgImg.thumb190x190} alt={list.nickNm} className=''/>
                              </div>
                              <div className='swipeText'>
                                <span className='swipeNick'>{list.nickName}</span>
                                <span className='swipeClip'>{list.title}</span>
                              </div>
                            </div>
                          )
                        })}
                      </Swiper>
                  </SwipeList>
                }
              </section>
            </>            
          :
          searching === "ing" ?
            <SearchHistory/>
          :
            <SearchResult searchResult={searchVal}/>            
        }   
      </div>
    </div>
  )
}