import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import Utility from 'components/lib/utility'

// global components
import Header from 'components/ui/header/Header'
import BannerSlide from 'components/ui/bannerSlide/BannerSlide'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
// contents
// css
import './style.scss'

const dalPrice = [
  {dal: 10,price:1100},
  {dal: 100,price:11000},
  {dal: 500,price:55000},
  {dal: 1000,price:110000},
  {dal: 5000,price:550000},
  {dal: 10000,price:1100000,bonus:500},
]

const StorePage = () => {
  const history = useHistory()
  const [select, setSelect] = useState(3);

  const [orderPage, setOrderPage] = useState(false);

  // 조회 Api

  // 결재단위 셀렉트
  const onSelectDal = (e) => {
    const {targetIndex} = e.currentTarget.dataset

    setSelect(targetIndex)
  }
  // Submit 버튼 클릭
  const onClickSubmit = () => {
    history.push('/store/dalcharge')
  }

  return (
    <>
      <div id="storePage">
        <Header title="스토어" position="sticky" type="back" />
        <section className="myhaveDal">
          <div className="title">내가 보유한 달</div>
          <span className="dal">{Utility.addComma(12345)}</span>
        </section>
        <section className="bannerWrap">
          <BannerSlide />
        </section>
        <section className="storeDalList">
          {dalPrice && dalPrice.map((data,index) => {
            return (
              <div className={`item ${Number(select) === index && 'active'}`} data-target-index={index} onClick={onSelectDal} key={index}>
                <div className="itemIcon"></div>
                <div className="dal">{Utility.addComma(data.dal)}</div>
                {data.bonus !== undefined && <div className='bonus'>{`+${Utility.addComma(data.bonus)}`}</div>}
                <div className="price">{`￦${Utility.addComma(data.price)}`}</div>
              </div>
            )
          })}
        </section>
        <SubmitBtn text="결제하기" onClick={onClickSubmit} />
      </div>
    </>
  )
}

export default StorePage
