import React from 'react'

import RankListTop from './rank_list_top'
import RankList from './rank_list'
import NoResult from 'components/ui/noResult'

function RankListWrap({empty}) {
  return (
    <>
      {empty === true ? (
        <NoResult />
      ) : (
        <>
          <RankListTop />
          <RankList />
        </>
      )}
    </>
  )
}

export default React.memo(RankListWrap)
