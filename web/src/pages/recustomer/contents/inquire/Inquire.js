import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from "pages/recustomer/components/Tabmenu";
// contents
import InquireWrite from "pages/recustomer/contents/inquire/InquireWrite";
import InquireLog from "pages/recustomer/contents/inquire/InquireLog";
// css
import './inquire.scss'
import {Context} from "context";


const Inquire = () => {
  const inquireTabmenu = ['문의하기','나의 문의내역']
  const [inquire, setInquire] = useState(inquireTabmenu[0])
  const context = useContext(Context);

  return (
    <div id="inquire">
      <Header title="1:1 문의" type="back"/>
      {!context.token.isLogin ?
        <div className='subContent'>
          <InquireWrite setInquire={setInquire}/>
        </div>
        :
        <div className='subContent'>
          <Tabmenu data={inquireTabmenu} tab={inquire} setTab={setInquire} />
          {inquire === '문의하기' ?
            <InquireWrite setInquire={setInquire}/>
            :
            <InquireLog/>
          }
        </div>
      }

    </div>
  )
}

export default Inquire;
