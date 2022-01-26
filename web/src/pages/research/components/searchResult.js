import React, {useState} from 'react'

import TabBtn from 'components/ui/tabBtn/TabBtn.js'

export default () => {
  const tabmenu = ['전체','DJ','라이브', '클립']

  const [tabName, setTabName] = useState(tabmenu[0])  

  return (
    <div className='searchResult'>
      <ul className="tabmenu">
        {tabmenu.map((data,index) => {
          const param = {
            item: data,
            tab: tabName,
            setTab: setTabName,
          }
          return (
            <TabBtn param={param} key={index} />
          )
        })}
      </ul>
      {(tabName === "DJ" || tabName === "전체") &&
        <div>
          DJ
        </div>      
      }
      {(tabName === "라이브" || tabName === "전체") &&
        <div>
          라이브
        </div>      
      }
      {(tabName === "클립" || tabName === "전체") &&
        <div>
          클립
        </div>      
      }
    </div>
  )
}