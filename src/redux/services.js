import {current } from "@reduxjs/toolkit";

export const lrFront = (elem, player1, moveMode=false) => {
  const isInFrontRow = player1 ? elem.index - 8 : elem.index + 8
  const isInBackRow = elem.isKing || moveMode ? (player1 ? elem.index + 8 : elem.index - 8) : null
  const notFirst = elem.elIndex !== 0
  const notLast = elem.elIndex !== 7

  const front = isInFrontRow 
  const back =  isInBackRow
  const right = player1 && notLast ? elem.index + 1 : elem.index - 1
  const left = player1 && notFirst ? elem.index - 1 : elem.index + 1

  const obj =  {
    front,
    back,
    right,
    left
  }

  return obj
}



export const goToCapture = (gameBoard,lastIndex,capturedIndex,currIndex) => {
  const last = gameBoard[lastIndex]
  const current = gameBoard[currIndex]
  const captured = gameBoard[capturedIndex]
  const inLastOrFirstRow = (current.rowIndex === 0 && !last.white ) || (current.rowIndex === 7 && last.white)
  const isKing = !last.isKing ? inLastOrFirstRow : true
  gameBoard[lastIndex] = {...last,isElement:0,white:null,isKing:false}
  gameBoard[capturedIndex] = {...captured,isElement:0,white:null,isKing:false}
  gameBoard[currIndex] = {...gameBoard[currIndex],isElement:1,white:last.white,isKing}
  return gameBoard
}


export const checkCaptured = (piece,state,parentKey=false) => {
  let obj = {left:0,right:0,front:0,back:0}
  const {gameBoard,player1} = state
  const currentGameBoard = current(gameBoard).flat()
  return recursive(piece,currentGameBoard,player1,obj)
  
}


const recursive = (piece,currentGameBoard,player1,obj,parentKey=false) => {
  const lrfb = lrFront(piece,player1)
  const potentialCaptureds = currentGameBoard.filter(e=> Object.values(lrfb).includes(e.index) && e.isElement === 1)
  let copiedBoard = [...currentGameBoard]

  for(let i = 0; i < potentialCaptureds.length; i++){

    const potentialPiece = potentialCaptureds[i]
    const key = Object.keys(lrfb).find(key => lrfb[key] === potentialPiece.index);
    console.log(piece,lrfb,key,potentialPiece)
    const behindPotential = currentGameBoard[lrFront(potentialPiece,player1,true)[key]]
    const captureCondition = !behindPotential.isElement && potentialPiece.white !== piece.white
    if(captureCondition){
      let newBoard = goToCapture(copiedBoard,piece.index,potentialPiece.index,behindPotential.index)
      let newPiece = newBoard[behindPotential.index]
      let controller = parentKey ? parentKey : key
      obj[controller] += 1
      recursive(newPiece,newBoard,player1,obj,controller)
    }  
  }
  
  return obj

}

export const isAnyCaptured = (state) => {
  
  const condition = (e) => e.isElement && state.player1 ? !e.white : e.white
  const isBigger = (obj) => Math.max(...Object.values(obj)) > 0
  const anyCaptured = current(state.gameBoard).flat().some((e)=>condition(e) && isBigger(checkCaptured(e,state)))

  return anyCaptured
}