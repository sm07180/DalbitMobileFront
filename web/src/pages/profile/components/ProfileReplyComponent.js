import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import ListRow from "components/ui/listRow/ListRow";
import Utility from "components/lib/utility";

const ProfileReplyComponent = (props) => {
  const {item, profile, isMyProfile, adminChecker, dateKey, replyDelete,
    replyEditFormActive, type, blurBlock, goProfile, openBlockReportPop
  } = props;

  const memNo = type==='feed'? item?.writerMemNo : item?.writerMemNo;
  //isMyProfile : 프로필 주인 여부
  //내가 작성한 댓글 여부
  const isMyContents = (typeof profile?.memNo !=='undefined' && typeof memNo !== 'undefined')
    && profile?.memNo === memNo;

  const [isMore, setIsMore] = useState(false);
  const isMoreRef = useRef(null);

  //몇초 전, 몇분 전, 몇시간 전 표기용
  const timeDiffCalc = useMemo(() => {
    if (item?.[dateKey]) {
      return Utility.writeTimeDffCalc(item?.[dateKey]);
    } else {
      return '';
    }
  }, [item]);

  const replyIsMoreClickCheckerEvent = useCallback((e) => {
    //blur로 판단
    if (isMoreRef.current !== e.target) {
      if(isMore) setIsMore(false);
    }
  },[isMore]);

  useEffect(() => {
    if(isMore) {
      document.body.addEventListener('click', replyIsMoreClickCheckerEvent);
    }
    return () => {
      document.body.removeEventListener('click', replyIsMoreClickCheckerEvent);
    }
  },[isMore]);

  return (
    <ListRow photo={type ==='feed'?item?.profileImg?.thumb50x50 : item?.profImg?.thumb50x50} photoClick={goProfile}>
      <div className="listContent">
        <div className="listItems">
          <div className="nick">{item?.nickName}</div>
          <div className="time">{timeDiffCalc}</div>
        </div>

        <div className="listItems">
          <pre className="text">
            {item?.contents}
          </pre>
        </div>
        {/*좋아요*}
        {/*<div className="listItems">
          <i className='like'/>
          <span>{Utility.addComma(3211)}</span>
        </div>*/}
      </div>

      <button className='more' ref={isMoreRef} onClick={() => setIsMore(!isMore)}>
        {/*<img src="" alt="" />*/}
        {isMore &&
        <div>
          {(isMyProfile || isMyContents || adminChecker) &&
          <button onClick={() => replyDelete(item?.replyIdx)}>삭제</button>
          }
          {isMyContents &&
          <button onClick={() => {
            blurBlock();
            replyEditFormActive(item?.replyIdx, item?.contents);
          }}>수정</button>
          }
          {!isMyContents &&
          <button onClick={() => openBlockReportPop({memNo, memNick: item?.nickName})}>차단/신고하기</button>
          }
        </div>}
      </button>


    </ListRow>


  );
}

export default React.memo(ProfileReplyComponent);
