import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Seo from './seo.js'
import Lee from './lee.js'

import Test from './test.js'

import Charge from './content/charge'
import Sample from './content/sample'

import WaitPayment from './content/wait-payment';
const RouteList = [
  {path: 'test', component: Lee, exact: true},
  {path: '', component: Test, exact: true},
  {path: 'waitPayment', component: WaitPayment, exact: true},
  {path: 'charge', component: Charge, exact: true},
  {path: 'sample', component: Sample, exact: true}
]

export default () => {
  return (
    <div className="test-page">
      <Switch>
        {RouteList.map((item, index) => {
          const {path, component, exact} = item
          return <Route key={index} path={`/temp_test/${path}`} component={component} exact={exact} />
        })}
      </Switch>
    </div>
  )
}
