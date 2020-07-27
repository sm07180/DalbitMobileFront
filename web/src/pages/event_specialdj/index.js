import React from 'react'
import {Route, Switch} from 'react-router-dom'
import SpecialdjWrite from './checkwrite.js'
import Speacialdj from './speacialdj.js'
const Event_page = [
  {path: 'write', component: SpecialdjWrite, exact: true},
  {path: '', component: Speacialdj, exact: true}
]

export default () => {
  return (
    <div>
      <Switch>
        {Event_page.map((item, index) => {
          const {path, component, exact} = item
          return <Route key={index} path={`/event_specialdj/${path}`} component={component} exact={exact} />
        })}
      </Switch>
    </div>
  )
}