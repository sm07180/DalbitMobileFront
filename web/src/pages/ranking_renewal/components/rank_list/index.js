import React from 'react'

import RankList from './rank_list'
import NoResult from 'components/ui/noResult'

function RankListWrap({empty}) {
  return (
    <>
      {empty === true ? (
        <NoResult />
      ) : (
        <>
          <RankList />
        </>
      )}
    </>
  )
}

export default React.memo(RankListWrap)
