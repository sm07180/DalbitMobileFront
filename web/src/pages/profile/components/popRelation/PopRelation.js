import React, {useState, useEffect, useRef} from 'react'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
// global components
import TabBtn from 'components/ui/tabBtn/TabBtn'
import ListRow from 'components/ui/listRow/ListRow'
import LevelItems from 'components/ui/levelItems/LevelItems'
import GenderItems from 'components/ui/genderItems/GenderItems'
import FrameItems from 'components/ui/frameItems/FrameItems'
// components
import Tabmenu from '../Tabmenu'

import './popRelation.scss'

const rankingTabmenu = ['팬 랭킹','전체 랭킹']
const rankingSubTabmenu = ['최근','누적']
const relationTitle = ['팬 관리','스타 관리']
const relationSubTabmenu = ['선물 받은 순','방송 들은 순','최근 청취 순','등록순']

const PopRelation = (props) => {
  const {type} = props
  const tabMenuRef = useRef();
  const subTabType = [
    {type: 'rank', data: rankingSubTabmenu},
    {type: 'fan', data: relationSubTabmenu},
    {type: 'star', data: relationSubTabmenu}
  ];
  const [fanList, setFanList] = useState([]);
  const [rankingType, setRankingType] = useState(rankingTabmenu[0]);
  const [rankingSubType, setRankingSubType] = useState(rankingSubTabmenu[0]);
  const [relationType, setRelationType] = useState(relationTitle[0]);
  const [relationSubType, setRelationSubType] = useState(relationSubTabmenu[0]);


  const fetchFanListInfo = () => {
    Api.mypage_fan_list({
      params: {
        memNo: '11584609206286',
        sortType: 0
      }
    }).then((res) => {
      if (res.result === 'success') {
        setFanList(res.data.list)
      }
    })
  }

  console.log(fanList);

  useEffect(() => {
    fetchFanListInfo();
  },[])

  return (
    <section className="relationList">
      <Tabmenu data={rankingTabmenu} tab={rankingType} setTab={setRankingType} />
      <div className="listContainer">
        {type === subTabType[1].type &&
          <ul className="tabmenu" ref={tabMenuRef}>
            <Swiper>
              {subTabType[1].data.map((data,index) => {
                const param = {
                  item: data,
                  tab: relationSubType,
                  setTab: setRelationSubType,
                }
                return (
                  <div>
                    <TabBtn param={param} key={index} />
                  </div>
                )
              })}
            </Swiper>
          </ul>
        }
        <div className="listWrap">
          {fanList.map((list,index) => {
            return (
              <ListRow photo={list.profImg.thumb62x62} key={index}>
                {index < 3 &&
                  <div className="rank">{index + 1}</div>
                }
                <div className="listContent">
                  <div className="nick">{list.nickNm}</div>
                  <div className="like">{list.listenTime}</div>
                </div>
                <div className="back">
                  {list.isFan ?
                    <button className='isFan'>팬</button>
                    :
                    <button>+ 팬등록</button>
                  }
                </div>
              </ListRow>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PopRelation
