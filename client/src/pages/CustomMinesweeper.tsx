import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

// Vibrant color palette
const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD166", "#6A0572", "#AB83A1"];
const GRADIENT_START = "#5533FF";
const GRADIENT_END = "#2B8EFF";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 8px;
    border-radius: 8px;
  }
`;

const Board = styled.div`
  display: grid;
  gap: 3px;
  background: linear-gradient(135deg, ${GRADIENT_START}80, ${GRADIENT_END}80);
  padding: 8px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  max-width: 100%;

  @media (max-width: 768px) {
    gap: 2px;
    padding: 6px;
    border-radius: 8px;
  }
`;

const GameControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const FlagToggleButton = styled.button<{ active: boolean }>`
  display: none;
  padding: 8px 16px;
  background: ${(props) =>
    props.active
      ? `linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END})`
      : "linear-gradient(135deg, #e6e9f0 0%, #d4d7dd 100%)"};
  color: ${(props) => (props.active ? "white" : "#555")};
  border: none;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

interface CellProps {
  revealed: boolean;
  flagged: boolean;
  mine?: boolean;
  exploded?: boolean;
  wrongFlag?: boolean;
  gameOver?: boolean;
  cellSize?: number;
}

const Cell = styled.div<CellProps>`
  width: ${(props) => props.cellSize || 32}px;
  height: ${(props) => props.cellSize || 32}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) =>
    props.cellSize ? `${props.cellSize * 0.56}px` : "18px"};
  font-weight: bold;
  border-radius: 6px;
  background: ${(props) => {
    if (props.exploded) return "#FF6B6B";
    if (props.wrongFlag) return "#FFA07A";
    if (props.mine && props.revealed) return "#ffcccc";
    if (props.revealed) return "rgba(255, 255, 255, 0.85)";
    return "linear-gradient(135deg, #e6e9f0 0%, #d4d7dd 100%)";
  }};
  box-shadow: ${(props) =>
    props.revealed
      ? "inset 0 1px 3px rgba(0, 0, 0, 0.1)"
      : "0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -2px 0 rgba(0, 0, 0, 0.1)"};
  border: ${(props) =>
    props.exploded
      ? "2px solid #ff0000"
      : props.revealed
      ? "1px solid rgba(0, 0, 0, 0.1)"
      : "1px solid rgba(255, 255, 255, 0.6)"};
  cursor: ${(props) =>
    props.revealed || props.gameOver ? "default" : "pointer"};
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  transition: all 0.15s ease;
  transform: ${(props) => (props.revealed ? "scale(0.98)" : "scale(1)")};

  @media (hover: hover) {
    &:hover {
      background: ${(props) => {
        if (props.exploded) return "#FF6B6B";
        if (props.wrongFlag) return "#FFA07A";
        if (props.mine && props.revealed) return "#ffcccc";
        if (props.revealed) return "rgba(255, 255, 255, 0.85)";
        if (props.gameOver)
          return "linear-gradient(135deg, #e6e9f0 0%, #d4d7dd 100%)";
        return "linear-gradient(135deg, #e0e3e9 0%, #c8cbd1 100%)";
      }};
      transform: ${(props) =>
        props.revealed || props.gameOver ? "scale(0.98)" : "scale(1.05)"};
    }
  }

  &:active {
    transform: ${(props) => (props.revealed ? "scale(0.98)" : "scale(0.95)")};
  }
`;

interface CellData {
  revealed: boolean;
  mine: boolean;
  flagged: boolean;
  count: number;
  exploded?: boolean;
  wrongFlag?: boolean;
  safeToReveal?: boolean;
}

interface CustomMinesweeperProps {
  width: number;
  height: number;
  mines: number;
  onWin: () => void;
  onLose: () => void;
  onCellClick: () => void;
  onFlagChange: (count: number) => void;
  onCellReveal?: (data: {
    isCorrectFlag: boolean;
    isLogicalMove: boolean;
  }) => void;
}

const getAdjacentCells = (
  board: CellData[][],
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const adjacent = [];

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      const newX = x + i;
      const newY = y + j;

      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        adjacent.push({ x: newX, y: newY });
      }
    }
  }

  return adjacent;
};

const calculateCounts = (
  board: CellData[][],
  width: number,
  height: number
) => {
  const newBoard = JSON.parse(JSON.stringify(board));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!newBoard[y][x].mine) {
        let count = 0;
        const adjacent = getAdjacentCells(board, x, y, width, height);

        for (const cell of adjacent) {
          if (newBoard[cell.y][cell.x].mine) {
            count++;
          }
        }

        newBoard[y][x].count = count;
      }
    }
  }

  return newBoard;
};

const generateBoard = (
  width: number,
  height: number,
  mines: number
): CellData[][] => {
  // Initialize empty board
  let board = Array(height)
    .fill(null)
    .map(() =>
      Array(width)
        .fill(null)
        .map(() => ({
          revealed: false,
          mine: false,
          flagged: false,
          count: 0,
          safeToReveal: false,
        }))
    );

  // Place mines randomly
  let placedMines = 0;
  while (placedMines < mines) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if (!board[y][x].mine) {
      board[y][x].mine = true;
      placedMines++;
    }
  }

  // Calculate counts for cells
  board = calculateCounts(board, width, height);

  return board;
};

const CustomMinesweeper = ({
  width,
  height,
  mines,
  onWin,
  onLose,
  onCellClick,
  onFlagChange,
  onCellReveal,
}: CustomMinesweeperProps) => {
  const [board, setBoard] = useState<CellData[][]>(
    generateBoard(width, height, mines)
  );
  const [gameOver, setGameOver] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [flagCount, setFlagCount] = useState(0);
  const [explodedCell, setExplodedCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [flagMode, setFlagMode] = useState(false);

  // Touch handling state
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchedCell, setTouchedCell] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Calculate cell size based on difficulty and screen size
  const getCellSize = () => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Smaller cells on mobile
      if (width > 20) return 18; // Expert
      if (width > 12) return 22; // Intermediate
      return 28; // Beginner
    } else {
      // Desktop cell sizes
      if (width > 20) return 24; // Expert
      if (width > 12) return 28; // Intermediate
      return 32; // Beginner
    }
  };

  const cellSize = getCellSize();

  // Add a clickedRef to track if we've already processed a click
  const clickedRef = useRef(false);

  // Add a gameStartedRef to track if the game has started
  const gameStartedRef = useRef(false);

  useEffect(() => {
    setBoard(generateBoard(width, height, mines));
    setGameOver(false);
    setFirstClick(true);
    setFlagCount(0);
    setExplodedCell(null);
    onFlagChange(0);

    // Reset our refs when game is reset
    clickedRef.current = false;
    gameStartedRef.current = false;
  }, [width, height, mines]);

  useEffect(() => {
    // Check win condition
    if (!gameOver && !firstClick) {
      const totalCells = width * height;
      const revealedCells = board.flat().filter((cell) => cell.revealed).length;

      if (revealedCells === totalCells - mines) {
        setGameOver(true);
        onWin();
      }
    }
  }, [board, gameOver, firstClick]);

  // Handle touchstart event for long-press detection
  const handleTouchStart = (x: number, y: number) => {
    if (gameOver || board[y][x].revealed) return;

    setTouchedCell({ x, y });

    // Clear any existing timer just in case
    if (touchTimer) {
      clearTimeout(touchTimer);
    }

    // Set a timer for long press detection
    const timer = setTimeout(() => {
      // Long press detected, toggle flag
      handleFlagToggle(x, y);
      setTouchTimer(null);
    }, 500); // 500ms for long press

    setTouchTimer(timer);
  };

  // Handle touchend event to clear timer
  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }

    // If there's a touchedCell and the timer was cleared before executing,
    // it means it was a tap, not a long press
    if (touchedCell && !flagMode) {
      const { x, y } = touchedCell;
      revealCell(x, y);
    }

    setTouchedCell(null);
  };

  // Handle touchmove to prevent accidental reveals
  const handleTouchMove = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
    setTouchedCell(null);
  };

  // Add proper cleanup for touch events
  useEffect(() => {
    return () => {
      // Cleanup touch timer when component unmounts
      if (touchTimer) {
        clearTimeout(touchTimer);
      }
    };
  }, [touchTimer]);

  // Modify revealCell to be more robust
  const revealCell = (x: number, y: number) => {
    if (gameOver || board[y][x].revealed || board[y][x].flagged) return;

    // If in flag mode on mobile, toggle flag instead of revealing
    if (flagMode) {
      handleFlagToggle(x, y);
      return;
    }

    // First click handling with additional safeguards
    if (firstClick) {
      if (!gameStartedRef.current) {
        gameStartedRef.current = true;

        // Call onCellClick immediately to start the game
        onCellClick();

        // Make sure we mark first click as false right away
        setFirstClick(false);
      }

      // Ensure first click is never a mine
      if (board[y][x].mine) {
        // Create a proper deep copy for the board
        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[y][x].mine = false;

        // Find a new place for the mine
        let placed = false;
        while (!placed) {
          const newX = Math.floor(Math.random() * width);
          const newY = Math.floor(Math.random() * height);

          if (!newBoard[newY][newX].mine && (newX !== x || newY !== y)) {
            newBoard[newY][newX].mine = true;
            placed = true;
          }
        }

        // Recalculate counts and set the board
        const recalculatedBoard = calculateCounts(newBoard, width, height);
        setBoard(recalculatedBoard);

        // Instead of recursion which might cause issues, use a timeout to continue the operation
        setTimeout(() => {
          // We directly operate on the recalculated board
          revealCellOnBoard(recalculatedBoard, x, y);
        }, 0);
        return;
      }
    }

    // Otherwise proceed with normal reveal
    revealCellOnBoard(board, x, y);
  };

  // Extract the board modification logic into a separate function
  const revealCellOnBoard = (
    currentBoard: CellData[][],
    x: number,
    y: number
  ) => {
    // Create a proper deep copy of the board
    let newBoard = JSON.parse(JSON.stringify(currentBoard));

    // Check if this is a logical move
    const isLogicalMove = newBoard[y][x].safeToReveal === true;

    // Report the cell reveal with whether it's a logical move
    if (onCellReveal) {
      onCellReveal({
        isCorrectFlag: false,
        isLogicalMove: isLogicalMove || false,
      });
    }

    if (newBoard[y][x].mine) {
      handleMineHit(newBoard, x, y);
    } else {
      // Recursive reveal for empty cells
      const revealRecursive = (x: number, y: number) => {
        if (
          x < 0 ||
          x >= width ||
          y < 0 ||
          y >= height ||
          newBoard[y][x].revealed ||
          newBoard[y][x].flagged
        ) {
          return;
        }

        newBoard[y][x].revealed = true;

        if (newBoard[y][x].count === 0) {
          getAdjacentCells(newBoard, x, y, width, height).forEach((cell) => {
            revealRecursive(cell.x, cell.y);
          });
        }
      };

      // Reveal current cell and adjacent empty cells
      revealRecursive(x, y);
      setBoard(newBoard);
    }
  };

  // Extract mine hit logic to a separate function
  const handleMineHit = (newBoard: CellData[][], x: number, y: number) => {
    // Mark the exploded cell
    setExplodedCell({ x, y });

    // When player hits a mine, reveal the entire board with special states
    newBoard = newBoard.map((row: CellData[], rowIdx: number) =>
      row.map((cell: CellData, colIdx: number) => {
        // The exploded mine
        if (rowIdx === y && colIdx === x) {
          return { ...cell, revealed: true, exploded: true };
        }
        // Correctly flagged mines - leave flagged
        else if (cell.mine && cell.flagged) {
          return { ...cell };
        }
        // Wrong flags - show as wrong
        else if (cell.flagged && !cell.mine) {
          return { ...cell, revealed: true, wrongFlag: true };
        }
        // Other mines - reveal them
        else if (cell.mine) {
          return { ...cell, revealed: true };
        }
        // Safe cells - reveal them all for a better game over experience
        else {
          return { ...cell, revealed: true };
        }
      })
    );

    // First update the board state
    setBoard(newBoard);

    // Then set game over and call onLose after a short delay
    setGameOver(true);

    // Use a setTimeout to ensure board is updated first
    setTimeout(() => {
      onLose();
    }, 150);
  };

  const handleFlagToggle = (x: number, y: number) => {
    if (gameOver || board[y][x].revealed) return;

    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[y][x] = {
      ...newBoard[y][x],
      flagged: !newBoard[y][x].flagged,
    };

    setBoard(newBoard);

    const newFlagCount = newBoard
      .flat()
      .filter((cell: CellData) => cell.flagged).length;
    setFlagCount(newFlagCount);
    onFlagChange(newFlagCount);

    // Report correct flag placement if applicable
    if (!newBoard[y][x].flagged && onCellReveal) {
      onCellReveal({
        isCorrectFlag: newBoard[y][x].mine,
        isLogicalMove: false,
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    handleFlagToggle(x, y);
  };

  const getCellContent = (cell: CellData) => {
    if (cell.flagged) {
      if (cell.wrongFlag) {
        return "❌"; // Wrong flag
      }
      return "🚩"; // Flag
    }

    if (!cell.revealed) {
      return "";
    }

    if (cell.mine) {
      return cell.exploded ? "💥" : "💣";
    }

    return cell.count > 0 ? cell.count : "";
  };

  const getCellColor = (count: number) => {
    const numberColors = [
      "", // 0 - empty
      "#4ECDC4", // 1 - teal
      "#6A0572", // 2 - purple
      "#FF6B6B", // 3 - coral
      "#FFD166", // 4 - yellow
      "#AB83A1", // 5 - mauve
      "#5533FF", // 6 - blue
      "#2B8EFF", // 7 - light blue
      "#222222", // 8 - dark gray
    ];
    return count > 0 && count < numberColors.length
      ? numberColors[count]
      : "#222222";
  };

  return (
    <GameContainer>
      <Board
        style={{
          gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
          maxWidth: "100%",
        }}
      >
        {board.flatMap((row, y) =>
          row.map((cell, x) => (
            // Update the Cell rendering in the return statement
            <Cell
              key={`${x}-${y}`}
              revealed={cell.revealed}
              flagged={cell.flagged}
              mine={cell.mine}
              exploded={cell.exploded}
              wrongFlag={cell.wrongFlag}
              gameOver={gameOver}
              cellSize={cellSize}
              onClick={(e) => {
                // Stop event propagation to prevent bubbling
                e.stopPropagation();
                revealCell(x, y);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFlagToggle(x, y);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleTouchStart(x, y);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                handleTouchEnd();
              }}
              onTouchMove={(e) => {
                e.stopPropagation();
                handleTouchMove();
              }}
              style={{ color: getCellColor(cell.count) }}
            >
              {getCellContent(cell)}
            </Cell>
          ))
        )}
      </Board>

      {/* Mobile flag toggle button */}
      <GameControls>
        <FlagToggleButton
          active={flagMode}
          onClick={() => setFlagMode(!flagMode)}
        >
          {flagMode ? "🚩" : "👆"} {flagMode ? "Flag Mode" : "Dig Mode"}
        </FlagToggleButton>
      </GameControls>
    </GameContainer>
  );
};

export default CustomMinesweeper;
