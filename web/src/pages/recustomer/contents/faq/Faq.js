import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import Toast from 'components/ui/toast/Toast'
// components
import './faq.scss'

const Faq = (props) => { 

  return (
    <div id="faq">
      <Header position={'sticky'} title={'FAQ'} type={'back'}/>
      <div className='subContent'>
        
      </div>
    </div>
  )
}

export default Faq
