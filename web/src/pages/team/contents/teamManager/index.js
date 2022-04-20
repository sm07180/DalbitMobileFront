import React, {useContext, useState, useEffect} from 'react';
import TeamManager from "pages/team/contents/teamManager/TeamManager";
import {useSelector} from "react-redux";
import Api from "context/api";

const TeamManagerIndex = (props)=>{
  const teamNo = props.match.params.teamNo;
  const memberRdx = useSelector((state)=> state.member);
  const [teamDetailData, setTeamDetailData] = useState(undefined);

  useEffect(()=>{
    getPageData();
  }, [])

  const getPageData = ()=>{
    Api.getTeamDetailSel({teamNo:teamNo,memNo:memberRdx.memNo}).then(res =>{
      setTeamDetailData(res.data);
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
