import React, {useState} from 'react'

import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import TabBtn from 'components/ui/tabBtn/TabBtn'

const listenTab = ['최근','좋아요','선물']

const MyClipListen =()=>{
  const [listenType, setListenType] = useState(listenTab[0])

  return(
    <>
      <ul className="tabmenu">
        {listenTab.map((data, index)=>{
          const param ={
            item: data,
            tab: listenType,
            setTab: setListenType,
          }
          return(
              <TabBtn key={index} param={param} />
          )
        })}
      </ul>
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
          </ListRow>
        </section>
    </>
  )
}

export default MyClipListen