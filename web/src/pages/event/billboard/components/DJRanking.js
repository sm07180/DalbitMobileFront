import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'

// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import RankList from '../../components/rankList/RankList'
import Utility from "components/lib/utility";
import {useDispatch, useSelector} from "react-redux";

const RankingWrap = (props) => {
  const {billboardSel, billboardList, billboardListCnt, getNextList, pageInfo} = props
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const {token} = globalState;

  return (
    <>
      <section className='rankingWrap'>
        <div className="rankingBox my">
          {token.isLogin ?
            <RankList photoSize={55} type="my" rankList={billboardSel}>
              <div className="listContent">
                <div className="listItem">
                  <GenderItems data={billboardSel.memSex}/>
                  <div className="nick">{billboardSel.memNick}</div>
                </div>
              </div>
              <div className="listBack center">
                <span className="numBox">
                  <span className="num">{Utility.addComma(billboardSel.newFanCnt)}</span>명
                </span>
              </div>
            </RankList>
            :
            <div onClick={() => history.push('/login')} style={{cursor:'pointer'}}>
              <RankList photoSize={0} type="my">
                <div className="listContent">
                  <div className="text">로그인하고 달라의 셀럽이 되어보세요!</div>
                </div>
              </RankList>
            </div>
          }
        </div>
        <div className="rankingBox">
          {
            billboardList && billboardList.length < 1 &&
            <div className="noList">
              <img src={`${IMG_SERVER}/event/rebranding/list_none.png`} alt={`list_none`}/>
              <span>현재 랭킹 내역이 없어요.</span>
            </div>
          }

          {
            billboardList && billboardList.length > 0 &&
            billboardList.map((item, idx)=>
              <RankList photoSize={55} rankList={{...item, mem_no: item.memNo}} listNum={idx} key={idx}>
                <div className="listContent">
                  <div className="listItem">
                    <GenderItems data={item.memSex}/>
                    <div className="nick">{item.memNick}</div>
                  </div>
                </div>
                <div className="listBack">
                  <span className="numBox">
                    <span className="num">{Utility.addComma(item.newFanCnt)}</span>명
                  </span>
                </div>
              </RankList>
            )
          }
          {
            billboardList.length < billboardListCnt && pageInfo.pageNo < 3 &&
            <div className="rankingMore" onClick={getNextList}>
              더보기
            </div>
          }
        </div>
      </section>
    </>
  );
};

export default RankingWrap;
