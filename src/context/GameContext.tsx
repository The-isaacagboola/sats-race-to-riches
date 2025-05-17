
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Player = {
  id: string;
  name: string;
  invoiceAddress: string;
  progress: number;
  time: number | null;
  position: number | null;
};

interface GameContextType {
  players: Player[];
  currentPlayerId: string | null;
  gamePhase: 'setup' | 'race' | 'results';
  rewardAmount: number;
  winner: Player | null;
  
  // Methods
  addPlayer: (name: string, invoiceAddress: string) => void;
  updatePlayerProgress: (id: string, progress: number) => void;
  finishRace: (id: string, time: number) => void;
  startGame: () => void;
  resetGame: () => void;
  nextPlayer: () => void;
  determineWinner: () => void;
  setGamePhase: (phase: 'setup' | 'race' | 'results') => void;
}

const defaultContext: GameContextType = {
  players: [],
  currentPlayerId: null,
  gamePhase: 'setup',
  rewardAmount: 10000, // 10,000 sats default
  winner: null,
  
  addPlayer: () => {},
  updatePlayerProgress: () => {},
  finishRace: () => {},
  startGame: () => {},
  resetGame: () => {},
  nextPlayer: () => {},
  determineWinner: () => {},
  setGamePhase: () => {},
};

const GameContext = createContext<GameContextType>(defaultContext);

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<'setup' | 'race' | 'results'>('setup');
  const [rewardAmount, setRewardAmount] = useState(10000); // 10,000 sats
  const [winner, setWinner] = useState<Player | null>(null);

  const addPlayer = (name: string, invoiceAddress: string) => {
    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      name,
      invoiceAddress,
      progress: 0,
      time: null,
      position: null,
    };
    setPlayers([...players, newPlayer]);
  };
  
  const updatePlayerProgress = (id: string, progress: number) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, progress } : player
    ));
  };
  
  const finishRace = (id: string, time: number) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, time } : player
    ));
  };
  
  const startGame = () => {
    if (players.length > 0) {
      setCurrentPlayerId(players[0].id);
      setGamePhase('race');
    }
  };
  
  const resetGame = () => {
    setPlayers([]);
    setCurrentPlayerId(null);
    setGamePhase('setup');
    setWinner(null);
  };
  
  const nextPlayer = () => {
    if (!currentPlayerId) return;
    
    const currentIndex = players.findIndex(p => p.id === currentPlayerId);
    if (currentIndex < players.length - 1) {
      setCurrentPlayerId(players[currentIndex + 1].id);
    } else {
      setGamePhase('results');
      determineWinner();
    }
  };
  
  const determineWinner = () => {
    const raced = players.filter(p => p.time !== null);
    if (raced.length === 0) return;
    
    // Sort by race time (lowest is best)
    const sorted = [...raced].sort((a, b) => 
      (a.time || Infinity) - (b.time || Infinity)
    );
    
    // Assign positions
    const withPositions = sorted.map((player, index) => ({
      ...player,
      position: index + 1
    }));
    
    // Update all players with their positions
    setPlayers(players.map(p => {
      const found = withPositions.find(wp => wp.id === p.id);
      return found ? found : p;
    }));
    
    // Set the winner
    setWinner(sorted[0] || null);
  };
  
  return (
    <GameContext.Provider value={{
      players,
      currentPlayerId,
      gamePhase,
      rewardAmount,
      winner,
      addPlayer,
      updatePlayerProgress,
      finishRace,
      startGame,
      resetGame,
      nextPlayer,
      determineWinner,
      setGamePhase,
    }}>
      {children}
    </GameContext.Provider>
  );
};
