import React from 'react'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
// css

const data = [
  {
    rank : 4,
    type : '작사/작곡',
    title : 'ADOY - Wonder',
    nickNm : '도 은 _e'
  },
  {
    rank : 5,
    type : '수다/대화',
    title : '오늘은 이야기~',
    nickNm : '고 양 이'
  },
  {
    rank : 6,
    type : 'ASMR',
    title : '릭앤모티 소리듣는 거야',
    nickNm : '죠금 이상해'
  },
  {
    rank : 7,
    type : '작사/작곡',
    title : 'ADOY - Wonder',
    nickNm : '도 은 _e'
  },
]

export default () => {

  return (
    <>
      {data.map((list, index) => {
        return (
          <ListRow key={index}>
            <div className="rank">{list.rank}</div>
            <div className="listContent">
              <div className="listItem">
                <span className="type">{list.type}</span>
              </div>
              <div className="listItem">
                <span className="title">{list.title}</span>
              </div>
              <div className="listItem">
                <span className="nick">{list.nickNm}</span>
              </div>
            </div>
          </ListRow>
        )
      })}
    </>
  )
}
