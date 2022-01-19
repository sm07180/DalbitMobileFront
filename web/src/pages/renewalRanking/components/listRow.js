import React, {useState, useEffect} from 'react'

import '../style.scss'

const ListRow = (props) => {
  const {list, children, rank, badge, title, nick, data, gender} = props
  
  const [dataList, setDataList] = useState([])
  
  useEffect(() => {
    setDataList(data.split(" "));  
  }, []);

  return (
    <div className="listRow">
      {rank && <div className='rank'>{list.rank}</div>}      
      <div className="photo">
        <img src={list && list.profImg && list.profImg.thumb190x190} alt={list.nickNm} />
      </div>
      <div className='listContent'>
        { badge &&
          <div className='listItem'>
          </div>
        }
        { title &&
          <div className='listItem'>
            <span className="mainText"></span>
          </div>
        }
        { nick &&
          <div className={`listItem`}>
            {gender && <span className={`gender ${list.gender === "m" ? "male" : "female"}`}></span>}
            <span className={`${title ? "" : "mainText"}`}>{list.nickNm}</span>
          </div>
        }        
        { data &&
          <div className='listItem'>
            <div className='dataGroup'>
              {dataList.map((item, index) => {
                return (
                  <span key={index} className={`dataIcon ${item}`}>{list[item]}</span>
                )
              })}
            </div>             
          </div>
        }
      </div>
      <div className='listBack'>
        {children}
      </div>
    </div>
  )
}

ListRow.defaultProps = {
  list: [],
}

export default ListRow
