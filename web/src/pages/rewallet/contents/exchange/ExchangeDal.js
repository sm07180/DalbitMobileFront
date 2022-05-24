import React, {useEffect, useState} from 'react'
import {useHistory} from "react-router-dom";
import Api from 'context/api'
import Utility from 'components/lib/utility'

// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
// contents
// css
import './exchangeDal.scss'
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const ExchangeDal = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {profile, token} = globalState;

  if(!token?.isLogin) history.push('/login');

  //에러페이지 노출용
  const [error, setError] = useState(false);
  const [dalList, setDalList] = useState([]);
  const [select, setSelect] = useState({
    num:-1,
    dal:0,
    byeol:0,
    itemCode:''
  });

  //현재 보유한 별 갯수
  const [myByeol, setMyByeol] = useState(profile?.byeolCnt);

  useEffect(()=>{
    getStoreList();
  },[]);
  // 조회 Api

  //달 리스트 조회
  async function getStoreList() {
    const {data, result, message} = await Api.getChangeItem({})
    if (result === 'success' && data) {
      setError(false);
      setDalList(data.list);
      setSelect({
        num: 1,
        dal: data.list[1].dalCnt,
        byeol: data.list[1].byeolCnt,
        itemCode: data.list[1].itemCode
      });
      if (data?.byeolCnt) setMyByeol(data.byeolCnt);
    } else {
      setError(true);
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message
      }))
    }
  }

  //달 교환하기
  function chargeClick() {
    async function postChange() {
      const res = await Api.postChangeItem({
        data: {
          itemCode: select.itemCode
        }
      })
      if (res.result === 'success' && _.hasIn(res, 'data')) {
        setMyByeol(res.data.byeolCnt);
        dispatch(setGlobalCtxMessage({type: "toast",
          msg: res.message
        }))
      } else {
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: res.message
        }))
      }
    }

    //별 부족
    if (select.byeol > myByeol) {
      return dispatch(setGlobalCtxMessage({type: "confirm",
        msg: `달 교환은 50별부터 가능합니다.`
      }))
    }

    dispatch(setGlobalCtxMessage({type: "confirm",
      msg: `별 ${select.byeol}을 달 ${select.dal}으로 \n 교환하시겠습니까?`,
      callback: () => {
        postChange();
      }
    }))
  }

  return (
    <>
      <div id="exchangeDal">
        <Header title="달 교환" position="sticky" type="back" />
        <section className="myhaveDal">
          <div className="title">내가 보유한 별</div>
          <span className="byeol">{Utility.addComma(myByeol)}</span>
        </section>
        <section className="storeDalList">
          {dalList.map((data,index) => {
            return (
              <div  key={index} className={`item ${Number(select.num) === index && 'active'}`}
                    onClick={() => {
                      setSelect({
                        num: index,
                        dal: data?.dalCnt,
                        byeol: data?.byeolCnt,
                        itemCode: data?.itemCode
                      });
                    }}>
                <div className="itemIcon"></div>
                <div className="dal">{Utility.addComma(data.dalCnt)}</div>
                <div className="price">{`${Utility.addComma(data.byeolCnt)} 별`}</div>
              </div>
            )
          })}
          <SubmitBtn text="교환하기" onClick={chargeClick}/>
        </section>
        <section className="noticeInfo">
          <h3>유의사항</h3>
          <p>달교환은 최소 50별 이상부터 가능합니다.</p>
          <p>별을 달로 교환할 경우 교환달로 아이템 선물이 가능합니다.</p>
          <p>별을 달로 교환할 경우 1exp를 획득할 수 있습니다.</p>
        </section>
      </div>
    </>
  )
}

export default ExchangeDal