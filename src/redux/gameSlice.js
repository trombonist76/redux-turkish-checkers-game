import { createSlice, current } from "@reduxjs/toolkit";
import gameBoard from "./gameBoard";
import { checkCaptured,lrFront,isAnyCaptured } from "./services";


const gameSlice = createSlice({
  
  name: "gameSlice",
  initialState: {
    gameBoard,
    activeIndex:null,
    activeElem:null,
    isLastPlayerCapture:false,
    playableAreas: [],
    activePieces:[],
    captured:{},
    player1:true
  },
  reducers: {
    setActive:(state, action) => {
      const elem = action.payload
      state.playableAreas = []
      state.activeIndex = elem.index
      state.activeElem = elem
    },


    setPlayer: (state,action) => {
      const isThereAnyCaptured = isAnyCaptured(state)
      if(state.isLastPlayerCapture){
        if(!isThereAnyCaptured){
          state.player1 = !state.player1
          state.isLastPlayerCapture = false
        }
      }else{
        state.player1 = !state.player1
      }
    },



    play:(state,action) => {
      const elem = action.payload
      const currentGameBoard = current(state.gameBoard)
      const activeElem = currentGameBoard.flat().find(e=> e.index === state.activeIndex)
      const currElem = currentGameBoard[elem.rowIndex][elem.elIndex]
      const isKing = !activeElem.isKing ? ((currElem.rowIndex === 0 && !activeElem.white ) || (currElem.rowIndex === 7 && activeElem.white )) ? true : false : true

      if (state.captured?.index){
        const captured = state.captured
        state.isLastPlayerCapture = true
        state.gameBoard[captured.rowIndex][captured.elIndex] = {...captured,isElement:0, white:null, isKing:false}
      }

      state.gameBoard[elem.rowIndex][elem.elIndex] = {...currElem, isElement:1, white: activeElem.white, isKing}
      state.gameBoard[activeElem.rowIndex][activeElem.elIndex] = {...activeElem, isElement:0, white:null, isKing:false}
      state.activeIndex = null
      state.activePieces = []
      state.playableAreas = []
      state.captured = {}



    },

    setPlayableAreas:(state,action) => {
      let playableAreas
      const {activeElem,player1,gameBoard} = state
      const activeElemLrfb = lrFront(activeElem,player1)
      const currentGameBoard = current(gameBoard).flat()
      const result = checkCaptured(activeElem,state)
      const maxMove = Math.max(...Object.values(result))

      if(maxMove === 0){
        playableAreas = currentGameBoard.flat().filter(e => Object.values(activeElemLrfb).includes(e.index) && !e.isElement)
        state.playableAreas = playableAreas
      }else{
        const direction = Object.keys(result).find(key=> result[key] === maxMove)
        const captured = currentGameBoard[activeElemLrfb[direction]]
        const behindCaptured = currentGameBoard[lrFront(captured,state.player1,true)[direction]]
        state.playableAreas = [behindCaptured]
        state.captured = captured
      }

    },

    checkMove:(state,action) => {
      const currentGameBoard = current(state.gameBoard).flat()
      const pieces = currentGameBoard.filter(piece=> piece.isElement && state.player1 ? !piece.white : piece.white)
      let maxMoveOfPieces = 0
      for(const piece of pieces){
        const lrfb = lrFront(piece,state.player1)

        let result = checkCaptured(piece,state)
        let maxMove = Math.max(...Object.values(result))
        let direction = Object.keys(result).find(key=> result[key] === maxMove)
        let captured = currentGameBoard[lrfb[direction]]
        let behindCaptured = currentGameBoard[lrFront(captured,state.player1,true)[direction]]

        if(maxMove >= maxMoveOfPieces && maxMove !== 0){
          state.playableAreas = [behindCaptured]
          state.captured = captured
        }

        if(maxMove > maxMoveOfPieces){
          state.activePieces = [piece.index]
          maxMoveOfPieces = maxMove
        }

        else if(maxMove === maxMoveOfPieces && maxMove !== 0){
          state.activePieces.push(piece.index)
          state.playableAreas = []
        }
        
      }
    }
  }
})



//actions
export const {setActive, play, setPlayableAreas, checkMove, setPlayer}  = gameSlice.actions


//selectors
export const gameBoardSelector = (state) => state.game.gameBoard
export const activeIndexSelector = (state) => state.game.activeIndex
export const playableAreasSelector = (state) => state.game.playableAreas
export const playerSelector = (state) => state.game.player1
export const capturedSelector = (state) => state.game.captured
export const activePiecesSelector = (state) => state.game.activePieces


//default
export default gameSlice.reducer