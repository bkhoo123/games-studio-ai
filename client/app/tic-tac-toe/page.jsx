"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

const page = () => {
  const [turn, setTurn] = useState(0);
  const [board, setBoard] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null))
  );
  const [gameMode, setGameMode] = useState("human"); // 'human' or 'ai'
  const [aiDifficulty, setAiDifficulty] = useState("hard"); // 'easy', 'medium', 'hard'
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleClick = (row, col) => {
    // Prevent marking an already filled cell or if the game has a winner
    if (board[row][col] || isAiThinking) {
      return;
    }

    // In AI mode, only allow human player (X) to click
    if (gameMode === "ai" && turn % 2 !== 0) {
      return;
    }

    const newBoard = board.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return turn % 2 === 0 ? "X" : "O";
        }
        return cell;
      })
    );
    setBoard(newBoard);
    setTurn(turn + 1);

    const winner = checkWinner(newBoard);
    if (winner) {
      setTimeout(() => {
        alert(`${winner} wins!`);
        handleReset();
      }, 100);
    } else if (newBoard.flat().every((cell) => cell !== null)) {
      setTimeout(() => {
        alert("It's a tie!");
        handleReset();
      }, 100);
    } else if (gameMode === "ai" && turn % 2 === 0) {
      // AI's turn after human move
      setTimeout(() => {
        makeAiMove(newBoard);
      }, 500);
    }
  };

  const handleReset = () => {
    setBoard(
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(null))
    ); // Reset the board
    setTurn(0);
    setIsAiThinking(false);
  };

  // AI Functions
  const getEmptyCells = (board) => {
    const emptyCells = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (!board[row][col]) {
          emptyCells.push([row, col]);
        }
      }
    }
    return emptyCells;
  };

  const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);

    if (winner === "O") return 10 - depth; // AI wins
    if (winner === "X") return depth - 10; // Human wins
    if (getEmptyCells(board).length === 0) return 0; // Tie

    if (isMaximizing) {
      let bestScore = -Infinity;
      const emptyCells = getEmptyCells(board);

      for (const [row, col] of emptyCells) {
        board[row][col] = "O";
        const score = minimax(board, depth + 1, false);
        board[row][col] = null;
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      const emptyCells = getEmptyCells(board);

      for (const [row, col] of emptyCells) {
        board[row][col] = "X";
        const score = minimax(board, depth + 1, true);
        board[row][col] = null;
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  const getBestMove = (board) => {
    let bestScore = -Infinity;
    let bestMove = null;
    const emptyCells = getEmptyCells(board);

    for (const [row, col] of emptyCells) {
      board[row][col] = "O";
      const score = minimax(board, 0, false);
      board[row][col] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }
    return bestMove;
  };

  const getRandomMove = (board) => {
    const emptyCells = getEmptyCells(board);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const makeAiMove = (currentBoard) => {
    setIsAiThinking(true);

    setTimeout(() => {
      let move;

      switch (aiDifficulty) {
        case "easy":
          // 30% chance of best move, 70% random
          move =
            Math.random() < 0.3
              ? getBestMove(currentBoard)
              : getRandomMove(currentBoard);
          break;
        case "medium":
          // 60% chance of best move, 40% random
          move =
            Math.random() < 0.6
              ? getBestMove(currentBoard)
              : getRandomMove(currentBoard);
          break;
        case "hard":
        default:
          // Always best move
          move = getBestMove(currentBoard);
          break;
      }

      if (move) {
        const [row, col] = move;
        const newBoard = currentBoard.map((rowArr, rowIndex) =>
          rowArr.map((cell, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return "O";
            }
            return cell;
          })
        );

        setBoard(newBoard);
        setTurn(turn + 2); // Skip to next human turn

        const winner = checkWinner(newBoard);
        if (winner) {
          setTimeout(() => {
            alert(`${winner} wins!`);
            handleReset();
          }, 100);
        } else if (newBoard.flat().every((cell) => cell !== null)) {
          setTimeout(() => {
            alert("It's a tie!");
            handleReset();
          }, 100);
        }
      }

      setIsAiThinking(false);
    }, 800); // AI thinking delay
  };

  const checkWinner = (board) => {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (
        board[row][0] &&
        board[row][0] === board[row][1] &&
        board[row][0] === board[row][2]
      ) {
        return board[row][0];
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col] &&
        board[0][col] === board[1][col] &&
        board[0][col] === board[2][col]
      ) {
        return board[0][col];
      }
    }

    // Check diagonals
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    ) {
      return board[0][0];
    }
    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      return board[0][2];
    }

    // No winner yet
    return null;
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-900">
      <Navbar />
      <div className="flex flex-col items-center">
        <div className="text-center text-4xl font-bold rounded-lg">
          <span className="text-orange-300 py-3 pl-4">Tic-</span>
          <span className=" text-orange-400 py-3">Tac-</span>
          <span className=" text-orange-500 py-3 pr-4">Toe</span>
        </div>

        <div className="text-white pt-24 flex flex-col items-center gap-6">
          {/* Game Mode Controls */}
          <div className="flex gap-4">
            <button
              className={`px-5 py-3 rounded-md font-bold text-xl transition duration-500 ease-in-out ${
                gameMode === "human"
                  ? "bg-[#8386F0] text-[#FAF8FF]"
                  : "bg-[#4B495F] text-gray-300 hover:bg-[#5A586F]"
              }`}
              onClick={() => {
                setGameMode("human");
                handleReset();
              }}
            >
              Human vs Human
            </button>
            <button
              className={`px-5 py-3 rounded-md font-bold text-xl transition duration-500 ease-in-out ${
                gameMode === "ai"
                  ? "bg-[#8386F0] text-[#FAF8FF]"
                  : "bg-[#4B495F] text-gray-300 hover:bg-[#5A586F]"
              }`}
              onClick={() => {
                setGameMode("ai");
                handleReset();
              }}
            >
              Play Against AI
            </button>
          </div>

          {/* AI Difficulty Selection */}
          {gameMode === "ai" && (
            <div className="flex gap-3 my-10 items-center">
              <span className="text-lg font-semibold text-gray-300">
                AI Difficulty:
              </span>
              {["easy", "medium", "hard"].map((difficulty) => (
                <button
                  key={difficulty}
                  className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${
                    aiDifficulty === difficulty
                      ? "bg-orange-500 text-white"
                      : "bg-[#4B495F] text-gray-300 hover:bg-[#5A586F]"
                  }`}
                  onClick={() => {
                    setAiDifficulty(difficulty);
                    handleReset();
                  }}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          )}

          <button
            className="bg-[#8386F0] px-5 py-3 rounded-md text-[#FAF8FF] font-bold text-2xl
              hover:bg-[#4B495F] transition duration-500 ease-in-out"
            onClick={handleReset}
          >
            New Game
          </button>
        </div>

        <div className="flex flex-grow items-center h-full flex-col">
          <div className="grid grid-cols-3 place-items-center justify-center gap-2 py-32">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  className={`tic-tac-box border-2 rounded-lg bg-[#4B495F] text-white border-black transition ease-in-out duration-500 w-20 h-20 flex items-center justify-center text-4xl font-bold ${
                    isAiThinking || (gameMode === "ai" && turn % 2 !== 0)
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-slate-400"
                  }`}
                >
                  {cell === "X" ? (
                    <span className="text-red-400 drop-shadow-lg">✕</span>
                  ) : cell === "O" ? (
                    <span className="text-blue-400 drop-shadow-lg">○</span>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Player/AI Status */}
        <div className="text-[#FAF8FF] text-3xl font-semibold bg-[#315247] px-5 py-3 rounded-md">
          {isAiThinking ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🤖</span>
              AI is thinking...
            </span>
          ) : gameMode === "ai" ? (
            turn % 2 === 0 ? (
              "Your turn (X)"
            ) : (
              "AI's turn (O)"
            )
          ) : turn % 2 === 0 ? (
            "Player 1 (X)"
          ) : (
            "Player 2 (O)"
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
