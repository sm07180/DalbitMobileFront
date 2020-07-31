import React, {useContext, useEffect} from 'react'
import {Context} from 'context'
import Api from 'context/api'
import {OS_TYPE} from 'context/config'
export default function Service() {
  const context = useContext(Context)

  const customerHeader = JSON.parse(Api.customHeader)

  useEffect(() => {
    if (customerHeader.os === OS_TYPE['Android']) {
    } else if (customerHeader.os === OS_TYPE['IOS']) {
    } else {
    }
  }, [])
  return <div></div>
}
