import React, {useContext, useState, useEffect} from 'react';
import TeamBadge from "pages/team/contents/teamBadge/TeamBadge";
import {useSelector} from "react-redux";
import Api from "context/api";

const TeamBadgeIndex = (props)=>{
  const teamNo = props.match.params.teamNo;
  const memberRdx = useSelector((state)=> state.member);
  const [teamBadgeData, setTeamBadgeData] = useState(undefined);

  useEffect(()=>{
    getPageData();
  }, [])

  const getPageData = ()=>{
    Api.getTeamBadgeList({
      teamNo:teamNo,
      memNo:memberRdx.memNo,
      pageNo:1,
      pagePerCnt:100
    }).then((res)=>{
      if(res.code === "00000"){
        setTeamBadgeData(res.data);
      }
    })
  }

  return <>
    {
      teamBadgeData &&
      <TeamBadge {...props} data={teamBadgeData} getPageData={getPageData}/>
    }
  </>
}


export default TeamBadgeIndex;
