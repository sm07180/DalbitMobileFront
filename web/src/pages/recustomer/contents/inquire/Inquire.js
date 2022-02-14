import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from '../../components/Tabmenu'
// contents
import InquireWrite from './InquireWrite'
import InquireLog from './InquireLog'
// css
import './inquire.scss'

const Inquire = (props) => {
  const inquireTabmenu = ['문의하기','나의 문의내역']
  const [inquire, setInquire] = useState(inquireTabmenu[0])

  return (
    <div id="inquire">
      <Header title="1:1 문의" type="back"/>
      <div className='subContent'>
        <Tabmenu data={inquireTabmenu} tab={inquire} setTab={setInquire} />
        {inquire === '문의하기' ?
          <InquireWrite/>
        :
          <InquireLog/>
        }
      </div>
    </div>
  )
}

export default Inquire
