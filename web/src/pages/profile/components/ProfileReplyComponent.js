import React, {useContext, useMemo} from 'react';
import ListRow from "components/ui/listRow/ListRow";
import Utility from "components/lib/utility";
import {IMG_SERVER} from "context/config";
import {Context} from "context";

const ProfileReplyComponent = (props) => {
  const {item, profile, isMyProfile, adminChecker, dateKey, replyDelete, replyEditFormActive, type, blurBlock, goProfile } = props;

  //isMyProfile : 프로필 주인 여부
  //내가 작성한 댓글 여부
  const isMyContents = (typeof profile?.memNo !=='undefined' && typeof item?.writerMemNo !== 'undefined')
    && profile?.memNo === item?.writerMemNo;

  //몇초 전, 몇분 전, 몇시간 전 표기용
  const timeDiffCalc = useMemo(() => {
    if (item?.[dateKey]) {
      return Utility.writeTimeDffCalc(item?.[dateKey]);
    } else {
      return '';
    }
  }, [item]);

  return (
    <ListRow photo={type ==='feed'?item?.profileImg?.thumb50x50 : item?.profImg?.thumb50x50} photoClick={goProfile}>
      {`${isMyContents}`}
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

        {(isMyProfile || isMyContents || adminChecker) && <div>
          <button onClick={() => replyDelete(item?.replyIdx)}>삭제</button>
        </div>}
        {isMyContents && <div>
          <button onClick={() => {blurBlock();replyEditFormActive(item?.replyIdx, item?.contents);}}>수정
          </button>
        </div>}
        {!isMyContents && <div><button>차단/신고하기</button></div>}

      </div>
      <button className='more'>
        <img src={`${IMG_SERVER}/mypage/dalla/btn_more.png`} alt="더보기" />
        {/*{(context.profile.memNo === item.mem_no || context.adminChecker) && <button>수정하기</button>}*/}
        {/*{(isMyProfile || context.profile.memNo === item.mem_no || context.adminChecker) && <button >삭제하기</button>}*/}
        {/*{context.profile.memNo !== item.mem_no && <button>차단/신고하기</button>}*/}
      </button>
    </ListRow>


  );
}

export default React.memo(ProfileReplyComponent);