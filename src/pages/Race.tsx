
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { Button } from '../components/ui/button';

const Race = () => {
  const { 
    players, 
    currentPlayerId, 
    updatePlayerProgress, 
    finishRace, 
    nextPlayer 
  } = useGameContext();
  
  const [startTime, setStartTime] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [isRacing, setIsRacing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [raceTime, setRaceTime] = useState(0);
  
  const navigate = useNavigate();
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  
  // Redirect if no current player
  useEffect(() => {
    if (!currentPlayer) {
      navigate('/setup');
    }
  }, [currentPlayer, navigate]);
  
  // Handle countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsRacing(true);
      setStartTime(Date.now());
    }
  }, [countdown]);
  
  // Handle race finish
  useEffect(() => {
    if (progress >= 100 && !isFinished && startTime) {
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      setRaceTime(totalTime);
      setIsRacing(false);
      setIsFinished(true);
      if (currentPlayerId) {
        finishRace(currentPlayerId, totalTime);
      }
    }
  }, [progress, isFinished, startTime, currentPlayerId, finishRace]);

  // Handle tap or space press
  const handleTap = useCallback(() => {
    if (isRacing && !isFinished) {
      const increase = Math.min(1.5 + Math.random() * 1, 5); // Random progress between 1.5-5
      const newProgress = Math.min(progress + increase, 100);
      setProgress(newProgress);
      setTapCount(tapCount + 1);
      
      // Apply the progress to the player
      if (currentPlayerId) {
        updatePlayerProgress(currentPlayerId, newProgress);
      }
    }
  }, [isRacing, isFinished, progress, tapCount, currentPlayerId, updatePlayerProgress]);
  
  // Listen for spacebar press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTap();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleTap]);
  
  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + 's';
  };
  
  // Go to next player or results screen
  const handleContinue = () => {
    nextPlayer();
    if (players.findIndex(p => p.id === currentPlayerId) >= players.length - 1) {
      navigate('/results');
    } else {
      // Reset for next player
      setProgress(0);
      setTapCount(0);
      setCountdown(3);
      setIsFinished(false);
      setIsRacing(false);
    }
  };

  if (!currentPlayer) return null;

  return (
    <div className="game-container py-6 flex flex-col items-center min-h-[80vh]">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">
          {currentPlayer.name}'s Turn to Race
        </h2>
        
        {countdown > 0 ? (
          <div className="flex flex-col items-center">
            <p className="text-gray-300 mb-4">Get ready to tap!</p>
            <div className="text-6xl font-bold text-bitcoin animate-pulse">
              {countdown}
            </div>
          </div>
        ) : isRacing ? (
          <p className="text-lg text-bitcoin-light animate-pulse">
            TAP! TAP! TAP! (or press SPACE)
          </p>
        ) : isFinished ? (
          <p className="text-lg text-green-400">
            Race Finished! Your time: <span className="font-bold">{formatTime(raceTime)}</span>
          </p>
        ) : null}
      </div>

      {/* Race track */}
      <div className="w-full max-w-3xl mb-8">
        <div className="bg-slate-800 h-20 rounded-full overflow-hidden relative race-track">
          {/* Progress bar */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-bitcoin to-bitcoin-light transition-all duration-75 flex items-center justify-end pr-4"
            style={{ width: `${progress}%` }}
          >
            {/* Bitcoin character */}
            <div className={`text-2xl ${progress > 95 ? 'animate-wiggle' : ''}`}>
              ₿
            </div>
          </div>
          
          {/* Finish line */}
          <div className="absolute top-0 right-0 h-full w-1 bg-white"></div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Start</span>
          <span>Finish</span>
        </div>
      </div>
      
      {/* Tap area */}
      <div 
        className={`w-full max-w-xl h-40 rounded-2xl flex items-center justify-center cursor-pointer mb-8 transition-all
          ${isRacing 
            ? 'bg-bitcoin-dark hover:bg-bitcoin active:bg-bitcoin-light' 
            : 'bg-slate-800'
          }
          ${isRacing ? 'shadow-lg shadow-bitcoin/30' : ''}
        `}
        onClick={handleTap}
      >
        {isRacing ? (
          <div className="text-white text-3xl font-bold">TAP HERE!</div>
        ) : isFinished ? (
          <div className="text-white text-xl">Race complete!</div>
        ) : (
          <div className="text-gray-400 text-xl">Waiting to start...</div>
        )}
      </div>
      
      {/* Stats */}
      <div className="flex gap-8 mb-8 text-center">
        <div>
          <p className="text-gray-400 text-sm">Progress</p>
          <p className="text-2xl font-bold text-white">{Math.round(progress)}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Taps</p>
          <p className="text-2xl font-bold text-white">{tapCount}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Time</p>
          <p className="text-2xl font-bold text-white">
            {startTime && !isFinished 
              ? ((Date.now() - startTime) / 1000).toFixed(1) + 's'
              : isFinished ? formatTime(raceTime) : '0.0s'
            }
          </p>
        </div>
      </div>
      
      {isFinished && (
        <Button
          className="bg-bitcoin hover:bg-bitcoin-dark text-lg py-6 px-12"
          onClick={handleContinue}
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default Race;
