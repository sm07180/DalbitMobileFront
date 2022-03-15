import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import ListRow from "components/ui/listRow/ListRow";
import Utility from "components/lib/utility";
import {IMG_SERVER} from "context/config";
import {Context} from "context";
import {useDispatch, useSelector} from "react-redux";
import {setProfileTabData} from "redux/actions/profile";

const ProfileReplyComponent = (props) => {
  const {item, profile, isMyProfile, adminChecker, dateKey, replyDelete,
    replyEditFormActive, type, blurBlock, goProfile, openBlockReportPop
  } = props;
  const dispatch = useDispatch();
  const profileTab = useSelector(state => state.profileTab);

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

  const replyGoProfileHandler = () => {
    goProfile();
    dispatch(setProfileTabData({...profileTab, isReset: true}));
  }

  useEffect(() => {
    if(isMore) {
      document.body.addEventListener('click', replyIsMoreClickCheckerEvent);
    }
    return () => {
      document.body.removeEventListener('click', replyIsMoreClickCheckerEvent);
    }
  },[isMore]);

  return (
    <ListRow photo={type ==='feed'?item?.profileImg?.thumb292x292 : item?.profImg?.thumb292x292} photoClick={replyGoProfileHandler}>
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
      <div className="listBack">
        <div className='moreBtn' ref={isMoreRef} onClick={() => setIsMore(!isMore)}>
          <img className="moreBoxImg" src={`${IMG_SERVER}/mypage/dalla/btn_more.png`} alt="더보기" />
          {isMore &&
          <div className="isMore">
            {(isMyProfile || isMyContents || adminChecker) &&
            <button onClick={() => replyDelete(item?.replyIdx)}>삭제하기</button>
            }
            {isMyContents &&
            <button onClick={() => {
              blurBlock();
              replyEditFormActive(item?.replyIdx, item?.contents);
            }}>수정하기</button>
            }
            {!isMyContents &&
            <button onClick={() => openBlockReportPop({memNo, memNick: item?.nickName})}>차단/신고하기</button>
            }
          </div>}
        </div>
      </div>


    </ListRow>


  );
}

export default React.memo(ProfileReplyComponent);