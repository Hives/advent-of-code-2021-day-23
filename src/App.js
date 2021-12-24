import './App.css';
import {useEffect, useState} from "react";

const input = [
  {id: 1, x: 2, y: 1, type: "A"},
  {id: 2, x: 2, y: 2, type: "D"},
  {id: 3, x: 2, y: 3, type: "D"},
  {id: 4, x: 2, y: 4, type: "B"},
  {id: 5, x: 4, y: 1, type: "D"},
  {id: 6, x: 4, y: 2, type: "C"},
  {id: 7, x: 4, y: 3, type: "B"},
  {id: 8, x: 4, y: 4, type: "C"},
  {id: 9, x: 6, y: 1, type: "A"},
  {id: 10, x: 6, y: 2, type: "B"},
  {id: 11, x: 6, y: 3, type: "A"},
  {id: 12, x: 6, y: 4, type: "D"},
  {id: 13, x: 8, y: 1, type: "B"},
  {id: 14, x: 8, y: 2, type: "A"},
  {id: 15, x: 8, y: 3, type: "C"},
  {id: 16, x: 8, y: 4, type: "C"},
]

const example = [
  {id: 1, x: 2, y: 1, type: "B"},
  {id: 2, x: 2, y: 2, type: "D"},
  {id: 3, x: 2, y: 3, type: "D"},
  {id: 4, x: 2, y: 4, type: "A"},
  {id: 5, x: 4, y: 1, type: "C"},
  {id: 6, x: 4, y: 2, type: "C"},
  {id: 7, x: 4, y: 3, type: "B"},
  {id: 8, x: 4, y: 4, type: "D"},
  {id: 9, x: 6, y: 1, type: "B"},
  {id: 10, x: 6, y: 2, type: "B"},
  {id: 11, x: 6, y: 3, type: "A"},
  {id: 12, x: 6, y: 4, type: "C"},
  {id: 13, x: 8, y: 1, type: "D"},
  {id: 14, x: 8, y: 2, type: "A"},
  {id: 15, x: 8, y: 3, type: "C"},
  {id: 16, x: 8, y: 4, type: "A"},
]

const initialState = input

const boardSquares = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [5, 0],
  [6, 0],
  [7, 0],
  [8, 0],
  [9, 0],
  [10, 0],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [8, 1],
  [8, 2],
  [8, 3],
  [8, 4],
].map(([x, y]) => `${x},${y}`)

const applyMove = (current, move) => {
  const {id, x, y} = move
  const thingToMove = current.find(entry => entry.id === id)
  const currentWithThingRemoved = current.filter(entry => entry.id !== id)

  return [...currentWithThingRemoved, {...thingToMove, x, y}]
}

const createHistoryDetails = moves => {
  let state = initialState
  let runningTotal = 0

  let historyDetails = [{runningTotal}]

  moves.forEach(move => {
    const movingThing = state.find(entry => entry.id === move.id)

    const type = movingThing.type

    const from = {x: movingThing.x, y: movingThing.y}
    const to = {x: move.x, y: move.y}

    const distance = (from.y === 0 || to.y === 0) ?
      Math.abs(from.x - to.x) + Math.abs(from.y - to.y) :
      Math.abs(from.x - to.x) + from.y + to.y
    const typeMultipliers = {"A": 1, "B": 10, "C": 100, "D": 1000}
    const cost = distance * typeMultipliers[type]

    runningTotal += cost

    const newDetail = {from, to, type, cost, runningTotal}
    historyDetails.push(newDetail)

    state = applyMove(state, move)
  })

  return historyDetails
}

function App() {
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  const [historyPointer, setHistoryPointer] = useState(0)

  const current = history.slice(0, historyPointer).reduce(applyMove, initialState)

  const historyDetails = createHistoryDetails(history)

  const getOccupant = (x, y) => current.find(entry => entry.x === x && entry.y === y)

  const moveSelectedTo = (x, y) => {
    setSelected(null)
    setHistory([...(history.slice(0, historyPointer)), {id: selected, x, y}])
    setHistoryPointer(historyPointer + 1)
  }

  const handleClick = (x, y) => {
    const occupant = getOccupant(x, y)
    const occupied = Boolean(occupant)

    if (selected) {
      if (occupied) {
        setSelected(null)
      } else {
        moveSelectedTo(x, y)
      }
    } else {
      if (occupied) {
        setSelected(occupant.id)
      }
    }
  }

  const handleMoveHistoryPointer = index => {
    setHistoryPointer(index)
  }

  const prev = () => {
    setHistoryPointer(Math.max(historyPointer - 1, 0))
  }

  const next = () => {
    setHistoryPointer(Math.min(historyPointer + 1, history.length))
  }

  // const onKeyPress = e => {
  //   if (e.key === "PageDown") setHistoryPointer(Math.min(historyPointer + 1, history.length))
  //   if (e.key === "PageUp") setHistoryPointer(Math.max(historyPointer - 1, -1))
  // }
  //
  // useEffect(() => {
  //   document.addEventListener("keydown", onKeyPress, false)
  // }, [onKeyPress])

  return (
    <div className="App">
      <div className="Left">
        <div className="Board">
          {[0, 1, 2, 3, 4].map(y => {
            return <div key={y} className="Row">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(x => {
                if (boardSquares.includes(`${x},${y}`)) {
                  const occupant = getOccupant(x, y)

                  const appliedClasses = ["Cell", "Space"]

                  if (selected && selected === occupant?.id) {
                    appliedClasses.push("Selected")
                  }

                  if (occupant) {
                    appliedClasses.push(`Type${occupant.type}`)
                  }

                  return (<div key={x} className={appliedClasses.join(" ")}
                               onClick={() => handleClick(x, y)}>{occupant?.type}</div>)
                }
                // wall
                return (<div key={x} className="Cell Wall">&nbsp;</div>)
              })}
            </div>
          })}
        </div>
        <div>
          <button onClick={prev}>Prev</button>
          Running total: {historyDetails.at(historyPointer).runningTotal}
          <button onClick={next}>Next</button>
        </div>
        <div>
          <textarea cols="30" rows="10">&nbsp;</textarea>
        </div>
      </div>
      <div className="History">
        <table>
          <thead>
          <tr>
            <th></th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Cost</th>
            <th>Running total</th>
          </tr>
          </thead>
          <tbody>
          {historyDetails.map((detail, index) => {
              const {type, from, to, cost, runningTotal} = detail
              return (<tr key={index}>
                <td>{index === historyPointer && "↠"}</td>
                <td>{type}</td>
                <td>{from && `${from.x}, ${from.y}`}</td>
                <td>{to && `${to.x}, ${to.y}`}</td>
                <td>{cost}</td>
                <td>{runningTotal}</td>
                <td>
                  <button onClick={() => handleMoveHistoryPointer(index)}>Go here</button>
                </td>
              </tr>);
            }
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
