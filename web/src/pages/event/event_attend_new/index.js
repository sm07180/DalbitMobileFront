import React from 'react'

import Content from './content'
import './event_attend.scss'

import {EventAttendProvider} from './attend_ctx'

export default function EventAttend() {
  return (
    <EventAttendProvider>
      <Content />
    </EventAttendProvider>
  )
}
