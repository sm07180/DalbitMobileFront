import React, {useContext} from 'react'
import {Context} from 'context'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import FrameItems from 'components/ui/frameItems/frameItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import DetailView from '../components/DetailView'

const DetailPage = (props) => {

  const {data,type} = props;
  const context = useContext(Context);

  const {token, profile} = context;


  return (
    <>
      {type === 'specialDj' ?
        <>
        <DetailView />
        <p className='infomation'>달라의 celebrity! 스페셜 DJ를 소개합니다.</p>
        </>
      :
        <p className='infomation'>이번 주 달둥이들의 마음을 취향저격한 DJ를 소개합니다.</p>
      }
      <section className="listSection">
      {data.length > 0 ?
        <div className={`listWrap ${type}`}>
          {type === 'specialDj' ?
          <>
          {data.map((list, index) => {
            return (
              <div className='listColumn' key={`specialDj-${index}`}>
                <div className='listItem'>
                  {list.isNew ?
                    <div className='new' onClick={() => specialDjPop(list)}>NEW</div>
                    :
                    <div className='specialCnt' onClick={() => specialDjPop(list)}>
                      <span>{list.specialCnt}회</span>
                      <span className='icoRight'></span>
                    </div>
                  }
                  {list.roomNo && <span className='live'>LIVE</span>}
                </div>
                <div className="photo">
                  <img src={profile.profImg.thumb120x120} alt="" />
                  <FrameItems content={profile} />
                </div>
                <span className='level'>{list.level}</span>
                <div className='listItem'>
                  <GenderItems data={list.gender} />
                  <span className='nickNm'>{list.nickNm}</span>
                </div>
                <div className='listItem'>
                  <DataCnt type={"goodCnt"} value={list.goodCnt}/>
                  <DataCnt type={"listenerCnt"} value={list.listenerCnt} />
                  <DataCnt type={"broadMin"} value={list.broadMin}/>
                </div>
              </div>
            )
          })}
          </>
          :
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
          }
        </div>
        :
        <></>
      }
      </section>
    </>
  )
}

export default DetailPage
