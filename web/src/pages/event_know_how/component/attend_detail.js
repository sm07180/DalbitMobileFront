import React from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/new_header'

function AttendDetail() {
  const history = useHistory()
  return (
    <div className="attendDetailWrap">
      <Header title={'방송 노하우 상세 보기'} />
      <div className="">
        <div>
          <img />
          <div>
            <div>
              <span>유현</span>
            </div>
            <div></div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AttendDetail)
