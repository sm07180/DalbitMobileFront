import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {Slider} from '@material-ui/core'
import {withStyles, makeStyles} from '@material-ui/core/styles'
//import * as audioVolumeHandler from 'components/lib/audioVolume'
import SignalingHandler from 'components/lib/SignalingHandler'
/**
 * volume state
 */
const useStyles = makeStyles({
  //기본 볼륨 height 지정
  root: {
    position: 'absolute',
    bottom: 35,
    right: -72,
    width: 22.3,
    height: 106,
    borderRadius: 25,
    background: '#000'
  },
  margin: {
    height: 94,
    paddingTop: 11
  }
})

const Volumebar = withStyles({
  root: {
    color: '#3f51b5',
    width: 100,
    height: 80,
    padding: 13
  },
  vertical: {
    height: 200
  },
  thumb: {
    left: 11,
    width: 10,
    height: 10,
    backgroundColor: '#fdad2b'
  },
  track: {
    width: 4 + 'px !important',
    backgroundColor: '#fdad2b',
    borderRadius: 50,
    height: 8,
    left: 9
  },
  rail: {
    left: 9,
    width: 4 + 'px !important',
    height: 88,
    opacity: 0.69,
    borderRadius: 50,
    backgroundColor: '#bdbdbd'
  }
})(Slider)
export default props => {
  const classes = useStyles()
  const [value, setValue] = useState(1)
  let volumeHandler = new SignalingHandler()
  // 볼륨 크기
  const handleChange = (event, newValue) => {
    volumeHandler.setAudioVolume(newValue)
    //audioVolumeHandler.setAudioVolume(newValue)
    setValue(newValue)
  }

  useEffect(() => {
    //console.log('I only run when the component first mounts')
    return () => {
      //console.log('I run when the component is unmounted')
    }
  }, [])
  return (
    <>
      <div className={classes.root}>
        <div className={classes.margin}>
          <Volumebar
            value={value}
            min={0}
            step={0.1}
            max={1}
            orientation="vertical"
            defaultValue={1}
            onChange={handleChange}
            aria-labelledby="vertical-slider"
          />
        </div>
      </div>
    </>
  )
}
