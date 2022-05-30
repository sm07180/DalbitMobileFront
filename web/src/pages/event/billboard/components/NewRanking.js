import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'

// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import RankList from '../../components/rankList/RankList'
import Utility from "components/lib/utility";
import {useSelector} from "react-redux";

const RankingWrap = (props) => {
  const {billboardSel, billboardList, billboardListCnt, getNextList, pageInfo} = props
  const history = useHistory();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {token} = globalState;

  return (
    <section className='rankingWrap'>
      <div className="rankingBox my">
        {token.isLogin ?
          <RankList photoSize={55} type="my" rankList={billboardSel}>
            <div className="listContent">
              <div className="listItem">
                <GenderItems data={billboardSel.mem_sex}/>
                <div className="nick">{billboardSel.mem_nick}</div>
              </div>
            </div>
            <div className="listBack center">
              <span>총점</span>
              <span className="numBox">
                <span className="num">{Utility.addComma(billboardSel.tot_score_cnt)}</span>점
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
            <img src={`${IMG_SERVER}/common/listNone/listNone.png`} alt={`list_none`}/>
            <span>현재 랭킹 내역이 없어요.</span>
          </div>
        }
        {
          billboardList && billboardList.length > 0 &&
          billboardList.map((item, idx)=>
            <RankList photoSize={55} rankList={{...item, mem_no: item.mem_no}} listNum={idx} key={idx}>
              <div className="listContent">
                <div className="listItem">
                  <GenderItems data={item.mem_sex}/>
                  <div className="nick">{item.mem_nick}</div>
                </div>
              </div>
              <div className="listBack">
            <span className="numBox">
              <span className="num">{Utility.addComma(item.tot_score_cnt)}</span>점
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
  );
};

export default RankingWrap;
