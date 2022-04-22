import React, {useEffect, useState} from 'react';
// global components
import ListRow from 'components/ui/listRow/ListRow';
import NoResult from 'components/ui/noResult/NoResult';
// components
import Tabmenu from '../Tabmenu';

import '../../scss/Invite.scss';
import Api from "context/api";
import photoCommon from "common/utility/photoCommon";
const tabmenu = ['팬','스타'];

const InvitePop = (props) => {

  const [tabType, setTabType] = useState(tabmenu[0]);
  const [listData, setListData] = useState([])
  useEffect(()=>{
    if(props.memNo !=="" && props.memNo !== null && props.memNo !== undefined){
        listApi()
    }
  },[tabType])

  useEffect(()=>{
    if(props.btnChk){
      listApi()
    }
  },[props.btnChk])

  const listApi=()=>{
    let param={
      memNo:props.memNo,
      listSlct:tabType === "팬" ? 'f' : 's',
      pageNo:1,
      pagePerCnt:100
    }
      Api.getTeamMemFanstarList(param).then((res)=>{
        if(res.code=== "00000"){
          setListData([]);
          setListData(res.data.list)
        }
    })
  }

  // 페이지 시작
  return (
    <section className="invitePop">
      <h3>
        <span>팀원 초대</span>
        <small>팀 가입이 가능한 5레벨 이상의 사용자입니다.</small>
      </h3>
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      <div className="listContainer">
        <div className="listWrap">
          {listData.length > 0 &&
          listData.map((data,index)=>{
            let nickName = tabType ==="스타" ? data.mem_nick_star : data.mem_nick_fan
            let memNo = tabType ==="스타" ? data.mem_no_star : data.mem_no_fan
            let reqYn = data.team_req_yn
            let photoServer = "https://devphoto.dalbitlive.com";
            let photoUrl ="";
            if(tabType ==="스타"){
              photoUrl =  data.image_profile_star &&  data.image_profile_star   
            } 
            if(tabType ==="팬"){
              photoUrl =  data.image_profile_fan &&  data.image_profile_fan
            }
            return(
              <ListRow photo={photoCommon.getPhotoUrl(photoServer, photoUrl, "120x120")} key={index}>
                <div className="listContent">
                  <div className="nick">{nickName}</div>
                </div>
                <div className="listBack">
                  <button className={reqYn !=='n'  ? 'complete' : ''} onClick={()=>{props.teamMemReqIns('i',memNo)}}>
                    {reqYn !=='n' ? "완료" : "초대"}
                  </button>
                </div>
              </ListRow>
            )
          })
          }
          {listData.length === 0 &&  <NoResult />}
        </div>
      </div>
    </section>
  )
}
export default InvitePop;

