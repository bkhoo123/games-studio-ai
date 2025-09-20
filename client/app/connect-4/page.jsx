"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

const page = () => {
  const ROWS = 6;
  const COLS = 7;

  const [board, setBoard] = useState(
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for human, 2 for AI
  const [gameMode, setGameMode] = useState("human"); // 'human' or 'ai'
  const [aiDifficulty, setAiDifficulty] = useState("hard");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  // Drop piece in column
  const dropPiece = (col) => {
    if (winner || isAiThinking) return false;
    if (gameMode === "ai" && currentPlayer === 2) return false;

    // Find the lowest available row in the column
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = board.map((r, rowIndex) =>
          r.map((cell, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return currentPlayer;
            }
            return cell;
          })
        );

        setBoard(newBoard);

        const gameWinner = checkWinner(newBoard, row, col, currentPlayer);
        if (gameWinner) {
          setWinner(gameWinner.player);
          setWinningCells(gameWinner.cells);
          return true;
        }

        if (isBoardFull(newBoard)) {
          setWinner("tie");
          return true;
        }

        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

        // If AI mode and it's AI's turn next
        if (gameMode === "ai" && currentPlayer === 1) {
          setTimeout(() => {
            makeAiMove(newBoard);
          }, 500);
        }

        return true;
      }
    }
    return false; // Column is full
  };

  // Check if board is full
  const isBoardFull = (board) => {
    return board[0].every((cell) => cell !== null);
  };

  // Check for winner
  const checkWinner = (board, row, col, player) => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal /
      [1, -1], // diagonal \
    ];

    for (const [deltaRow, deltaCol] of directions) {
      const cells = [[row, col]];

      // Check in positive direction
      let r = row + deltaRow;
      let c = col + deltaCol;
      while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r][c] === player
      ) {
        cells.push([r, c]);
        r += deltaRow;
        c += deltaCol;
      }

      // Check in negative direction
      r = row - deltaRow;
      c = col - deltaCol;
      while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r][c] === player
      ) {
        cells.unshift([r, c]);
        r -= deltaRow;
        c -= deltaCol;
      }

      if (cells.length >= 4) {
        return { player, cells };
      }
    }

    return null;
  };

  // AI Functions
  const evaluateBoard = (board, player) => {
    let score = 0;

    // Center column preference
    const centerCol = Math.floor(COLS / 2);
    for (let row = 0; row < ROWS; row++) {
      if (board[row][centerCol] === player) {
        score += 3;
      }
    }

    // Check all possible 4-piece windows
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        // Horizontal
        if (col <= COLS - 4) {
          score += evaluateWindow(
            [
              board[row][col],
              board[row][col + 1],
              board[row][col + 2],
              board[row][col + 3],
            ],
            player
          );
        }

        // Vertical
        if (row <= ROWS - 4) {
          score += evaluateWindow(
            [
              board[row][col],
              board[row + 1][col],
              board[row + 2][col],
              board[row + 3][col],
            ],
            player
          );
        }

        // Diagonal /
        if (row <= ROWS - 4 && col <= COLS - 4) {
          score += evaluateWindow(
            [
              board[row][col],
              board[row + 1][col + 1],
              board[row + 2][col + 2],
              board[row + 3][col + 3],
            ],
            player
          );
        }

        // Diagonal \
        if (row >= 3 && col <= COLS - 4) {
          score += evaluateWindow(
            [
              board[row][col],
              board[row - 1][col + 1],
              board[row - 2][col + 2],
              board[row - 3][col + 3],
            ],
            player
          );
        }
      }
    }

    return score;
  };

  const evaluateWindow = (window, player) => {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;

    const playerCount = window.filter((cell) => cell === player).length;
    const emptyCount = window.filter((cell) => cell === null).length;
    const opponentCount = window.filter((cell) => cell === opponent).length;

    if (playerCount === 4) {
      score += 100;
    } else if (playerCount === 3 && emptyCount === 1) {
      score += 10;
    } else if (playerCount === 2 && emptyCount === 2) {
      score += 2;
    }

    if (opponentCount === 3 && emptyCount === 1) {
      score -= 80;
    }

    return score;
  };

  const getValidColumns = (board) => {
    const validCols = [];
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === null) {
        validCols.push(col);
      }
    }
    return validCols;
  };

  const simulateMove = (board, col, player) => {
    const newBoard = board.map((row) => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = player;
        return { board: newBoard, row };
      }
    }
    return null;
  };

  const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
    const validCols = getValidColumns(board);

    // Check for terminal conditions
    for (const col of validCols) {
      const simulation = simulateMove(board, col, maximizingPlayer ? 2 : 1);
      if (
        simulation &&
        checkWinner(
          simulation.board,
          simulation.row,
          col,
          maximizingPlayer ? 2 : 1
        )
      ) {
        return maximizingPlayer ? 10000 - depth : -10000 + depth;
      }
    }

    if (validCols.length === 0 || depth === 0) {
      return evaluateBoard(board, 2) - evaluateBoard(board, 1);
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const col of validCols) {
        const simulation = simulateMove(board, col, 2);
        if (simulation) {
          const score = minimax(
            simulation.board,
            depth - 1,
            alpha,
            beta,
            false
          );
          maxEval = Math.max(maxEval, score);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const col of validCols) {
        const simulation = simulateMove(board, col, 1);
        if (simulation) {
          const score = minimax(simulation.board, depth - 1, alpha, beta, true);
          minEval = Math.min(minEval, score);
          beta = Math.min(beta, score);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  };

  const getBestMove = (board) => {
    const validCols = getValidColumns(board);
    let bestScore = -Infinity;
    let bestCol = validCols[Math.floor(Math.random() * validCols.length)];

    const depth =
      aiDifficulty === "easy" ? 2 : aiDifficulty === "medium" ? 4 : 6;

    for (const col of validCols) {
      const simulation = simulateMove(board, col, 2);
      if (simulation) {
        const score = minimax(
          simulation.board,
          depth,
          -Infinity,
          Infinity,
          false
        );
        if (score > bestScore) {
          bestScore = score;
          bestCol = col;
        }
      }
    }

    // Add randomness for easier difficulties
    if (aiDifficulty === "easy" && Math.random() < 0.6) {
      return validCols[Math.floor(Math.random() * validCols.length)];
    } else if (aiDifficulty === "medium" && Math.random() < 0.3) {
      return validCols[Math.floor(Math.random() * validCols.length)];
    }

    return bestCol;
  };

  const makeAiMove = (currentBoard) => {
    setIsAiThinking(true);

    setTimeout(() => {
      const bestCol = getBestMove(currentBoard);

      // Find the row where the piece will land
      let targetRow = -1;
      for (let row = ROWS - 1; row >= 0; row--) {
        if (!currentBoard[row][bestCol]) {
          targetRow = row;
          break;
        }
      }

      if (targetRow !== -1) {
        const newBoard = currentBoard.map((r, rowIndex) =>
          r.map((cell, colIndex) => {
            if (rowIndex === targetRow && colIndex === bestCol) {
              return 2;
            }
            return cell;
          })
        );

        setBoard(newBoard);

        const gameWinner = checkWinner(newBoard, targetRow, bestCol, 2);
        if (gameWinner) {
          setWinner(gameWinner.player);
          setWinningCells(gameWinner.cells);
        } else if (isBoardFull(newBoard)) {
          setWinner("tie");
        } else {
          setCurrentPlayer(1);
        }
      }

      setIsAiThinking(false);
    }, 800);
  };

  const handleReset = () => {
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(null))
    );
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells([]);
    setIsAiThinking(false);
  };

  const isWinningCell = (row, col) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-900">
      <Navbar />
      <div className="flex flex-col items-center">
        <div className="text-center text-4xl font-bold rounded-lg">
          <span className="text-yellow-300 py-3 pl-4">Connect</span>
          <span className="text-yellow-400 py-3 pr-4">-4</span>
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
                      ? "bg-yellow-500 text-white"
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

        {/* Game Board */}
        <div className="flex flex-col items-center mt-8">
          <div className="bg-stone-600 p-4 rounded-lg shadow-2xl">
            <div className="grid grid-cols-7 gap-1">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => dropPiece(colIndex)}
                    className={`w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      isAiThinking || (gameMode === "ai" && currentPlayer === 2)
                        ? "cursor-not-allowed opacity-50"
                        : currentPlayer === 1
                        ? "hover:bg-orange-300"
                        : "hover:bg-emerald-300"
                    }`}
                  >
                    {cell === 1 ? (
                      <div
                        className={`w-12 h-12 rounded-full transition-all duration-300 ${
                          isWinningCell(rowIndex, colIndex)
                            ? "bg-orange-400 shadow-lg animate-pulse ring-2 ring-orange-200"
                            : "bg-orange-600"
                        }`}
                      />
                    ) : cell === 2 ? (
                      <div
                        className={`w-12 h-12 rounded-full transition-all duration-300 ${
                          isWinningCell(rowIndex, colIndex)
                            ? "bg-emerald-400 shadow-lg animate-pulse ring-2 ring-emerald-200"
                            : "bg-emerald-600"
                        }`}
                      />
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-[#FAF8FF] text-3xl font-semibold bg-[#315247] px-5 py-3 rounded-md mt-8">
          {winner ? (
            winner === "tie" ? (
              "It's a tie! 🤝"
            ) : winner === 1 ? (
              gameMode === "ai" ? (
                "🎉 You won!"
              ) : (
                "🎉 Player 1 wins!"
              )
            ) : gameMode === "ai" ? (
              "🤖 AI wins!"
            ) : (
              "🎉 Player 2 wins!"
            )
          ) : isAiThinking ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🤖</span>
              AI is thinking...
            </span>
          ) : gameMode === "ai" ? (
            currentPlayer === 1 ? (
              "Your turn 🟠"
            ) : (
              "AI's turn 🟢"
            )
          ) : currentPlayer === 1 ? (
            "Player 1's turn 🟠"
          ) : (
            "Player 2's turn 🟢"
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
