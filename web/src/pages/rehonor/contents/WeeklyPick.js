import React, {useEffect, useState} from 'react'

import Api from 'context/api'

import ListRow from 'components/ui/listRow/ListRow'
// global components

const WeeklyPick = (props) => {
  const [weeklyList, setWeeklyList] = useState([]);

  async function fetchWeekly() {
    const res = await Api.getWeeklyList({
      pageNo: 1,
      pageCnt: 100
    })
    if (res.result === 'success') {
      setWeeklyList(res.data.list)
    }
  }

  useEffect(() => {
    fetchWeekly()
  }, [])

  return (
    <>
      <p className='infomation'>이번 주 달둥이들의 마음을 취향저격한 DJ를 소개합니다.</p>
      {
        weeklyList.length > 0 ? 
          <div className='listWrap'>
            {weeklyList.map((list, idx) => {   
              const {round, memberList} = list
              const roundMemberLength = memberList.length;
              return (
                <React.Fragment key={idx}>
                  {
                    memberList.map((list, index) => {
                      return (
                        <ListRow key={index} photo={list.imageInfo.thumb150x150}>
                          <div className='listContent'>
                            <div className='listItem'>
                              <span className={`round ${roundMemberLength > 1 ? "jointAward" : ""}`}>{round}회차</span>
                            </div>
                            <div className='listItem'>
                              <span className='memNick'>{list.memNick ? list.memNick : "-"}</span>                              
                            </div>
                          </div>
                          <div className='listBack'>
                            <span className='rightArrow'></span>
                          </div>
                        </ListRow>
                      )
                    })
                  }
                </React.Fragment>
              )
            })}   
          </div>
        :
        <></>
      }
        
    </>
  )
}

export default WeeklyPick
