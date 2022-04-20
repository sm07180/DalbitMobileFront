import React, {useEffect, useState} from 'react';
// global components
// scss
import '../../scss/secession.scss';
import Api from "context/api";
import photoCommon from "common/utility/photoCommon";

const SecessionPop = (props) => {
  const {closeSlide,teamMemList,context,memNo,teamNo,history} = props;
  const [teMemNo, setTeMemNo]=useState("");

  const teamDel=()=>{
    closeSlide()
    context.action.confirm({
      msg: `삭제하면 72시간 이후부터
      팀을 만들 수 있습니다.`,
      remsg: `삭제한 이후에는 팀 랭킹 리워드를
      받을 수 없으며 삭제된 정보는 복구되지 않습니다.`,
      buttonText: {
        left: '취소',
        right: '삭제'
      },
      callback: () => {
        Api.getTeamMasterUpd({teamNo:teamNo,tmMemNo:teMemNo}).then(res=>{
          if(res.code === "00000"){
            let param = {
              teamNo:teamNo,
              masterMemNo:memNo,
              chrgrName:"",
            }
            Api.getTeamDel(param).then(res=>{
              if(res.code === "00000"){
                history.push(`/mypage`)
              }else {
                context.action.toast({
                  msg: res.message
                })
              }
            })
          }else{
            context.action.toast({
              msg: res.message
            })
          }
        })
      },
      cancelCallback: () => {},
    });
    console.log(memNo);
  }
  const nextLeader =(memNo)=>{
    setTeMemNo(memNo)
  }

  // 페이지 시작
  return (
    <section className="secession">
      <div className="teamList">
        {teamMemList.length > 0 && teamMemList.map((data,index)=>{
          let tmemNo = data.tm_mem_no
          let photoUrl = data.tm_image_profile
          let photoServer = "https://devphoto.dalbitlive.com";
          return(
            <label className="listRow" key={index}>
              <div className="photo">
                <img src={photoCommon.getPhotoUrl(photoServer, photoUrl, "120x120")} alt="" />
              </div>
              <div className="listContent">
                <div className="nick">{data.tm_mem_nick}</div>
              </div>
              {Number(tmemNo) !== Number(memNo) &&
              <div className="listBack">
                <input type="radio" name="team" className="blind" onChange={()=>nextLeader(tmemNo)}/>
                <div className="checkIcon"/>
              </div>
              }
            </label>
          )
        })}
      </div>
      <div className="buttonGroup">
        <button onClick={closeSlide}>취소</button>
        <button onClick={()=>teamDel()}>다음</button>
      </div>
    </section>
  )
}

export default SecessionPop;