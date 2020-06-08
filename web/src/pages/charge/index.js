import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Payment from './content/payment'
import WaitPayment from './content/wait-payment'

const RouteList = [
  {path: '', component: Payment, exact: true},
  {path: 'waitPayment', component: WaitPayment, exact: true}
]

export default () => {
  return (
    <div className="test-page">
      <Switch>
        {RouteList.map((item, index) => {
          const {path, component, exact} = item
          return <Route key={index} path={`/charge/${path}`} component={component} exact={exact} />
        })}
      </Switch>
    </div>
  )
}
