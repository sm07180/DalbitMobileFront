import React, {useContext, useState, useEffect} from 'react';
import TeamManager from "pages/team/contents/teamManager/TeamManager";
import {useSelector} from "react-redux";
import Api from "context/api";
import {useHistory} from "react-router-dom";

const TeamManagerIndex = (props)=>{
  const teamNo = props.match.params.teamNo;
  const history = useHistory();
  const memberRdx = useSelector((state)=> state.member);
  const [teamDetailData, setTeamDetailData] = useState(undefined);

  useEffect(()=>{
    if(memberRdx.memNo ===""){
      history.replace("/login")
    }else{
      getPageData();
    }
  }, [])

  const getPageData = ()=>{
    Api.getTeamDetailSel({teamNo:teamNo,memNo:memberRdx.memNo}).then(res =>{
      if(res.data.statChk === 'm'){
        setTeamDetailData(res.data);
      }else{
        history.replace(`/mypage/${memberRdx.memNo}`)
      }
    })
  }

  return <>
    {
      teamDetailData &&
      <TeamManager {...props} data={teamDetailData} getPageData={getPageData}/>
    }
  </>
}


export default TeamManagerIndex
