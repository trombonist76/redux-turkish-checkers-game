import whiteImg from "../img/white.png"
import blackImg from "../img/black.png"
import whiteKing from "../img/whiteKing.png"
import blackKing from "../img/blackKing.png"
import { useDispatch,useSelector } from 'react-redux'
import { activeIndexSelector, checkMove, play, playableAreasSelector, setPlayer, playerSelector, setActive, activePiecesSelector, setPlayableAreas } from "../redux/gameSlice"
import classNames from "classnames"

export default function Element({obj}) {

  const dispatch = useDispatch()
  const activeIndex = useSelector(state=>activeIndexSelector(state))
  const playableAreas = useSelector(state=>playableAreasSelector(state))
  const activePieces = useSelector(state=>activePiecesSelector(state))
  const player1 = useSelector(state=>playerSelector(state))
  const {isElement,rowIndex, elIndex, index, white, isKing} = obj
  const isPiece = isElement === 1
  const elementColor = white ? (isKing ? whiteKing : whiteImg) : (isKing ? blackKing : blackImg)
  const isInPlayableAreas = playableAreas.find(e=>e?.index===index)
  const isNotInActivePieces = activePieces.length > 0 && !activePieces.includes(index) && !isInPlayableAreas
  const letters = ["a","b","c","d","e","f","g","h"]


  function handleClick(){

    if(isElement){
      dispatch(setActive(obj))
      dispatch(setPlayableAreas())
    }else if(isInPlayableAreas){
      dispatch(play(obj))
      dispatch(setPlayer())
      dispatch(checkMove())

    }
    
  }
  return (
    <button disabled={isNotInActivePieces || (white && player1) || (white === false && !player1)} onClick={handleClick} className={classNames("element",{
      "active" : index === activeIndex,
      "playablePiece" : activePieces.includes(index),
      "playable" : isInPlayableAreas,
      "element" : isElement,
      "default" : !isElement && !isInPlayableAreas
    })}>
      {isPiece && <img src={elementColor}/>}
      <div className="location">{letters.reverse()[rowIndex]}{elIndex+1}</div>
    </button>
  )
}
