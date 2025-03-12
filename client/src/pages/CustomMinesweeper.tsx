import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Vibrant color palette
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1'];
const GRADIENT_START = '#5533FF';
const GRADIENT_END = '#2B8EFF';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow-x: auto;
`;

const Board = styled.div`
  display: grid;
  gap: 3px;
  background: linear-gradient(135deg, ${GRADIENT_START}80, ${GRADIENT_END}80);
  padding: 8px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  max-width: 100%;
`;

interface CellProps {
  revealed: boolean;
  flagged: boolean;
  mine?: boolean;
  exploded?: boolean;
  cellSize?: number;
}

const Cell = styled.div<CellProps>`
  width: ${props => props.cellSize || 32}px;
  height: ${props => props.cellSize || 32}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.cellSize ? `${props.cellSize * 0.56}px` : '18px'};
  font-weight: bold;
  border-radius: 6px;
  background: ${props => {
    if (props.exploded) return '#FF6B6B';
    if (props.revealed) return 'rgba(255, 255, 255, 0.85)';
    return 'linear-gradient(135deg, #e6e9f0 0%, #d4d7dd 100%)';
  }};
  box-shadow: ${props => 
    props.revealed 
      ? 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' 
      : '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -2px 0 rgba(0, 0, 0, 0.1)'
  };
  border: ${props => 
    props.revealed
      ? '1px solid rgba(0, 0, 0, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.6)'
  };
  cursor: ${props => (props.revealed ? 'default' : 'pointer')};
  user-select: none;
  transition: all 0.15s ease;
  transform: ${props => (props.revealed ? 'scale(0.98)' : 'scale(1)')};

  &:hover {
    background: ${props => {
      if (props.exploded) return '#FF6B6B';
      if (props.revealed) return 'rgba(255, 255, 255, 0.85)';
      return 'linear-gradient(135deg, #e0e3e9 0%, #c8cbd1 100%)';
    }};
    transform: ${props => (props.revealed ? 'scale(0.98)' : 'scale(1.05)')};
  }
`;

interface CellData {
  revealed: boolean;
  mine: boolean;
  flagged: boolean;
  count: number;
  exploded?: boolean;
}

interface CustomMinesweeperProps {
  width: number;
  height: number;
  mines: number;
  onWin: () => void;
  onLose: () => void;
  onCellClick: () => void;
  onFlagChange: (count: number) => void;
}

const getAdjacentCells = (board: CellData[][], x: number, y: number, width: number, height: number) => {
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

const calculateCounts = (board: CellData[][], width: number, height: number) => {
  const newBoard = [...board];
  
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

const generateBoard = (width: number, height: number, mines: number): CellData[][] => {
  // Initialize empty board
  let board = Array(height).fill(null).map(() => 
    Array(width).fill(null).map(() => ({ 
      revealed: false, 
      mine: false, 
      flagged: false,
      count: 0 
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

const CustomMinesweeper = ({ width, height, mines, onWin, onLose, onCellClick, onFlagChange }: CustomMinesweeperProps) => {
  const [board, setBoard] = useState<CellData[][]>(generateBoard(width, height, mines));
  const [gameOver, setGameOver] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [flagCount, setFlagCount] = useState(0);
  const [explodedCell, setExplodedCell] = useState<{x: number, y: number} | null>(null);
  
  // Calculate cell size based on difficulty
  const getCellSize = () => {
    if (width > 20) return 24; // Expert level
    if (width > 12) return 28; // Intermediate level
    return 32; // Beginner level
  };
  
  const cellSize = getCellSize();

  useEffect(() => {
    setBoard(generateBoard(width, height, mines));
    setGameOver(false);
    setFirstClick(true);
    setFlagCount(0);
    setExplodedCell(null);
    onFlagChange(0);
  }, [width, height, mines]);

  useEffect(() => {
    // Check win condition
    if (!gameOver && !firstClick) {
      const totalCells = width * height;
      const revealedCells = board.flat().filter(cell => cell.revealed).length;
      
      if (revealedCells === totalCells - mines) {
        setGameOver(true);
        onWin();
      }
    }
  }, [board, gameOver, firstClick]);

  const revealCell = (x: number, y: number) => {
    if (gameOver || board[y][x].revealed || board[y][x].flagged) return;
    
    if (firstClick) {
      setFirstClick(false);
      onCellClick();
      
      // Ensure first click is never a mine
      if (board[y][x].mine) {
        // Move the mine to another location
        const newBoard = [...board];
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
        
        // Recalculate counts
        setBoard(calculateCounts(newBoard, width, height));
      }
    }
    
    let newBoard = [...board];
    
    // Recursive reveal for empty cells
    const revealRecursive = (x: number, y: number) => {
      if (x < 0 || x >= width || y < 0 || y >= height || newBoard[y][x].revealed || newBoard[y][x].flagged) {
        return;
      }
      
      newBoard[y][x].revealed = true;
      
      if (newBoard[y][x].count === 0) {
        getAdjacentCells(newBoard, x, y, width, height).forEach(cell => {
          revealRecursive(cell.x, cell.y);
        });
      }
    };
    
    if (board[y][x].mine) {
      // Mark the exploded cell
      setExplodedCell({x, y});
      
      // Reveal all mines when player hits a mine
      newBoard = newBoard.map((row, rowIdx) => 
        row.map((cell, colIdx) => {
          if (rowIdx === y && colIdx === x) {
            return { ...cell, revealed: true, exploded: true };
          }
          return cell.mine ? { ...cell, revealed: true } : cell;
        })
      );
      setBoard(newBoard);
      setGameOver(true);
      onLose();
    } else {
      // Reveal current cell and adjacent empty cells
      revealRecursive(x, y);
      setBoard([...newBoard]);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    
    if (gameOver || board[y][x].revealed) return;
    
    const newBoard = [...board];
    newBoard[y][x] = {
      ...newBoard[y][x],
      flagged: !newBoard[y][x].flagged
    };
    
    setBoard(newBoard);
    
    const newFlagCount = newBoard.flat().filter(cell => cell.flagged).length;
    setFlagCount(newFlagCount);
    onFlagChange(newFlagCount);
  };

  const getCellContent = (cell: CellData) => {
    if (!cell.revealed) {
      return cell.flagged ? '🚩' : '';
    }
    
    if (cell.mine) {
      return cell.exploded ? '💥' : '💣';
    }
    
    return cell.count > 0 ? cell.count : '';
  };
  
  const getCellColor = (count: number) => {
    const numberColors = [
      '', // 0 - empty
      '#4ECDC4', // 1 - teal
      '#6A0572', // 2 - purple
      '#FF6B6B', // 3 - coral
      '#FFD166', // 4 - yellow
      '#AB83A1', // 5 - mauve
      '#5533FF', // 6 - blue
      '#2B8EFF', // 7 - light blue
      '#222222'  // 8 - dark gray
    ];
    return count > 0 && count < numberColors.length ? numberColors[count] : '#222222';
  };

  // Calculate the total width including gap and padding
  const boardWidth = width * (cellSize + 3) + 16;
  
  return (
    <GameContainer>
      <Board style={{ 
        gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
        maxWidth: '100%'
      }}>
        {board.flatMap((row, y) => row.map((cell, x) => (
          <Cell 
            key={`${x}-${y}`} 
            revealed={cell.revealed} 
            flagged={cell.flagged}
            exploded={cell.exploded}
            cellSize={cellSize}
            onClick={() => revealCell(x, y)}
            onContextMenu={(e) => handleContextMenu(e, x, y)}
            style={{ color: getCellColor(cell.count) }}
          >
            {getCellContent(cell)}
          </Cell>
        )))}
      </Board>
    </GameContainer>
  );
};

export default CustomMinesweeper;