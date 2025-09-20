"use client"
import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'

const page = () => {
  const [turn, setTurn] = useState(0);
  const [board, setBoard] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
  
  const handleClick = (row, col) => {
    // Prevent marking an already filled cell or if the game has a winner
    if (board[row][col]) {
      return;
    }
    const newBoard = board.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return turn % 2 === 0 ? 'X' : 'O';
        }
        return cell;
      })
    );
    setBoard(newBoard);
    setTurn(turn + 1); // Increment turn

    const winner = checkWinner(newBoard);
    if (winner) {
      alert(`${winner} wins`)
      handleReset();
    } else if (newBoard.flat().every(cell => cell !== null)) {
      // Check if the board is full and there's no winner, indicating a tie
      alert("It is a tie nobody wins")
      handleReset();
    }
  };

  

  const handleReset = () => {
    setBoard(Array(3).fill(null).map(() => Array(3).fill(null))); // Reset the board
    setTurn(0);
  }

  const checkWinner = (board) => {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (board[row][0] && board[row][0] === board[row][1] && board[row][0] === board[row][2]) {
        return board[row][0];
      }
    }
  
    // Check columns
    for (let col = 0; col < 3; col++) {
      if (board[0][col] && board[0][col] === board[1][col] && board[0][col] === board[2][col]) {
        return board[0][col];
      }
    }
  
    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      return board[0][2];
    }
  
    // No winner yet
    return null;
  };

  
  return (
    <div className="w-full h-full min-h-screen bg-slate-900">

        <Navbar />
        <div className='flex flex-col items-center'>
          <div className="text-center text-4xl font-bold rounded-lg">
            <span className="text-orange-300 py-3 pl-4">Tic-</span>
            <span className=" text-orange-400 py-3">Tac-</span>
            <span className=" text-orange-500 py-3 pr-4">Toe</span>
          </div>

          <div className="text-white pt-24 flex gap-12">
            <button 
              className="bg-[#8386F0] px-5 py-3 rounded-md text-[#FAF8FF] font-bold text-2xl
              hover:bg-[#4B495F] transition duration-500 ease-in-out"
              onClick={handleReset}
            >
              New Game
            </button>
            <button
              className="bg-[#8386F0] px-5 py-3 rounded-md text-[#FAF8FF] font-bold text-2xl
              hover:bg-[#4B495F] transition duration-500 ease-in-out"
            >
              Play Against AI
            </button>
          </div>
        
          <div className="flex flex-grow items-center h-full flex-col">
            <div className="grid grid-cols-3 place-items-center justify-center gap-2 py-32">
              {board.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div 
                    key={`${rowIndex}-${colIndex}`} 
                    onClick={() => handleClick(rowIndex, colIndex)}
                    className="cursor-pointer hover:bg-slate-400 transition ease-in-out duration-500 tic-tac-box border-2 rounded-lg bg-[#4B495F] text-white border-black">
                    {cell}
                  </div>
                ))
              ))}
            </div>
         </div>


          
          <div className="text-[#FAF8FF] text-3xl font-semibold bg-[#315247] px-5 py-3 rounded-md ">
            {turn % 2 === 0 ? "Player 1" : "Player 2"}
          </div>
        </div>
    </div>
  )
}

export default page