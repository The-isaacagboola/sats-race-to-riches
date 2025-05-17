
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { Button } from '../components/ui/button';
import QRCode from '../components/QRCode';

const Results = () => {
  const { players, winner, rewardAmount, resetGame } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no players or if not coming from race
    if (players.length === 0) {
      navigate('/');
    }
  }, [players, navigate]);

  const sortedPlayers = [...players]
    .filter(p => p.time !== null)
    .sort((a, b) => (a.time || 0) - (b.time || 0));

  const formatTime = (ms: number | null) => {
    if (ms === null) return "Did not finish";
    return (ms / 1000).toFixed(2) + 's';
  };

  const handlePlayAgain = () => {
    resetGame();
    navigate('/setup');
  };

  return (
    <div className="game-container max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-6 text-bitcoin pixel-text">Race Results</h1>
        
        {winner ? (
          <div className="bg-black/30 p-6 rounded-xl mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Winner</h2>
            <div className="bg-gradient-to-r from-bitcoin to-bitcoin-dark p-6 rounded-xl">
              <div className="text-4xl font-bold text-white mb-2">{winner.name}</div>
              <div className="text-xl text-white/70 mb-4">Time: {formatTime(winner.time)}</div>
              
              <div className="mb-6">
                <div className="inline-block bg-white p-3 rounded-xl">
                  <QRCode value={winner.invoiceAddress} size={200} />
                </div>
              </div>
              
              <div className="text-lg text-white">
                <p>Reward: <span className="font-bold">{rewardAmount.toLocaleString()} sats</span></p>
                <p className="text-sm opacity-80 mt-1">Scan QR to pay the winner!</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xl text-white mb-6">No winner determined</p>
        )}
      </div>
      
      <div className="bg-black/30 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Leaderboard</h2>
        
        <div className="space-y-3">
          {sortedPlayers.length > 0 ? (
            sortedPlayers.map((player, index) => (
              <div 
                key={player.id} 
                className={`flex items-center p-4 rounded-lg ${
                  index === 0 ? 'bg-bitcoin/20 border border-bitcoin' : 'bg-slate-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                  index === 0 ? 'bg-bitcoin text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-white">{player.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-lg text-white">{formatTime(player.time)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">No race data available</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="border-gray-600 text-gray-300"
        >
          Back to Home
        </Button>
        
        <Button 
          onClick={handlePlayAgain}
          className="bg-bitcoin hover:bg-bitcoin-dark"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default Results;
