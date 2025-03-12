import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MinesweeperGame from './MinesweeperGame';
import { AuthContext } from '../contexts/AuthContext';
import { getPersonalBests } from '../services/api';
import { toast } from 'react-toastify';

// Matching color palette from navbar
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1'];
const GRADIENT_START = '#5533FF';
const GRADIENT_END = '#2B8EFF';

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

const SignInButton = styled.button`
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

interface PersonalBest {
  _id: string;
  difficulty: string;
  score: number;
  time: number;
  date: string;
}

const GamePage: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastGameInfo, setLastGameInfo] = useState<{
    score: number;
    difficulty: string;
    won: boolean;
  } | null>(null);
  
  // Function to fetch personal best scores
  const fetchPersonalBests = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching personal bests...');
      const scores = await getPersonalBests();
      console.log('Received scores:', scores);
      setPersonalBests(scores);
    } catch (error) {
      console.error('Failed to load personal bests:', error);
      toast.error('Failed to load your scores');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchPersonalBests();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  // Handle game completion with improved score refresh
  const handleGameComplete = async (score: number, difficulty: string, won: boolean) => {
    console.log(`Game completed: ${difficulty}, Won: ${won}, Score: ${score}`);
    
    setLastGameInfo({ score, difficulty, won });
    
    if (isAuthenticated) {
      // Clear previous scores to show loading state
      setPersonalBests(prev => prev.filter(score => score.difficulty !== difficulty));
      setIsLoading(true);
      
      // Use a longer delay for more complex boards
      const delayMs = difficulty === 'beginner' ? 800 : difficulty === 'intermediate' ? 1200 : 1500;
      
      // Wait for the database to update before fetching new scores
      setTimeout(() => {
        fetchPersonalBests();
        
        // For extremely slow connections, try once more after additional delay
        setTimeout(() => {
          fetchPersonalBests();
        }, 2000);
      }, delayMs);
    }
  };
  
  // Group personal bests by difficulty
  const beginnerScores = personalBests.filter(score => score.difficulty === 'beginner')
    .sort((a, b) => b.score - a.score);
  
  const intermediateScores = personalBests.filter(score => score.difficulty === 'intermediate')
    .sort((a, b) => b.score - a.score);
  
  const expertScores = personalBests.filter(score => score.difficulty === 'expert')
    .sort((a, b) => b.score - a.score);
  
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
              <SignInButton onClick={() => navigate('/login')}>
                Sign In
              </SignInButton>
            </SignInPrompt>
          ) : isLoading ? (
            <div className="flex flex-col items-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-2"></div>
              <p>Updating scores...</p>
            </div>
          ) : (
            <>
              <DifficultyHeader>Beginner</DifficultyHeader>
              {beginnerScores.length > 0 ? (
                beginnerScores.slice(0, 3).map(score => (
                  <ScoreItem key={score._id}>
                    <ScoreDate>{new Date(score.date).toLocaleDateString()}</ScoreDate>
                    <ScoreTime>{score.time.toFixed(1)}s</ScoreTime>
                    <ScorePoints>{score.score} pts</ScorePoints>
                  </ScoreItem>
                ))
              ) : (
                <p className="text-gray-500">No scores yet</p>
              )}
              
              <DifficultyHeader>Intermediate</DifficultyHeader>
              {intermediateScores.length > 0 ? (
                intermediateScores.slice(0, 3).map(score => (
                  <ScoreItem key={score._id}>
                    <ScoreDate>{new Date(score.date).toLocaleDateString()}</ScoreDate>
                    <ScoreTime>{score.time.toFixed(1)}s</ScoreTime>
                    <ScorePoints>{score.score} pts</ScorePoints>
                  </ScoreItem>
                ))
              ) : (
                <p className="text-gray-500">No scores yet</p>
              )}
              
              <DifficultyHeader>Expert</DifficultyHeader>
              {expertScores.length > 0 ? (
                expertScores.slice(0, 3).map(score => (
                  <ScoreItem key={score._id}>
                    <ScoreDate>{new Date(score.date).toLocaleDateString()}</ScoreDate>
                    <ScoreTime>{score.time.toFixed(1)}s</ScoreTime>
                    <ScorePoints>{score.score} pts</ScorePoints>
                  </ScoreItem>
                ))
              ) : (
                <p className="text-gray-500">No scores yet</p>
              )}
              
              {lastGameInfo && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                  <p className="font-medium text-blue-800">Last Game:</p>
                  <p className="text-sm text-blue-600">
                    {lastGameInfo.difficulty.charAt(0).toUpperCase() + lastGameInfo.difficulty.slice(1)} - 
                    {lastGameInfo.won ? ' Won' : ' Lost'} - 
                    {' '}{lastGameInfo.score} points
                  </p>
                </div>
              )}
            </>
          )}
        </ScoreboardArea>
      </GameSection>
    </PageContainer>
  );
};

export default GamePage;