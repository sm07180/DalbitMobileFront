import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Seo from './seo.js'
import Lee from './Lee.js'

import Test from './test.js'

import Charge from './content/charge'
import Sample from './content/Sample'

const RouteList = [
  {path: '', component: Lee, exact: true},
  {path: 'test', component: Test, exact: true},
  {path: 'waitPayment', component: Seo, exact: true},
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
