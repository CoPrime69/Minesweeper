import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MinesweeperGame from "./MinesweeperGame";
import { AuthContext } from "../contexts/AuthContext";
import { getPersonalBests } from "../services/api";
import { toast } from "react-toastify";

// Matching color palette from navbar
const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD166", "#6A0572", "#AB83A1"];
const GRADIENT_START = "#5533FF";
const GRADIENT_END = "#2B8EFF";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END});
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
`;

const GameSection = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const GameArea = styled.div`
  flex: 1;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
`;

const ScoreboardArea = styled.div`
  width: 300px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${COLORS[2]};

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const ScoreboardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${GRADIENT_START};
`;

const ScoreItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9f9f9;
    transform: translateX(5px);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ScoreDate = styled.span`
  color: #666;
`;

const ScoreTime = styled.span`
  color: ${COLORS[0]};
  font-weight: bold;
`;

const ScorePoints = styled.span`
  color: ${GRADIENT_START};
  font-weight: bold;
`;

const DifficultyHeader = styled.h3`
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 600;
  background: linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END});
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
`;

const Button = styled.button`
  background: linear-gradient(to right, ${GRADIENT_START}, ${GRADIENT_END});
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const SignInPrompt = styled.div`
  background: linear-gradient(to right, ${GRADIENT_START}10, ${GRADIENT_END}10);
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid ${GRADIENT_START};
`;

const ResetButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ResetButton = styled(Button)`
  background: linear-gradient(to right, #FF6B6B, #FF8E8E);
`;

const PreviousGameStats = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid ${COLORS[1]};
`;

const PreviousGameTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${COLORS[1]};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`;

const StatLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const StatValue = styled.span`
  color: ${GRADIENT_START};
  font-weight: 600;
`;

interface PersonalBest {
  _id: string;
  difficulty: string;
  score: number;
  time: number;
  date: string;
}

interface PreviousGameStat {
  difficulty: string;
  score: number;
  time: number;
  won: boolean;
  date: Date;
  // cellsRevealed: number;
  // flagsPlaced: number;
}

const GamePage: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousGameStat, setPreviousGameStat] = useState<PreviousGameStat | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    // Load personal best scores if authenticated
    if (isAuthenticated) {
      const loadPersonalBests = async () => {
        try {
          setIsLoading(true);
          const scores = await getPersonalBests();
          setPersonalBests(scores);
          console.log("Loaded personal bests:", scores); // Debug log to check loaded scores
        } catch (error) {
          console.error("Failed to load personal bests:", error);
          toast.error("Failed to load your scores");
        } finally {
          setIsLoading(false);
        }
      };

      loadPersonalBests();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const [gameCompletionCount, setGameCompletionCount] = useState(0);

  const handleGameComplete = async (
    score: number,
    difficulty: string,
    won: boolean,
    // gameStats = { cellsRevealed: 0, flagsPlaced: 0 }
  ) => {
    // Update previous game stats
    setPreviousGameStat({
      difficulty,
      score,
      time: score > 0 ? score / 10 : 0, // Assuming score calculation is based on time
      won,
      date: new Date(),
      // cellsRevealed: gameStats.cellsRevealed,
      // flagsPlaced: gameStats.flagsPlaced
    });

    // Increment the counter to trigger a re-render
    setGameCompletionCount((prev) => prev + 1);

    if (isAuthenticated) {
      try {
        // Add a small delay to ensure the database has been updated
        setTimeout(async () => {
          const scores = await getPersonalBests();
          setPersonalBests(scores);
        }, 500);
      } catch (error) {
        console.error("Failed to refresh personal bests:", error);
      }
    }
  };

  // Add this effect to fetch personal bests whenever the game completion count changes
  useEffect(() => {
    if (isAuthenticated && gameCompletionCount > 0) {
      const fetchScores = async () => {
        try {
          const scores = await getPersonalBests();
          setPersonalBests(scores);
        } catch (error) {
          console.error("Failed to fetch personal bests:", error);
        }
      };
      fetchScores();
    }
  }, [gameCompletionCount, isAuthenticated]);

  // const handleResetScores = async () => {
  //   if (!isAuthenticated) return;
    
  //   if (window.confirm("Are you sure you want to reset all your scores? This cannot be undone.")) {
  //     try {
  //       setResetLoading(true);
  //       await resetScores();
  //       setPersonalBests([]);
  //       toast.success("All scores have been reset successfully!");
  //     } catch (error) {
  //       console.error("Failed to reset scores:", error);
  //       toast.error("Failed to reset scores. Please try again.");
  //     } finally {
  //       setResetLoading(false);
  //     }
  //   }
  // };

  // Group personal bests by difficulty - Fix: Use case-insensitive comparison
  const beginnerScores = personalBests.filter(
    (score) => score.difficulty.toLowerCase() === "beginner"
  );
  const intermediateScores = personalBests.filter(
    (score) => score.difficulty.toLowerCase() === "intermediate"
  );
  const expertScores = personalBests.filter(
    (score) => score.difficulty.toLowerCase() === "expert"
  );

  return (
    <PageContainer>
      <PageTitle>Minesweeper</PageTitle>

      <GameSection>
        <GameArea>
          <MinesweeperGame onGameComplete={handleGameComplete} />
        </GameArea>

        <ScoreboardArea>
          <ScoreboardTitle>Personal Best Scores</ScoreboardTitle>

          {!isAuthenticated ? (
            <SignInPrompt>
              <p className="mb-3 font-medium">Sign in to track your scores!</p>
              <Button onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </SignInPrompt>
          ) : isLoading ? (
            <p>Loading your scores...</p>
          ) : (
            <>
              <DifficultyHeader>Beginner</DifficultyHeader>
              {beginnerScores.length > 0 ? (
                beginnerScores.slice(0, 3).map((score) => (
                  <ScoreItem key={score._id}>
                    <ScoreDate>
                      {new Date(score.date).toLocaleDateString()}
                    </ScoreDate>
                    <ScoreTime>{score.time.toFixed(1)}s</ScoreTime>
                    <ScorePoints>{score.score} pts</ScorePoints>
                  </ScoreItem>
                ))
              ) : (
                <p className="text-gray-500">No scores yet</p>
              )}

              <DifficultyHeader>Intermediate</DifficultyHeader>
              {intermediateScores.length > 0 ? (
                intermediateScores.slice(0, 3).map((score) => (
                  <ScoreItem key={score._id}>
                    <ScoreDate>
                      {new Date(score.date).toLocaleDateString()}
                    </ScoreDate>
                    <ScoreTime>{score.time.toFixed(1)}s</ScoreTime>
                    <ScorePoints>{score.score} pts</ScorePoints>
                  </ScoreItem>
                ))
              ) : (
                <p className="text-gray-500">No scores yet</p>
              )}

              <DifficultyHeader>Expert</DifficultyHeader>
              {expertScores.length > 0 ? (
                expertScores.slice(0, 3).map((score) => (
                  <ScoreItem key={score._id}>
                    <ScoreDate>
                      {new Date(score.date).toLocaleDateString()}
                    </ScoreDate>
                    <ScoreTime>{score.time.toFixed(1)}s</ScoreTime>
                    <ScorePoints>{score.score} pts</ScorePoints>
                  </ScoreItem>
                ))
              ) : (
                <p className="text-gray-500">No scores yet</p>
              )}

              {/* <ResetButtonContainer>
                <ResetButton 
                  onClick={handleResetScores} 
                  disabled={resetLoading}
                >
                  {resetLoading ? "Resetting..." : "Reset All Scores"}
                </ResetButton>
              </ResetButtonContainer> */}
            </>
          )}

          {previousGameStat && (
            <PreviousGameStats>
              <PreviousGameTitle>Previous Game Stats</PreviousGameTitle>
              <StatRow>
                <StatLabel>Result:</StatLabel>
                <StatValue>{previousGameStat.won ? "Win" : "Loss"}</StatValue>
              </StatRow>
              <StatRow>
                <StatLabel>Difficulty:</StatLabel>
                <StatValue>{previousGameStat.difficulty}</StatValue>
              </StatRow>
              <StatRow>
                <StatLabel>Time:</StatLabel>
                <StatValue>{previousGameStat.time.toFixed(1)}s</StatValue>
              </StatRow>
              <StatRow>
                <StatLabel>Score:</StatLabel>
                <StatValue>{previousGameStat.score} pts</StatValue>
              </StatRow>
              {/* <StatRow>
                <StatLabel>Cells Revealed:</StatLabel>
                <StatValue>{previousGameStat.cellsRevealed}</StatValue>
              </StatRow> */}
              {/* <StatRow>
                <StatLabel>Flags Placed:</StatLabel>
                <StatValue>{previousGameStat.flagsPlaced}</StatValue>
              </StatRow> */}
            </PreviousGameStats>
          )}
        </ScoreboardArea>
      </GameSection>
    </PageContainer>
  );
};

export default GamePage;