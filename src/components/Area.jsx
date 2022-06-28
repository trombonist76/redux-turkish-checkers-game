import React from 'react'
import { useSelector } from 'react-redux'
import { gameBoardSelector } from '../redux/gameSlice'
import Element from './Element'

export default function Area() {
  const gameBoard = useSelector(state=>gameBoardSelector(state))
  return (
    <main>
      {gameBoard.map((row,rowIndex)=>(
        <div className="row">
          {row.map((obj,index)=>(
            <Element obj={obj} index={index} rowIndex={rowIndex}/>
          ))}
        </div>
      ))}
    </main>
  )
}
