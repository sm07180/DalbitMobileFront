import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from "context";

import Api from 'context/api'
import Utility from 'components/lib/utility'

import Header from 'components/ui/header/Header'
import BannerSlide from 'components/ui/bannerSlide/BannerSlide'
import './style.scss'
import _ from "lodash";

const StorePage = () => {
  const history = useHistory()
  const context = useContext(Context);
  const [select, setSelect] = useState(-1);
  const [storeInfo, setStoreInfo] = useState({
    myDal: 0,
    dalPrice: []
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
    if (context.token.isLogin) {
        history.push({
          pathname: '/store/dalcharge',
          search: `?itemNm=${itemNm}&dal=${givenDal}&price=${price}&itemNo=${itemNo}`
        })
    } else {
      history.push('/login')
    }
  }

  return (
    <div id="storePage">
      <Header title={'스토어'} position="sticky" type="back"/>
      <section className="myhaveDal">
        <div className="title">내가 보유한 달</div>
        <span className="dal">{Utility.addComma(storeInfo.myDal)}</span>
      </section>
      <section className="bannerWrap">
        <BannerSlide/>
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
      </section>
    </div>
  )
}

export default StorePage