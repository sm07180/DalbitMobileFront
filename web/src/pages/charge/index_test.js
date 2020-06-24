import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Payment from './content/payment_test'
import WaitPayment from './content/wait-payment'
import ResultPayment from './content/result'

const RouteList = [
  {path: '', component: Payment, exact: true},
  {path: 'waitPayment', component: WaitPayment, exact: true},
  {path: 'result', component: ResultPayment, exact: true}
]

console.log('location.pathname', location.pathname)

export default () => {
  return (
    <div className="test-page">
      <Switch>
        {RouteList.map((item, index) => {
          const {path, component, exact} = item
          if (location.pathname === '/charge') {
            return <Route key={index} path={`/charge/${path}`} component={component} exact={exact} />
          } else if (location.pathname === '/charge_test') {
            return <Route key={index} path={`/charge_test/${path}`} component={component} exact={exact} />
          }
        })}
      </Switch>
    </div>
  )
}
