import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { saveScore } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import CustomMinesweeper from "./CustomMinesweeper";

// Matching color palette from navbar
const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD166", "#6A0572", "#AB83A1"];
const GRADIENT_START = "#5533FF";
const GRADIENT_END = "#2B8EFF";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
`;

const GameTitle = styled.h2`
  background: linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END});
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin: 0;
  font-weight: 700;
`;

const DifficultySelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  justify-content: center;
`;

const DifficultyButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: ${(props) =>
    props.active
      ? `linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END})`
      : "#f5f5f5"};
  color: ${(props) => (props.active ? "white" : "#555")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active
      ? "0 4px 10px rgba(85, 51, 255, 0.2)"
      : "0 2px 5px rgba(0, 0, 0, 0.05)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.active
        ? "0 6px 12px rgba(85, 51, 255, 0.3)"
        : "0 4px 8px rgba(0, 0, 0, 0.1)"};
  }
`;

const GameStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  padding: 12px 20px;
  background: linear-gradient(to right, ${GRADIENT_START}10, ${GRADIENT_END}10);
  border-radius: 12px;
  font-size: 1.2rem;
  width: fit-content;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: ${GRADIENT_START};
`;

const StatIcon = styled.span`
  color: ${COLORS[2]};
`;

const WinMessage = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(to right, #d4edda, #c3e6cb);
  color: #155724;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #4caf50;
  width: 100%;
  max-width: 400px;
`;

const LoseMessage = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(to right, #f8d7da, #f5c6cb);
  color: #721c24;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${COLORS[0]};
  width: 100%;
  max-width: 400px;
`;

const GameButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END});
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(85, 51, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(85, 51, 255, 0.3);
  }
`;

const PlayAgainButton = styled(GameButton)`
  margin-top: 10px;
  background: ${(props) =>
    props.color ||
    `linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END})`};
`;

interface GameProps {
  onGameComplete?: (
    score: number,
    difficulty: string,
    won: boolean,
    time: number
  ) => void;
}

type DifficultyLevel = "beginner" | "intermediate" | "expert";

const difficultySettings = {
  beginner: { width: 9, height: 9, mines: 10 },
  intermediate: { width: 16, height: 16, mines: 40 },
  expert: { width: 24, height: 16, mines: 60 },
};

const MinesweeperGame: React.FC<GameProps> = ({ onGameComplete }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [gameKey, setGameKey] = useState(1);
  const [gameState, setGameState] = useState({
    status: "waiting",
    startTime: 0,
    endTime: 0,
    flagsPlaced: 0,
  });
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const debugRef = useRef({
    lastClickTime: 0,
    clicksRegistered: 0,
    gameStarted: false,
  });

  // Add these new state variables to track game statistics
  const [gameStats, setGameStats] = useState({
    cellsOpened: 0,
    correctFlags: 0,
    wrongFlags: 0,
  });

  // Add a new state for score breakdown
  const [scoreBreakdown, setScoreBreakdown] = useState<{
    baseScore: number;
    cellOpeningPoints: number;
    correctFlagPoints: number;
    wrongFlagPenalty: number;
    timeDecay: number;
    winBonus?: number;
    finalScore: number;
  } | null>(null);

  // Add this function to update game stats when cells are revealed or flags are placed
  const updateGameStats = (stats: {
    cellRevealed?: boolean;
    isCorrectFlag?: boolean;
    isWrongFlag?: boolean;
  }) => {
    setGameStats((prev) => ({
      cellsOpened: stats.cellRevealed ? prev.cellsOpened + 1 : prev.cellsOpened,
      correctFlags: stats.isCorrectFlag
        ? prev.correctFlags + 1
        : prev.correctFlags,
      wrongFlags: stats.isWrongFlag ? prev.wrongFlags + 1 : prev.wrongFlags,
    }));
  };

  // Start/stop timer based on game status
  useEffect(() => {
    if (gameState.status === "playing") {
      timerRef.current = setInterval(() => {
        setTime(Math.floor((Date.now() - gameState.startTime) / 1000));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.status, gameState.startTime]);

  // Reset timer when difficulty changes
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  // Reset game stats when resetting the game
  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setGameKey((prevKey) => prevKey + 1);
    setGameState({
      status: "waiting",
      startTime: 0,
      endTime: 0,
      flagsPlaced: 0,
    });
    setTime(0);
    setGameStats({
      cellsOpened: 0,
      correctFlags: 0,
      wrongFlags: 0,
    });
    setScoreBreakdown(null);
  };

  const handleGameStart = () => {
    if (gameState.status === "waiting") {
      console.log("Game starting...");
      const startTime = Date.now();

      // Set state immediately with startTime
      setGameState((prevState) => ({
        ...prevState,
        status: "playing",
        startTime: startTime,
      }));

      // Start timer immediately to avoid delay
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
  };

  // Replace the existing handleGameWin function with this improved version
  const handleGameWin = async () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - gameState.startTime) / 1000);

    setGameState({
      ...gameState,
      status: "won",
      endTime: endTime,
    });

    // Enhanced scoring system parameters
    const difficultyParams = {
      beginner: {
        baseScore: 100,
        pointsPerCell: 2,
        pointsPerCorrectFlag: 5,
        penaltyPerWrongFlag: -10,
        timeDecay: 0.3,
        winBonus: 50,
      },
      intermediate: {
        baseScore: 250,
        pointsPerCell: 3,
        pointsPerCorrectFlag: 8,
        penaltyPerWrongFlag: -15,
        timeDecay: 0.2,
        winBonus: 100,
      },
      expert: {
        baseScore: 400,
        pointsPerCell: 4,
        pointsPerCorrectFlag: 10,
        penaltyPerWrongFlag: -20,
        timeDecay: 0.1,
        winBonus: 150,
      },
    };

    const params = difficultyParams[difficulty];

    // Calculate total board size and safe cells
    const totalCells =
      difficultySettings[difficulty].width *
      difficultySettings[difficulty].height;
    const safeCells = totalCells - difficultySettings[difficulty].mines;

    // Calculate each component of the score
    const baseScore = params.baseScore;

    // Points for cells opened (all safe cells should be opened in a win)
    const cellOpeningPoints = safeCells * params.pointsPerCell;

    // Points for correct flags (all mines should be correctly flagged in an optimal win)
    const mineCount = difficultySettings[difficulty].mines;
    const correctFlagPoints =
      Math.min(gameStats.correctFlags, mineCount) * params.pointsPerCorrectFlag;

    // Penalty for wrong flags
    const wrongFlagPenalty = gameStats.wrongFlags * params.penaltyPerWrongFlag;

    // Time decay (capped at 40% of base score)
    const timeDecayMax = baseScore * 0.4;
    const timeDecay = Math.min(timeTaken * params.timeDecay, timeDecayMax);

    // Win bonus
    const winBonus = params.winBonus;

    // Calculate final score (ensure minimum score is 10)
    let score = Math.round(
      baseScore +
        cellOpeningPoints +
        correctFlagPoints +
        wrongFlagPenalty -
        timeDecay +
        winBonus
    );

    score = Math.max(score, 10);

    console.log(`Score breakdown:
      Base score: ${baseScore}
      Cell opening: +${cellOpeningPoints} (${safeCells} cells)
      Correct flags: +${correctFlagPoints} (${gameStats.correctFlags} flags)
      Wrong flags: ${wrongFlagPenalty} (${gameStats.wrongFlags} flags)
      Time decay: -${timeDecay.toFixed(1)} (${timeTaken}s)
      Win bonus: +${winBonus}
      Final score: ${score}
    `);

    const scoreBreakdownData = {
      baseScore,
      cellOpeningPoints,
      correctFlagPoints,
      wrongFlagPenalty,
      timeDecay,
      winBonus,
      finalScore: score,
    };

    setScoreBreakdown(scoreBreakdownData);

    if (isAuthenticated && onGameComplete) {
      try {
        await saveScore({
          score,
          difficulty: difficulty.toLowerCase(),
          time: timeTaken,
          won: true,
        });

        onGameComplete(score, difficulty.toLowerCase(), true, timeTaken);
        toast.success(`Score saved: ${score} points`);
      } catch (error) {
        console.error("Error saving score:", error);
        toast.error("Failed to save score");
      }
    }
  };

  // Replace the existing handleGameLoss function with this improved version
  const handleGameLoss = () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - gameState.startTime) / 1000);

    setGameState({
      ...gameState,
      status: "lost",
      endTime: endTime,
    });

    // Enhanced scoring system for loss
    const difficultyParams = {
      beginner: {
        baseScore: 25,
        pointsPerCell: 1.5,
        pointsPerCorrectFlag: 3,
        penaltyPerWrongFlag: -5,
        timeDecay: 0.15,
      },
      intermediate: {
        baseScore: 60,
        pointsPerCell: 2,
        pointsPerCorrectFlag: 5,
        penaltyPerWrongFlag: -8,
        timeDecay: 0.1,
      },
      expert: {
        baseScore: 100,
        pointsPerCell: 2.5,
        pointsPerCorrectFlag: 7,
        penaltyPerWrongFlag: -10,
        timeDecay: 0.05,
      },
    };

    const params = difficultyParams[difficulty];

    // Calculate score components for loss scenario
    const baseScore = params.baseScore;
    const cellOpeningPoints = gameStats.cellsOpened * params.pointsPerCell;
    const correctFlagPoints =
      gameStats.correctFlags * params.pointsPerCorrectFlag;
    const wrongFlagPenalty = gameStats.wrongFlags * params.penaltyPerWrongFlag;

    // Less severe time decay for losses (max 25% of base)
    const timeDecayMax = baseScore * 0.25;
    const timeDecay = Math.min(timeTaken * params.timeDecay, timeDecayMax);

    // Calculate final score (minimum 5)
    let score = Math.round(
      baseScore +
        cellOpeningPoints +
        correctFlagPoints +
        wrongFlagPenalty -
        timeDecay
    );

    score = Math.max(score, 5);

    // Set the score breakdown for display
    const scoreBreakdownData = {
      baseScore,
      cellOpeningPoints,
      correctFlagPoints,
      wrongFlagPenalty,
      timeDecay,
      finalScore: score,
    };

    setScoreBreakdown(scoreBreakdownData);

    if (isAuthenticated && onGameComplete) {
      try {
        saveScore({
          score,
          difficulty: difficulty.toLowerCase(),
          time: timeTaken,
          won: false,
        });

        onGameComplete(score, difficulty.toLowerCase(), false, timeTaken);
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }
  };

  const handleFlagChange = (flagsCount: number) => {
    setGameState({ ...gameState, flagsPlaced: flagsCount });
  };

  const changeDifficulty = (level: DifficultyLevel) => {
    if (gameState.status === "playing") {
      if (
        window.confirm(
          "Changing difficulty will reset your current game. Continue?"
        )
      ) {
        setDifficulty(level);
      }
    } else {
      setDifficulty(level);
    }
  };

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>Minesweeper</GameTitle>
        <GameButton onClick={resetGame}>New Game</GameButton>
      </GameHeader>

      <DifficultySelector>
        {Object.keys(difficultySettings).map((level) => (
          <DifficultyButton
            key={level}
            active={difficulty === level}
            onClick={() => changeDifficulty(level as DifficultyLevel)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </DifficultyButton>
        ))}
      </DifficultySelector>

      <GameStats>
        <StatItem>
          <StatIcon>⏱️</StatIcon>
          {time}s
        </StatItem>
        <StatItem>
          <StatIcon>💣</StatIcon>
          {difficultySettings[difficulty].mines - gameState.flagsPlaced}
        </StatItem>
      </GameStats>

      <CustomMinesweeper
        key={gameKey}
        width={difficultySettings[difficulty].width}
        height={difficultySettings[difficulty].height}
        mines={difficultySettings[difficulty].mines}
        onWin={handleGameWin}
        onLose={handleGameLoss}
        onCellClick={() => {
          // Debug tracking
          debugRef.current.lastClickTime = Date.now();
          debugRef.current.clicksRegistered++;
          debugRef.current.gameStarted = true;

          // Call handleGameStart with a slight delay to ensure React state updates
          handleGameStart();
        }}
        onFlagChange={handleFlagChange}
        onCellReveal={(stats) => {
          updateGameStats({
            cellRevealed: true,
            isCorrectFlag: stats.isCorrectFlag,
            isWrongFlag: stats.isWrongFlag,
          });
        }}
      />

      {gameState.status === "won" && scoreBreakdown && (
        <WinMessage>
          <h3>Victory! 🎉</h3>
          <p>Completed in {time} seconds</p>

          <div className="mt-2 text-left text-sm">
            <p>
              <strong>Score Breakdown:</strong>
            </p>
            <p>Base Score: +{scoreBreakdown.baseScore}</p>
            <p>Cells Opened: +{scoreBreakdown.cellOpeningPoints}</p>
            <p>Correct Flags: +{scoreBreakdown.correctFlagPoints}</p>
            {scoreBreakdown.wrongFlagPenalty !== 0 && (
              <p>Wrong Flags: {scoreBreakdown.wrongFlagPenalty}</p>
            )}
            <p>Time Penalty: -{scoreBreakdown.timeDecay.toFixed(1)}</p>
            <p>Win Bonus: +{scoreBreakdown.winBonus}</p>
            <p className="font-bold mt-1">
              Total Score: {scoreBreakdown.finalScore}
            </p>
          </div>

          <PlayAgainButton onClick={resetGame}>Play Again</PlayAgainButton>
        </WinMessage>
      )}

      {gameState.status === "lost" && scoreBreakdown && (
        <LoseMessage>
          <h3>Game Over 💥</h3>
          <p>Better luck next time!</p>

          <div className="mt-2 text-left text-sm">
            <p>
              <strong>Score Breakdown:</strong>
            </p>
            <p>Base Score: +{scoreBreakdown.baseScore}</p>
            <p>Cells Opened: +{scoreBreakdown.cellOpeningPoints}</p>
            <p>Correct Flags: +{scoreBreakdown.correctFlagPoints}</p>
            {scoreBreakdown.wrongFlagPenalty !== 0 && (
              <p>Wrong Flags: {scoreBreakdown.wrongFlagPenalty}</p>
            )}
            <p>Time Penalty: -{scoreBreakdown.timeDecay.toFixed(1)}</p>
            <p className="font-bold mt-1">
              Total Score: {scoreBreakdown.finalScore}
            </p>
          </div>

          <PlayAgainButton
            onClick={resetGame}
            color={`linear-gradient(to right, ${COLORS[0]}, #ff9999)`}
          >
            Try Again
          </PlayAgainButton>
        </LoseMessage>
      )}
    </GameContainer>
  );
};

export default MinesweeperGame;
