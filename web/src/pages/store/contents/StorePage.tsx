import React, {useEffect} from "react";
import '../style.scss'
import Header from "../../../components/ui/header/Header";
import Utility from "../../../components/lib/utility";
import {useHistory} from "react-router-dom";
import {
  DalPriceType,
  ModeTabType,
  ModeType,
  OsType,
  StorePagePropsType,
  StoreTabInfoType
} from "../../../redux/types/pay/storeType";
import {Hybrid} from "../../../context/hybrid";
import {OS_TYPE} from "../../../context/config";
import Tabmenu from "../../broadcast/content/right_content/component/tabmenu";

const StorePage = ({storeInfo, storeTabInfo, setStoreTabInfo}: StorePagePropsType)=>{
  // console.log(`@@ storeInfo ->`, storeInfo);
  // console.log(`@@ storeTabInfo ->`, storeTabInfo);
  const history = useHistory()
  const movePayment = (item:DalPriceType) => {
    if(storeInfo.mode === ModeType.none){
      console.log(`storeInfo.mode none`)
      return;
    }
    const tabInfo = storeTabInfo.find(f=>f.selected);
    if(!tabInfo){
      return;
    }

    if(tabInfo.modeTab === ModeTabType.inApp){
      if(storeInfo.deviceInfo.os === OS_TYPE.Android){
        Hybrid('reqItemBuy', {
          itemCode: '',
          itemKey: '',
          version: ''
        });
      }
      if(storeInfo.deviceInfo.os === OS_TYPE.IOS){
        Hybrid('openInApp', '');
      }
      return;
    }else{
      const otherPageLocation = {
        pathname: '/store/dalcharge',
        search: `?itemNm=${encodeURIComponent(item.itemNm)}&price=${item.itemPrice}&itemNo=${item.itemNo}&dal=${item.givenDal}`
      }
      history.push(otherPageLocation);
    }
  }

  const tabMenuPros = {
    data: Array.from(storeTabInfo, a=>a.text),
    tab: storeTabInfo.find(f=>f.selected)?.text,
    setTab: (text)=>{
      const copy:Array<StoreTabInfoType> = [...storeTabInfo].map(m=>{
        m.selected = m.text === text;
        return m;
      });
      setStoreTabInfo(copy);
    }
  }
  const nowTab = storeTabInfo.find(f=>f.selected);
  // alert(JSON.stringify(storeTabInfo));

  useEffect(()=>{
    // alert(JSON.stringify(storeTabInfo));
  }, [])
  return (
    <div id="storePage">
      <Header title={'스토어'} position="sticky" type="back" backEvent={()=>{
        history.push("/")
      }}/>
      <section className="myhaveDal">
        <div className="title">내가 보유한 달</div>
        <span className="dal">{Utility.addComma(storeInfo.dalCnt)}</span>
      </section>
      {
        storeTabInfo.filter(f=>f.active).length === storeTabInfo.length &&
        <section className="storeTabWrap">
          <Tabmenu {...tabMenuPros} />
          {
            nowTab?.hasTip &&
            <div className="tipWrap">
              <div className="title">
                <i/>결제 TIP
              </div>
              <p>PC 또는 {storeInfo.deviceInfo.os === OsType.IOS ? '사파리를':'크롬을'} 통해 달 구입시, 훨씬 더 많은 달을 받을 수 있습니다.</p>
              <p>
                www.dallalive.com
              </p>
            </div>
          }
        </section>
      }

      <section className="storeDalList">
        {
          storeInfo.dalPriceList && storeInfo.dalPriceList.map((item, index) =>
            <div className={`item`} data-target-index={index} key={index}
                 onClick={()=>{
                   movePayment(item);
                   // onSelectDal(index, item.itemNm, item.givenDal, item.itemPrice, item.itemNo)
                 }} >
              <div className="itemIcon"/>
              <div className="dal">{Utility.addComma(item.givenDal)}</div>
              {item.salePrice === 1100000 && <div className='bonus'>{`+${Utility.addComma(500)}`}</div>}
              <div className="price">{`￦${Utility.addComma(item.salePrice)}`}</div>
            </div>
          )}

        {/*<SubmitBtn onClick={movePayment} text="결제하기" />*/}
      </section>
    </div>
  )
}

export default StorePage
