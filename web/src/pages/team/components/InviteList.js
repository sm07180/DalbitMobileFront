import React, {useContext, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {Context} from 'context';
// global components
import ListRow from 'components/ui/listRow/ListRow';
import {PHOTO_SERVER} from "context/config";

const InviteList = (props) => {
  const history = useHistory();
  const context = useContext(Context);

  let {list,listCnt}=props;

  const photoClick = (memNo) => {
    history.push(`/profile/${memNo}`);
  };

  const teamConfirm = (e) => {
    const {targetConfirm} = e.currentTarget.dataset;

    if (targetConfirm === 'cancel') {
      context.action.confirm({
        msg: `정말 거절 할까요?`,
        buttonText: {
          left: '취소',
          right: '거절할게요'
        },
        callback: () => {
          console.log('cancel');
        }
      });
    } else if (targetConfirm === 'accept') {
      context.action.confirm({
        msg: `수락을 누르면 팀원으로 가입합니다.`,
        buttonText: {
          left: '취소',
          right: '수락할게요!'
        },
        callback: () => {
          console.log('accept');
        }
      });
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
        <div className="listWrap">
          {list.map((data,index)=>{
            return(
              <ListRow photo={`${PHOTO_SERVER}${data.imageProfile}?120x120`} photoClick={() => photoClick()}>
                <div className="listContent">
                  <div className="text">{data.team_name}</div>
                  <div className="listItem">
                    <i className="infoRank">{data.team_rank}</i>
                    <i className="infoPerson">{data.team_mem_cnt}</i>
                  </div>
                  <div className="time">{data.ins_date}에 신청함</div>
                </div>
                <div className="listBack">
                  <div className="buttonGroup">
                    <button className="cancel" data-target-confirm="cancel" onClick={teamConfirm}>거절</button>
                    <button className="accept" data-target-confirm="accept" onClick={teamConfirm}>수락</button>
                  </div>
                </div>
              </ListRow>
              )
          })}
        </div>
        :
        <div className="listNone">
          아직 나를 초대한 팀이 없어요.<br/>어떤 팀이 있는지 볼까요?
          <button>팀 랭킹 보기</button>
        </div>
      }
    </>
  )
}

export default InviteList;