import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'

// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import RankList from '../../components/rankList/RankList'
import Utility from "components/lib/utility";

const RankingWrap = (props) => {
  const {tabmenuType} = props;
  const history = useHistory();
  const context = useContext(Context);
  const {token} = context;
  return (
    <section className='rankingWrap'>
      <div className="rankingBox my">
        {token.isLogin ?
          <RankList photoSize={55} type="my" rankList={props.wassupSel}>
            <div className="listContent">
              <div className="listItem">
                <GenderItems data={props.wassupSel.memSex}/>
                <div className="nick">{props.wassupSel.memNick}</div>
              </div>
            </div>
            <div className="listBack center">
              <span>총점</span>
              <span className="numBox">
                <span className="num">{Utility.addComma(props.wassupSel.totScoreCnt)}</span>점
              </span>
            </div>
          </RankList>
          :
          <div onClick={() => history.push('/login')} style={{cursor:'pointer'}}>
            <RankList photoSize={0} type="my">
              <div className="listContent">
                <div className="text">로그인하고 와썹맨이 되어보세요!</div>
              </div>
              <div className="listBack center">
                <span>총점</span>
                <span className="numBox">
                  <span className="num">0</span>점
                </span>
              </div>
            </RankList>
          </div>
        }
      </div>
      <div className="rankingBox">
        {
          props.wassupList && props.wassupList.length < 1 &&
          <div className="noList">
            <img src={`${IMG_SERVER}/event/rebranding/list_none.png`} alt={`list_none`}/>
            <span>현재 랭킹 내역이 없어요.</span>
          </div>
        }
        {
          props.wassupList && props.wassupList.length > 0 &&
          props.wassupList.map((item, idx)=>
            <RankList photoSize={55} rankList={{...item, mem_no: item.memNo}} listNum={idx} key={idx}>
              <div className="listContent">
                <div className="listItem">
                  <GenderItems data={item.memSex}/>
                  <div className="nick">{item.memNick}</div>
                </div>
              </div>
              <div className="listBack">
            <span className="numBox">
              <span className="num">{Utility.addComma(item.totScoreCnt)}</span>점
            </span>
              </div>
            </RankList>
          )
        }
        <div className="rankingMore">
          더보기
        </div>
      </div>
    </section>
  );
};

export default RankingWrap;
