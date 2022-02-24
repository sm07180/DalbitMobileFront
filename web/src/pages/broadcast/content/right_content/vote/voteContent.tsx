import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Utility from "../../../../../components/lib/utility";

const VoteContent = () => {
  const dispatch = useDispatch();

  const memberRdx = useSelector((state) => state.member);
  const voteRdx = useSelector(({vote})=> vote);

  const [more, setMore] = useState(false);

  if(!voteRdx.voteSel){
    return <></>
  }
  return (
    <>
      <section className="voteTitleWrap">
        <h2>{voteRdx.voteSel.voteTitle}</h2>
        <div className="countBox">
          <div className="num">
            <span className="icon"/>
            <p><span>{Utility.addComma(voteRdx.voteSel.voteMemCnt)}</span>명 참여</p>
          </div>
          <div className="due">
            <span>20:04</span> 마감예정
          </div>
        </div>
        <div className="moreBtn" onClick={()=>setMore(!more)}>
          {more &&
            <div className="isMore">
              <button>마감하기</button>
              <button>삭제하기</button>
            </div>
          }
        </div>
      </section>
      <section className='optionWrap'>
        <div className="optionBox">
          <div>01</div>
          <span>일이삼사오육칠팔구십일이삼사오</span>
        </div>
        <div className="optionBox active">
          <div>01</div>
          <span>일이삼사오육칠팔구십일이삼사오</span>
        </div>
      </section>
    </>
  );
};

export default VoteContent;
