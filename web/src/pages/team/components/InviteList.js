import React, {useContext, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {IMG_SERVER} from 'context/config';
// global components
import ListRow from 'components/ui/listRow/ListRow';
import {PHOTO_SERVER} from "context/config";
import Api from "context/api";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const InviteList = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  let {list,listCnt,memNo,setInvitationChk}=props;

  const teamConfirm = (e,teamNo,masterNo) => {
    const {targetConfirm} = e.currentTarget.dataset;

    if (targetConfirm === 'cancel') {
      dispatch(setGlobalCtxMessage({type:'confirm',
        msg: `정말 거절 할까요?`,
        buttonText: {
          left: '취소',
          right: '거절할게요'
        },
        callback: () => {
          let param={
            teamNo:teamNo,
            memNo:memNo,
            masterMemNo:masterNo,
            chrgrName:""
          }
          Api.getTeamMemReqDel(param).then((res)=>{
            if(res.code === "00000"){
              setInvitationChk(true)
            }else{
              dispatch(setGlobalCtxMessage({type:'toast',
                msg: res.message
              }))
            }
          })

        }
      }));
    } else if (targetConfirm === 'accept') {
      dispatch(setGlobalCtxMessage({type:'confirm',
        msg: `수락을 누르면 팀원으로 가입합니다.`,
        buttonText: {
          left: '취소',
          right: '수락할게요!'
        },
        callback: () => {
          let param={
            teamNo:teamNo,
            memNo:memNo,
          }
          Api.getTeamMemIns(param).then((res)=>{
            if(res.code === "00000"){
              console.log("수락",res)
              history.push(`/team/detail/${teamNo}`)
            }
          })

        }
      }));
    }
  };

  // 페이지 시작
  return (
    <>
      <div className="titleWrap">
        <h2>나를 초대한 팀</h2>
        {listCnt > 0 && <h3>초대에 7일동안 응답하지 않을 경우 자동으로 거절됩니다.</h3>}
      </div>
      {listCnt > 0 ?
        list.map((data,index)=>{
            let dateFormat = moment(data.ins_date).format();
            dateFormat = moment(dateFormat).format("YYYY-MM-DD HH:mm");
            let teamNo = data.team_no;
            let masterNo =data.master_mem_no;
            return(
            <div className="listWrap" key={index}>
              <div className="listRow">
                <div className="photo">
                  <img src={`${IMG_SERVER}/team/parts/B/${data.team_bg_code}.png`} alt="" />
                  <img src={`${IMG_SERVER}/team/parts/E/${data.team_edge_code}.png`} alt="" />
                  <img src={`${IMG_SERVER}/team/parts/M/${data.team_medal_code}.png`} alt="" />
                </div>
                <div className="listContent">
                  <div className="text">{data.team_name}</div>
                  <div className="listItem">
                    <i className="infoRank">{data.team_rank}</i>
                    <i className="infoPerson">{data.team_mem_cnt}</i>
                  </div>
                  <div className="time">{dateFormat}에 신청함</div>
                </div>
                <div className="listBack">
                  <div className="buttonGroup">
                    <button className="cancel" data-target-confirm="cancel" onClick={(e)=>{teamConfirm(e,teamNo,masterNo)}}>거절</button>
                    <button className="accept" data-target-confirm="accept" onClick={(e)=>{teamConfirm(e,teamNo,masterNo)}}>수락</button>
                  </div>
                </div>
              </div>
            </div>
            )
          })
        :
        <div className="listNone">
          아직 나를 초대한 팀이 없어요.<br/>어떤 팀이 있는지 볼까요?
          <button onClick={()=>{history.push("/rankDetail/TEAM")}}>팀 랭킹 보기</button>
        </div>
      }
    </>
  )
}
export default InviteList;
