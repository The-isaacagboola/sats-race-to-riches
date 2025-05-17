
import React from 'react';
import { Link } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { Button } from '../components/ui/button';

const Home = () => {
  const { resetGame } = useGameContext();

  return (
    <div className="game-container flex flex-col items-center justify-center min-h-[80vh]">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold mb-4 pixel-text bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
          Sats Race to Riches
        </h1>
        <p className="text-xl text-gray-300 max-w-lg mx-auto mb-8">
          Compete by tapping as fast as you can to win Bitcoin rewards!
        </p>
        
        <div className="bg-black/30 p-6 rounded-xl max-w-lg mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-4 text-bitcoin">How to Play</h2>
          <ol className="text-left list-decimal list-inside space-y-3 text-gray-300">
            <li>Register with your name and Lightning invoice address</li>
            <li>Race by tapping the screen or pressing SPACE as fast as you can</li>
            <li>The fastest player wins Bitcoin rewards sent directly to their wallet!</li>
          </ol>
        </div>
      </div>
      
      <div className="pixel-border p-1 rounded-xl bg-gradient-to-br from-bitcoin to-bitcoin-dark inline-block animate-pulse">
        <Link 
          to="/setup" 
          className="bg-black/80 text-white text-xl font-bold py-4 px-12 rounded-lg inline-block hover:bg-black transition-colors"
          onClick={resetGame}
        >
          Start New Race
        </Link>
      </div>
      
      <div className="mt-12 flex flex-col items-center">
        <div className="bg-bitcoin w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-3xl font-bold">₿</span>
        </div>
        <p className="text-gray-400 italic">Win sats. Have fun. Repeat.</p>
      </div>
    </div>
  );
};

export default Home;
