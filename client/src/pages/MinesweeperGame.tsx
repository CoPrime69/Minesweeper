import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { saveScore } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import CustomMinesweeper from "./CustomMinesweeper"; // Custom-built Minesweeper component

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
  width: 100%;
  max-width: 100%;
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
  flex-wrap: wrap;
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

const ResponsiveContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
`;

const ScoreBreakdownContainer = styled.div`
  margin-top: 12px;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 10px;
  font-size: 0.9rem;
`;

const ScoreBreakdownList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 5px;
`;

interface GameProps {
  onGameComplete?: (score: number, difficulty: string, won: boolean) => void;
}

type DifficultyLevel = "beginner" | "intermediate" | "expert";

interface CellRevealInfo {
  count: number;
  streaks: number;
  maxStreak: number;
  noGuessClears: number;
}

interface ScoreDetails {
  totalScore: number;
  breakdown?: {
    baseScore: number;
    timeBonus: number;
    efficiencyBonus: number;
    streakMultiplier: number;
    noGuessBonus: number;
    finalBeforeMin: number;
  };
}

const difficultySettings = {
  beginner: { 
    width: 9, 
    height: 9, 
    mines: 10,
    baseScore: 1000,
    timeBonus: { max: 500, decayRate: 5 }, // points lost per second
    minScore: 500
  },
  intermediate: { 
    width: 16, 
    height: 16, 
    mines: 40,
    baseScore: 2500,
    timeBonus: { max: 1000, decayRate: 10 },
    minScore: 1000
  },
  expert: { 
    width: 24, 
    height: 16, 
    mines: 60,
    baseScore: 5000,
    timeBonus: { max: 2000, decayRate: 15 },
    minScore: 2000
  },
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
  const [cellData, setCellData] = useState<CellRevealInfo>({
    count: 0,
    streaks: 0,
    maxStreak: 0,
    noGuessClears: 0,
  });
  const [scoreDetails, setScoreDetails] = useState<ScoreDetails | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  
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
    setCellData({
      count: 0,
      streaks: 0,
      maxStreak: 0,
      noGuessClears: 0,
    });
    setScoreDetails(null);
    setCurrentStreak(0);
  };

  const handleGameStart = () => {
    if (gameState.status === "waiting") {
      setGameState({ ...gameState, status: "playing", startTime: Date.now() });
    }
  };

  const handleCellReveal = (cellInfo: any) => {
    // This function would be called whenever a cell is revealed
    // The CustomMinesweeper component would need to be modified to emit this event
    
    if (gameState.status !== "playing") return;
    
    // Track cell reveals and streaks
    let newStreak = currentStreak;
    if (cellInfo.isCorrectFlag) {
      newStreak += 1;
    } else {
      newStreak = 0;
    }
    
    setCurrentStreak(newStreak);
    
    setCellData(prev => {
      const newCount = prev.count + 1;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);
      const newNoGuessClears = prev.noGuessClears + (cellInfo.isLogicalMove ? 1 : 0);
      
      return {
        count: newCount,
        streaks: prev.streaks + (cellInfo.isCorrectFlag ? 1 : 0),
        maxStreak: newMaxStreak,
        noGuessClears: newNoGuessClears
      };
    });
  };

  const calculateScore = (won: boolean, timeTaken: number): ScoreDetails => {
    const settings = difficultySettings[difficulty];
    
    if (!won) {
      // For losses, calculate a consolation score based on progress
      const totalCells = settings.width * settings.height;
      const minePercentage = settings.mines / totalCells;
      const progressPercentage = Math.min(cellData.count / (totalCells - settings.mines), 1);
      const baseConsolation = settings.minScore * 0.2; // 20% of minimum score
      const progressBonus = progressPercentage * settings.minScore * 0.3; // Up to 30% of min score for progress
      
      return {
        totalScore: Math.round(baseConsolation + progressBonus)
      };
    }
    
    // Calculate winning score components
    const baseScore = settings.baseScore;
    
    // Time bonus - decreases as time increases
    const timeBonus = Math.max(
      0, 
      settings.timeBonus.max - (timeTaken * settings.timeBonus.decayRate)
    );
    
    // Efficiency bonus - based on cells revealed and flags placed
    const totalSafeCells = settings.width * settings.height - settings.mines;
    const efficiencyRatio = totalSafeCells / Math.max(1, cellData.count);
    const maxEfficiencyBonus = settings.baseScore * 0.3;
    const efficiencyBonus = Math.round(maxEfficiencyBonus * Math.min(1, efficiencyRatio));
    
    // Streak bonus - consecutive correct flags
    const streakMultiplier = 1 + (Math.min(cellData.maxStreak, 5) * 0.1); // Up to 50% bonus
    
    // No-guessing bonus - logical moves
    const noGuessRatio = cellData.noGuessClears / Math.max(1, cellData.count);
    const noGuessBonus = Math.round(settings.baseScore * 0.2 * noGuessRatio);
    
    // Final calculation
    const finalBeforeMin = Math.round(
      (baseScore + timeBonus + efficiencyBonus + noGuessBonus) * streakMultiplier
    );
    
    // Ensure minimum score for winning
    const totalScore = Math.max(finalBeforeMin, settings.minScore);
    
    return {
      totalScore,
      breakdown: {
        baseScore,
        timeBonus,
        efficiencyBonus,
        streakMultiplier,
        noGuessBonus,
        finalBeforeMin
      }
    };
  };

  const handleGameWin = async () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - gameState.startTime) / 1000);

    setGameState({
      ...gameState,
      status: "won",
      endTime: endTime,
    });

    const scoreResult = calculateScore(true, timeTaken);
    setScoreDetails(scoreResult);
    
    if (isAuthenticated && onGameComplete) {
      try {
        console.log("Saving winning score:", {
          score: scoreResult.totalScore,
          difficulty,
          time: timeTaken,
          details: scoreResult.breakdown
        });
        
        const result = await saveScore({ 
          score: scoreResult.totalScore, 
          difficulty, 
          time: timeTaken
        });
        
        console.log("Score saved successfully:", result);
        onGameComplete(scoreResult.totalScore, difficulty, true);
        toast.success(`Score saved: ${scoreResult.totalScore} points`);
      } catch (error) {
        console.error("Error saving score:", error);
        toast.error("Failed to save score");
      }
    }
  };

  const handleGameLoss = async () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - gameState.startTime) / 1000);
    
    setGameState({
      ...gameState,
      status: "lost",
      endTime: endTime,
    });

    const consolationScore = calculateScore(false, timeTaken);
    setScoreDetails(consolationScore);

    if (isAuthenticated && onGameComplete) {
      try {
        console.log("Saving losing score:", {
          score: consolationScore.totalScore,
          difficulty,
          time: timeTaken
        });
        
        const result = await saveScore({ 
          score: consolationScore.totalScore, 
          difficulty, 
          time: timeTaken 
        });
        
        console.log("Score saved successfully:", result);
        onGameComplete(consolationScore.totalScore, difficulty, false);
        toast.info(`Consolation score: ${consolationScore.totalScore} points`);
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

  const ScoreBreakdown = () => {
    if (!scoreDetails || !scoreDetails.breakdown) return null;
    
    const bd = scoreDetails.breakdown;
    
    return (
      <ScoreBreakdownContainer>
        <strong>Score Breakdown:</strong>
        <ScoreBreakdownList>
          <li>Base Score: {bd.baseScore}</li>
          <li>Time Bonus: +{bd.timeBonus}</li>
          <li>Efficiency Bonus: +{bd.efficiencyBonus}</li>
          <li>No-Guess Bonus: +{bd.noGuessBonus}</li>
          <li>Streak Multiplier: x{bd.streakMultiplier.toFixed(1)}</li>
        </ScoreBreakdownList>
      </ScoreBreakdownContainer>
    );
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
        <StatItem>
          <StatIcon>🔍</StatIcon>
          {cellData.count}
        </StatItem>
        {currentStreak > 1 && (
          <StatItem>
            <StatIcon>🔥</StatIcon>
            {currentStreak}
          </StatItem>
        )}
      </GameStats>

      <ResponsiveContainer>
        <CustomMinesweeper
          key={gameKey}
          width={difficultySettings[difficulty].width}
          height={difficultySettings[difficulty].height}
          mines={difficultySettings[difficulty].mines}
          onWin={handleGameWin}
          onLose={handleGameLoss}
          onCellClick={handleGameStart}
          onFlagChange={handleFlagChange}
          onCellReveal={handleCellReveal} // New prop to track cell reveal data
        />
      </ResponsiveContainer>

      {gameState.status === "won" && (
        <WinMessage>
          <h3>Victory! 🎉</h3>
          <p>Completed in {time} seconds</p>
          <p className="font-bold text-xl mt-2">Score: {scoreDetails?.totalScore || 0} points</p>
          {scoreDetails?.breakdown && <ScoreBreakdown />}
          <PlayAgainButton onClick={resetGame} className="mt-4">Play Again</PlayAgainButton>
        </WinMessage>
      )}

      {gameState.status === "lost" && (
        <LoseMessage>
          <h3>Game Over 💥</h3>
          <p>Better luck next time!</p>
          {scoreDetails && (
            <p className="font-bold mt-2">
              Consolation Score: {scoreDetails.totalScore} points
            </p>
          )}
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