
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Setup = () => {
  const { players, addPlayer, startGame } = useGameContext();
  const [name, setName] = useState('');
  const [invoiceAddress, setInvoiceAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddPlayer = () => {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    
    if (!invoiceAddress.trim()) {
      setError('Please enter a Lightning invoice address');
      return;
    }
    
    addPlayer(name.trim(), invoiceAddress.trim());
    setName('');
    setInvoiceAddress('');
    setError('');
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      setError('You need at least 2 players to start a race');
      return;
    }
    
    startGame();
    navigate('/race');
  };

  return (
    <div className="game-container max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 pixel-text text-bitcoin">Setup Your Race</h1>
        <p className="text-lg text-gray-300">Add players and their Lightning addresses</p>
      </div>
      
      <div className="bg-black/30 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Player</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Player Name</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter player name"
              className="w-full bg-slate-800 border-slate-700"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-gray-300">Lightning Invoice Address</label>
            <Input 
              value={invoiceAddress}
              onChange={(e) => setInvoiceAddress(e.target.value)}
              placeholder="Enter Lightning address"
              className="w-full bg-slate-800 border-slate-700"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button 
            onClick={handleAddPlayer}
            className="w-full bg-bitcoin hover:bg-bitcoin-dark"
          >
            Add Player
          </Button>
        </div>
      </div>
      
      <div className="bg-black/30 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Players ({players.length})</h2>
        
        {players.length === 0 ? (
          <p className="text-gray-400 italic">No players added yet</p>
        ) : (
          <ul className="space-y-4">
            {players.map((player, index) => (
              <li key={player.id} className="flex items-center bg-slate-800 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-bitcoin flex items-center justify-center text-white font-bold mr-3">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-white">{player.name}</p>
                  <p className="text-sm text-gray-400 truncate max-w-[280px] md:max-w-xl">
                    {player.invoiceAddress}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
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
          onClick={handleStartGame}
          className="bg-bitcoin hover:bg-bitcoin-dark text-xl px-12 py-6"
          disabled={players.length < 2}
        >
          Start Race!
        </Button>
      </div>
    </div>
  );
};

export default Setup;
