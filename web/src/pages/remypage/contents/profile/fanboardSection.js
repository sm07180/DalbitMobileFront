import React, {useState} from 'react'

// global components
import TabBtn from 'components/ui/tabBtn/TabBtn'
// components
import SocialList from '../../components/SocialList'
import {useDispatch, useSelector} from "react-redux";

const fanboardTabmenu = ['전체','내댓글']

const FanboardSection = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {token, profile} = globalState

  const [fanboardType, setFanboardType] = useState(fanboardTabmenu[0])

  const data = profile

  return (
    <div className="fanboardSection">
      <ul className="subTabmenu">
        {fanboardTabmenu.map((data, index) => {
          const param = {
            item: data,
            tab: fanboardType,
            setTab: setFanboardType,
            // setPage: setPage
          }
          return (
            <TabBtn param={param} key={index} />
          )
        })}
      </ul>
      <div className="subArea">
        <div className="title">전체 2,222</div>
        <button className='filter'>최신순</button>
      </div>
      <SocialList data={data} />
    </div>
  )
}

export default FanboardSection
