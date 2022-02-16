import React, {useContext} from 'react'
import {Context} from 'context'

// global components
import ListRow from 'components/ui/listRow/ListRow'
// components

const WeeklyPick = (props) => {

  const {data,type} = props;
  const context = useContext(Context);

  const {token, profile} = context;


  return (
    <>
      <p className='infomation'>이번 주 달둥이들의 마음을 취향저격한 DJ를 소개합니다.</p>
      <section className="listSection">
      {data.length > 0 &&
        <div className={`listWrap ${type}`}>
          <>
          {data.map((list, index) => {
            return (
              <React.Fragment key={`weeklyPick-${index}`}>
                {list.memberList && list.memberList.map((list, idx) => {
                  return (
                    <ListRow key={idx} photo={list.imageInfo.thumb150x150}>
                      <div className='listContent'>
                        <div className={`round ${list.memberList && list.memberList.length > 1 ? "jointAward" : ""}`}>{list.round}회차</div>
                        <div className='memNick'>{list.memNick ? list.memNick : "-"}</div>
                      </div>
                      <div className='back'>
                        <span className='rightArrow'></span>
                      </div>
                    </ListRow>
                  )
                })}
              </React.Fragment>
            )
          })}
          </>
        </div>
      }
      </section>
    </>
  )
}

export default WeeklyPick
