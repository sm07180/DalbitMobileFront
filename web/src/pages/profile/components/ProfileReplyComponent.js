import React, {useContext, useMemo} from 'react';
import ListRow from "components/ui/listRow/ListRow";
import Utility from "components/lib/utility";
import {IMG_SERVER} from "context/config";
import {Context} from "context";

const ProfileReplyComponent = (props) => {
  const {item, isMyProfile, dateKey, replyDelete, replyEditFormActive, type, blurBlock} = props;
  const context = useContext(Context)

  //몇초 전, 몇분 전, 몇시간 전 표기용
  const timeDiffCalc = useMemo(() => {
    if (item?.[dateKey]) {
      return Utility.writeTimeDffCalc(item?.[dateKey]);
    } else {
      return '';
    }
  }, [item]);

  return (
    <ListRow photo={type ==='feed'?item?.profileImg?.thumb50x50 : item?.profImg?.thumb50x50}>
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
        {/*좋아요
        <div className="listItems">
          <i className='like'/>
          <span>{Utility.addComma(3211)}</span>
        </div>*/}

        {(isMyProfile || context.adminChecker) && <div>
          <button onClick={() => replyDelete(item?.replyIdx)}>삭제</button>
        </div>}
        {isMyProfile && <div>
          <button onClick={() => {
            blurBlock();
            replyEditFormActive(item?.replyIdx, item?.contents)
          }}>수정
          </button>
        </div>}

      </div>
      <button className='more'>
        <img src="" alt="" />
      </button>
    </ListRow>


  );
}

export default React.memo(ProfileReplyComponent);