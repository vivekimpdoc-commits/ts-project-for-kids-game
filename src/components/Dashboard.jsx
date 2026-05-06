import React from 'react';
import { 
  Type, Hash, Plus, SpellCheck, Grid, 
  Square, Palette, Puzzle, Dog, Apple, 
  HelpCircle, MousePointer2, Search, Paintbrush, Zap 
} from 'lucide-react';
import { playSound } from '../utils/audio';

const games = [
  { id: 'alphabet', title: 'Alphabet Learning', icon: Type, color: '#FF6B6B' },
  { id: 'numbers', title: 'Number Counting', icon: Hash, color: '#4D96FF' },
  { id: 'math', title: 'Basic Math Quiz', icon: Plus, color: '#6BCB77' },
  { id: 'spelling', title: 'Spelling Game', icon: SpellCheck, color: '#FFD93D' },
  { id: 'memory', title: 'Memory Match', icon: Grid, color: '#9254C8' },
  { id: 'shapes', title: 'Shape Recognition', icon: Square, color: '#FF9F43' },
  { id: 'colors', title: 'Color Identification', icon: Palette, color: '#00D2D3' },
  { id: 'wordpuzzle', title: 'Word Puzzle', icon: Puzzle, color: '#54A0FF' },
  { id: 'animals', title: 'Animal Learning', icon: Dog, color: '#EE5253' },
  { id: 'fruits', title: 'Fruits & Veggies', icon: Apple, color: '#10AC84' },
  { id: 'gkquiz', title: 'General Quiz', icon: HelpCircle, color: '#576574' },
  { id: 'dragdrop', title: 'Drag & Drop', icon: MousePointer2, color: '#8395A7' },
  { id: 'spotdifference', title: 'Spot Difference', icon: Search, color: '#FF6B6B' },
  { id: 'drawing', title: 'Drawing Fun', icon: Paintbrush, color: '#48DBFB' },
  { id: 'reaction', title: 'Reaction Speed', icon: Zap, color: '#Feca57' },
];

const Dashboard = ({ onSelectGame }) => {
  return (
    <div className="container fade-in">
      <header style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3.5rem', color: '#2D3436', marginBottom: '10px' }}>
          Kids Play & Learn! 🎮
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#636e72' }}>
          Choose a game and start your adventure!
        </p>
      </header>

      <div className="grid-games">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={() => {
              playSound('click');
              onSelectGame(game.id);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ 
              backgroundColor: `${game.color}20`, 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <game.icon size={48} color={game.color} strokeWidth={3} />
            </div>
            <h3 style={{ fontSize: '1.3rem' }}>{game.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
