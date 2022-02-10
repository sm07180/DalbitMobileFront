import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
// components
import './inquire.scss'

const Inquire = (props) => { 
  const inquireTabmenu = ['문의하기','나의 문의내역']
  const [inquire, setInquire] = useState(inquireTabmenu[0])

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
          <div className="underline"></div>
        </ul>
        <div>
          
        </div>
      </div>
    </div>
  )
}

export default Inquire
