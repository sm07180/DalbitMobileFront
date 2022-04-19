import React, {useEffect, useState} from 'react';
// global components
import ListRow from 'components/ui/listRow/ListRow';
// components
import Tabmenu from '../Tabmenu';

import '../../scss/Invite.scss';
import Api from "context/api";
const tabmenu = ['팬','스타'];

const InvitePop = (props) => {

  const [tabType, setTabType] = useState(tabmenu[0]);
  const [listData, setListData] = useState([])
  useEffect(()=>{
    if(props.memNo !=="" && props.memNo !== null && props.memNo !== undefined){
        listApi()
    }
  },[tabType])

  const listApi=()=>{
    let param={
      memNo:props.memNo,
      listSlct:tabType === "팬" ? 'f' : 's',
      pageNo:1,
      pagePerCnt:100
    }
      Api.getTeamMemFanstarList(param).then((res)=>{
        console.log("초대리스트",res)
        if(res.code=== "00000"){
          setListData(res.data.list)
        }
    })
  }

  const reqApi=()=>{

  }

  // 페이지 시작
  return (
    <section className="invitePop">
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      <div className="listContainer">
        <div className="listWrap">
          {listData.length > 0 &&
          listData.map((data,index)=>{
            return(
              <ListRow photo="" photoClick={() => photoClick()} key={index}>
                <div className="listContent">
                  <div className="nick">{tabType ==="스타" ? data.mem_nick_star : data.mem_nick_fan}</div>
                </div>
                <div className="listBack">
                  <button className={data.team_req_yn !=='n'  ? 'complete' : ''} onClick={()=>reqApi()}>
                    {data.team_req_yn !=='n' ? "완료" : "초대"}
                  </button>
                </div>
              </ListRow>
            )
          })
          }
        </div>
      </div>
    </section>
  )
}

export default InvitePop;

