import React, {useContext} from "react";
import {Context} from "context";
import '../style.scss'
import Header from "../../../components/ui/header/Header";
import Utility from "../../../components/lib/utility";
import SubmitBtn from "../../../components/ui/submitBtn/SubmitBtn";
import {useHistory} from "react-router-dom";
import {StorePagePropsType} from "../../../redux/types/pay/storeType";

const StorePage = ({storeInfo, select, setSelect, payInfo, setPayInfo}: StorePagePropsType)=>{
  const history = useHistory()
  const context = useContext(Context);
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
        {
          storeInfo.dalPriceList && storeInfo.dalPriceList.map((item, index) =>
            <div className={`item ${Number(select) === index && 'active'}`} data-target-index={index}
                 onClick={()=>onSelectDal(index, item.itemNm, item.givenDal, item.itemPrice, item.itemNo)} key={index}>
              <div className="itemIcon"/>
              <div className="dal">{Utility.addComma(item.givenDal)}</div>
              {item.salePrice === 1100000 && <div className='bonus'>{`+${Utility.addComma(500)}`}</div>}
              <div className="price">{`￦${Utility.addComma(item.salePrice)}`}</div>
            </div>
          )}
        <SubmitBtn onClick={movePayment} text="결제하기" />
      </section>
    </div>
  )
}

export default StorePage
