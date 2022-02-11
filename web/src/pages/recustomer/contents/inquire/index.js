import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import ImageUpload from 'components/ui/imageUpload/ImageUpload'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

import InquireInput from '../../components/InquireInput'
import Write from './write/Write'
// components
import './inquire.scss'

const Inquire = (props) => { 
  const inquireContent = `아래 내용을 함께 보내주시면 더욱 빠른 처리가 가능합니다.

OS (ex-Window 버전10) : 
브라우저 : 
문제발생 일시 :  
문의내용 : 
`
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
        {
          inquire === '문의하기' ?
            <Write/>
          :
           <>
            나의문의내역
           </>
        }        
      </div>
    </div>
  )
}

export default Inquire
