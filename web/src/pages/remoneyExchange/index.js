import React, {useReducer, useEffect, useState, useContext} from 'react'
import Api from 'context/api'
import {Context} from 'context'

import DoExchange from './content/do_exchange'
import Result from '../remoneyExchange/content/result'
import './index.scss'

export default function MoneyExchange() {
  const [exchangePage, setExchangePage] = useState(true);
  return (
    <>
      
      <div id="exchangePage">
        {exchangePage === false ? <Result /> : <DoExchange />}
      </div>
    </>
  )
}