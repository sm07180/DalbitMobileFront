import React, {useState, useEffect, useContext} from 'react'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'

import Write from 'pages/recustomer/contents/inquire/InquireWriteTest'
// components
import './inquire.scss'
import InquireLog from "pages/recustomer/contents/inquire/InquireLogTest";

const Inquire = () => {
  const inquireTabmenu = ['문의하기','나의 문의내역'];
  const [inquire, setInquire] = useState(inquireTabmenu[0]);

  return (
    <div id="inquire">
      <Header position={'sticky'} title={'1:1 문의'} type={'back'}/>
      <div className='subContent'>
        <ul className="tabmenu">
          {inquireTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: inquire,
              setTab: setInquire,
              // setPage: setPage
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
          <div className="underline"/>
        </ul>
        {
          inquire === '문의하기' ?
            <Write setInquire={setInquire}/>
            :
            <InquireLog/>
        }
      </div>
    </div>
  )
}

export default Inquire;
