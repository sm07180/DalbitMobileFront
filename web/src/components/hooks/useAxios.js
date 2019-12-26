/**
 @example
import useAxios from 'components/hooks/useAxios'

 const {loading, data, error, reload} = useAxios({url: 'https://my-url',method: 'POST'})

 <div>{loading ? 'waiting' : 'completed'}</div>
 */
import {useState, useEffect} from 'react'
import axios from 'axios'
import Config from 'context/config'
//
const useAxios = defaultValue => {
  //---------------------------------
  const [opts, setOpts] = useState({...defaultValue, headers: {token: localStorage.getItem('token')}, url: Config.devServer + defaultValue.url})
  const [state, setState] = useState({loading: true, error: null, data: null, callback: null})
  const [trigger, setTrigger] = useState(0)
  //---------------------------------

  //---------------------------------
  const reload = () => {
    setState({...state, loading: true, trigger: trigger})
    setTrigger(trigger + 1)
  }
  const ajax = option => {
    setOpts(opts => ({...opts, ...option, url: Config.devServer + option.url}))
    axios(opts)
      .then(data => {
        const {success, error} = data.data
        if (opts.callback !== undefined) {
          opts.callback(...data)
        }
        //  setState({...state, loading: false})
      })
      .catch(error => {
        //  setState({...state, loading: false, error})
        console.error(JSON.stringify(error))
        console.log(error)
      })

    reload()
  }
  useEffect(() => {
    axios(opts)
      .then(data => {
        const {success, error} = data.data
        if (success === false && error.code === 'E100') {
          //토큰이 유효하지않을경우
          //   alert('로그인페이지로 이동합니다.')
          window.location.href = '/'
        }
        setState({...state, loading: false, ...data})
        //callback있을경우 실행
        /*
        console.log(opts.callback)
        if (opts.callback !== undefined) {
          console.log(opts.callback)
          opts.callback(...data)
        }
        */
      })
      .catch(error => {
        setState({...state, loading: false, error})
        console.error(JSON.stringify(error))
        console.log(error)
      })
  }, [trigger])
  return {...state, reload, ajax}
}

export default useAxios
