import React from 'react'

import RankList from './rank_list'
import NoResult from 'components/ui/noResult'

function RankListWrap() {
  return (
    <>
      <RankList />
    </>
  )
}

export default React.memo(RankListWrap)
