const rowValues = [0, 1, 1, 0, 0, 1, 1, 0]

const createObj = (elIndex, rowIndex, number) => {
  const index = (rowIndex * rowValues.length) + elIndex
  const obj = { isKing:false, isElement: number, white: null, rowIndex, elIndex, index}
  return number ? (rowIndex < 4 ? {...obj, white: true} : {...obj, white: false}) : obj
}

const gameBoard = rowValues.map((number, rowIndex) => rowValues.map((_ ,elIndex) => createObj(elIndex, rowIndex, number)))

export default gameBoard
