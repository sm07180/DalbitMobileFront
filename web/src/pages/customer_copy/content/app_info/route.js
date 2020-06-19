import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Service from './service';
import Privacy from './privacy';
import YouthProtect from './youth_protect';
import Operating from './operating';

const routeGroup = [
  {path: "service", component: Service},
  {path: "privacy", component: Privacy},
  {path: "youthProtect", component: YouthProtect},
  {path: "operating", component: Operating},
  
]

export default function AppInfoRoute() {
  return (
    <Switch>
      {
        routeGroup.map( (v,index) => {
          return <Route key={index} exact path={`/customer/appInfo/${v.path}`} component={v.component} />
        })
      }
    </Switch>
  )
}