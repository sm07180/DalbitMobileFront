import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
import Toast from 'components/ui/toast/Toast'
// components
import './question.scss'

const Question = (props) => { 

  return (
    <div id="question">
      <Header position={'sticky'} title={'1:1 문의'} type={'back'}/>
      <div className='subContent'>
        
      </div>
    </div>
  )
}

export default Question
