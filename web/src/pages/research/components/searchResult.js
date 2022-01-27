import React, {useState, useEffect} from 'react'

import Api from 'context/api'

import TabBtn from 'components/ui/tabBtn/TabBtn.js'
import ListRow from 'components/ui/listRow/ListRow'

export default (props) => {
  const {searchResult} = props
  let currentPage = 1
  const tabmenu = ['전체','DJ','라이브', '클립']
  
  const [tabName, setTabName] = useState(tabmenu[0])  
  const [djResultList, setDjResultList] = useState([])  
  const [liveResultList, setLiveResultList] = useState([])  
  const [clipResultList, setClipResultList] = useState([])  

  async function fetchSearchMember() {
    const res = await Api.member_search({
      params: {
        search: searchResult,
        page: 1,
        records: 20
      }
    })
    if (res.result === 'success') {
      setDjResultList(res.data.list);
      console.log("DjResultList", res.data.list);
    }
  }

  async function fetchSearchLive() {
    const res = await Api.broad_list({
      params: {
        search: searchResult,
        page: 1,
        records: 20
      }
    })
    if (res.result === 'success') {
      setLiveResultList(res.data.list);      
      console.log("LiveResultList", res.data.list);
    }
  }
  async function fetchSearchClip() {
    const res = await Api.getClipList({
      search: searchResult,
      slctType: 0,
      dateType: 0,
      page: 1,
      records: 20
    })
    if (res.result === 'success') {
      setClipResultList(res.data.list);      
      console.log("ClipResultList", res.data.list);
    }
  }

  useEffect(() => {
    fetchSearchMember();
    fetchSearchLive();
    fetchSearchClip();    
  }, [])

  return (
    <div className='searchResult'>
      <ul className="tabmenu">
        {tabmenu.map((data,index) => {
          const param = {
            item: data,
            tab: tabName,
            setTab: setTabName,
          }
          return (
            <TabBtn param={param} key={index} />
          )
        })}
      </ul>
      <div className='resultContent'>
        {(tabName === "DJ" || tabName === "전체") &&
          <div className='djResult'>
            {
              tabName !== "DJ" &&
                <div className='resultHeader'>
                  <div className='resultTitle'>DJ</div>
                  {djResultList.length > 0 &&  <button className='more'>더보기</button>}
                </div>
            } 
            <div className='resultWrap'>
              {
                djResultList.length > 0 ? 
                  <>
                    {
                      djResultList.map((list,index) => {
                        return (
                            <ListRow photo={list.profImg.thumb100x100} key={index}>
                              <div className='listContent'>
                                <div className="listItem">
                                  <span className={`gender ${list.gender === "m" ? "male" : "female"}`}></span>
                                  <span className="nickNm">{list.nickNm}</span>
                                </div>
                                <div className="listItem">
                                  <span className='uid'>{list.memNo}</span>
                                  {/* 원래 UID가 들어가야 하나 API에서 값을 주고 있지 않아 임시로 memNo로 삼입 함 */}
                                </div>
                                <div className="listItem dataCtn">
                                  <span className='fanCnt'>{list.fanCnt}</span>
                                </div>
                              </div>
                            </ListRow>     
                        )
                      })
                    }                
                  </>
                :
                <div className='noData'>
                  검색된 DJ가 없습니다.
                </div>
              }            
            </div>
          </div>                   
        }
        {(tabName === "라이브" || tabName === "전체") &&
          <div className='liveResult'>
            {
              tabName !== "라이브" &&
                <div className='resultHeader'>
                  <div className='resultTitle'>라이브</div>
                  {liveResultList.length > 0 &&  <button className='more'>더보기</button>}
                </div>
            }            
            <div className='resultWrap'>
              {
                liveResultList.length > 0 ? 
                  <>
                    {
                      liveResultList.map((list,index) => {
                        return (
                            <ListRow photo={list.bgImg.thumb100x100} key={index}>
                              <div className='listContent'>
                                {
                                  list.commonBadgeList.length > 0 &&
                                    <div className="listItem">
                                      {list.commonBadgeList.map((item, index) => {
                                        return (
                                          <span key={index}>{item}</span>
                                        )
                                      })}
                                    </div>
                                }
                                <div className="listItem">
                                  <span className='title'>{list.title}</span>
                                </div>                            
                                <div className="listItem">
                                  <span className={`gender ${list.bjGender === "m" ? "male" : "female"}`}></span>
                                  <span className="nickNm">{list.bjNickNm}</span>
                                </div>
                                <div className="listItem dataCtn">
                                  <span className='newFanCtn'>{list.newFanCnt}</span>
                                  <span className='totalCtn'>{list.totalCnt}</span>
                                  <span className='likeCtn'>{list.likeCnt}</span>
                                </div>
                              </div>
                            </ListRow>     
                        )
                      })
                    }                
                  </>
                :
                <div className='noData'>
                  검색된 라이브가 없습니다.
                </div>
              }            
            </div>
          </div>      
        }
        {(tabName === "클립" || tabName === "전체") &&
          <div className='clipResult'>
            {
              tabName !== "클립" &&
                <div className='resultHeader'>
                  <div className='resultTitle'>클립</div>
                  {clipResultList.length > 0 &&  <button className='more'>더보기</button>}
                </div>
            }
            <div className='resultWrap'>
              {
                clipResultList.length > 0 ? 
                  <>
                    {
                      clipResultList.map((list,index) => {
                        return (
                            <ListRow photo={list.bgImg.thumb100x100} key={index}>
                              <div className='listContent'>
                                <div className="listItem">
                                  <span className='subjectType'>
                                    {list.subjectType === "01" && "커버/노래"}
                                    {list.subjectType === "02" && "작사/작곡"}
                                    {list.subjectType === "03" && "더빙"}
                                    {list.subjectType === "04" && "수다/대화"}
                                    {list.subjectType === "05" && "고민/사연"}
                                    {list.subjectType === "06" && "힐링"}
                                    {list.subjectType === "07" && "성우"}
                                    {list.subjectType === "08" && "ASMR"}
                                  </span>
                                  <span className='title'>{list.title}</span>
                                </div>                            
                                <div className="listItem">
                                  <span className={`gender ${list.bjGender === "m" ? "male" : "female"}`}></span>
                                  <span className="nickNm">{list.nickName}</span>
                                </div>
                                <div className="listItem dataCtn">
                                  <span className='replyCnt'>{list.replyCnt}</span>
                                  <span className='goodCnt'>{list.goodCnt}</span>
                                </div>
                              </div>
                            </ListRow>     
                        )
                      })
                    }                
                  </>
                :
                <div className='noData'>
                  검색된 클립이 없습니다.
                </div>
              }            
            </div>
          </div>      
        }
      </div>      
    </div>
  )
}