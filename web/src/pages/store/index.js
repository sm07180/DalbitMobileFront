import React, {useEffect, useState, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {Context} from "context";

import Api from 'context/api'
import Utility from 'components/lib/utility'

import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import './style.scss'
import _ from "lodash";
import {useSelector} from "react-redux";
import {OS_TYPE} from "context/config";

const StorePage = () => {
  const history = useHistory()
  const context = useContext(Context);
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  const [select, setSelect] = useState(3);
  const [storeInfo, setStoreInfo] = useState({
    myDal: 0,
    dalPrice: []
  })
  const [payInfo, setPayInfo] = useState({
    itemNm: "달 300",
    dal: "300",
    price: "33000",
    itemNo: "A1555"
  })

  useEffect(() => {
    getStoreInfo();
  }, []);

  // 조회 Api
  const getStoreInfo = () => {
    Api.store_list().then((response) => {
      if (response.result === 'success' && _.hasIn(response, 'data')) {
        setStoreInfo({
          myDal: response.data.dalCnt,
          dalPrice: response.data.list
        })
      } else {
        context.action.alert({
          msg: response.message
        })
      }
    });
  }

  const onSelectDal = (index, itemNm, givenDal, price, itemNo) => {
    setSelect(index);
    setPayInfo({
      ...payInfo,
      itemNm: itemNm,
      dal: givenDal,
      price: price,
      itemNo: itemNo
    })
  }

  const movePayment = () => {
    if (context.token.isLogin) {
      history.push({
        pathname: '/store/dalcharge',
        search: `?itemNm=${encodeURIComponent(payInfo.itemNm)}&price=${payInfo.price}&itemNo=${payInfo.itemNo}&dal=${payInfo.dal}`
      })
    } else {
      history.push('/login')
    }
  }

  return (
    <div id="storePage">
      <Header title={'스토어'} position="sticky" type="back" backEvent={()=>history.push("/")}/>
      <section className="myhaveDal">
        <div className="title">내가 보유한 달</div>
        <span className="dal">{Utility.addComma(storeInfo.myDal)}</span>
      </section>
      <section className="storeDalList">
        {storeInfo.dalPrice && storeInfo.dalPrice.map((item, index) => {
          return (
            <div className={`item ${Number(select) === index && 'active'}`} data-target-index={index}
                 onClick={()=>onSelectDal(index, item.itemNm, item.givenDal, item.itemPrice, item.itemNo)} key={index}>
              <div className="itemIcon"/>
              <div className="dal">{Utility.addComma(item.givenDal)}</div>
              {item.salePrice === 1100000 && <div className='bonus'>{`+${Utility.addComma(500)}`}</div>}
              <div className="price">{`￦${Utility.addComma(item.salePrice)}`}</div>
            </div>
          )
        })}
        <SubmitBtn onClick={movePayment} text="결제하기" />
      </section>
    </div>
  )
}

export default StorePage