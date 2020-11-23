import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

export default () => {
  const {roomNo} = useParams()
  const [storyList, setStoryList] = useState([])

  const fetchStory = async () => {
    const {result, data} = await getStory({roomNo})
    if (result === 'success') {
      const {list} = data
      setStoryList(list)
    }
  }

  useEffect(() => {
    fetchStory()
  }, [])

  return <div></div>
}
