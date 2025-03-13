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
  onGameComplete?: (score: number, difficulty: string, won: boolean, time: number) => void;
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

  const handleGameWin = async () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - gameState.startTime) / 1000);

    setGameState({
      ...gameState,
      status: "won",
      endTime: endTime,
    });

    // Base scores for each difficulty (balanced values)
    const baseScores = {
      beginner: 100,
      intermediate: 250,
      expert: 400,
    };

    // Time factors - how many points to deduct per second
    const timeFactors = {
      beginner: 0.5, // More forgiving time penalty
      intermediate: 0.4, // Medium time penalty
      expert: 0.3, // Less penalty per second because expert takes longer
    };

    // Calculate score based on difficulty, time, and remaining mines
    const baseScore = baseScores[difficulty];
    const timePenalty = Math.min(
      timeFactors[difficulty] * timeTaken,
      baseScore * 0.7
    ); // Cap time penalty at 70% of base score

    // Bonus for efficiency (remaining mines vs total mines ratio can give up to 30% bonus)
    const minesEfficiency =
      gameState.flagsPlaced / difficultySettings[difficulty].mines;
    const efficiencyBonus =
      minesEfficiency > 0.9 ? baseScore * 0.3 : baseScore * 0.15; // 30% bonus for using flags efficiently

    // Final score calculation with minimum score floor
    const score = Math.max(
      Math.round(baseScore - timePenalty + efficiencyBonus),
      10
    );

    if (isAuthenticated && onGameComplete) {
      try {
        await saveScore({
          score,
          difficulty: difficulty.toLowerCase(),
          time: timeTaken,
          won: true,
        });

        // Pass the actual time directly
        onGameComplete(score, difficulty.toLowerCase(), true, timeTaken);
        toast.success(`Score saved: ${score} points`);
      } catch (error) {
        console.error("Error saving score:", error);
        toast.error("Failed to save score");
      }
    }
  };

  const handleGameLoss = () => {
    const endTime = Date.now();
    setGameState({
      ...gameState,
      status: "lost",
      endTime: endTime,
    });

    if (isAuthenticated && onGameComplete) {
      const timeTaken = Math.floor((endTime - gameState.startTime) / 1000);

      // Calculate consolation score based on game progress
      // This estimates how much of the board was cleared before losing
      const boardSize =
        difficultySettings[difficulty].width *
        difficultySettings[difficulty].height;
      const totalCells = boardSize - difficultySettings[difficulty].mines;

      // We don't have direct access to cells cleared, so let's use time as a rough proxy for progress
      // Assuming reasonable clearing rates per difficulty
      const avgTimePerCell = {
        beginner: 0.5, // seconds per cell
        intermediate: 0.4,
        expert: 0.3,
      };

      const estimatedCellsCleared = Math.min(
        timeTaken / avgTimePerCell[difficulty],
        totalCells
      );
      const progressPercent = estimatedCellsCleared / totalCells;

      // Base consolation scores by difficulty
      const baseConsolationScores = {
        beginner: 20,
        intermediate: 40,
        expert: 60,
      };

      // Calculate score based on progress (up to 80% of consolation base)
      const score = Math.max(
        Math.round(baseConsolationScores[difficulty] * progressPercent * 0.8),
        5 // Minimum 5 points for participation
      );

      try {
        saveScore({
          score,
          difficulty: difficulty.toLowerCase(),
          time: timeTaken,
          won: false,
        });

        // Pass the actual time directly
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
      />

      {gameState.status === "won" && (
        <WinMessage>
          <h3>Victory! 🎉</h3>
          <p>Completed in {time} seconds</p>
          <PlayAgainButton onClick={resetGame}>Play Again</PlayAgainButton>
        </WinMessage>
      )}

      {gameState.status === "lost" && (
        <LoseMessage>
          <h3>Game Over 💥</h3>
          <p>Better luck next time!</p>
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
