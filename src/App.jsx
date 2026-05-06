import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { playSound } from './utils/audio';
import { ArrowLeft, Trophy, Speaker } from 'lucide-react';
import confetti from 'canvas-confetti';

// Placeholder for game components
const GameStub = ({ title, onBack }) => (
  <div className="container fade-in" style={{ textAlign: 'center', padding: '50px' }}>
    <button className="btn-primary" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px' }}>
      <ArrowLeft style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Back
    </button>
    <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>{title}</h2>
    <div className="game-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '100px' }}>
      <p style={{ fontSize: '1.5rem' }}>Coming Soon! 🚀</p>
      <p>We are building this fun game for you!</p>
    </div>
  </div>
);

// Color Game
const ColorGame = ({ onBack, onScore }) => {
  const colors = [
    { name: 'Red', hex: '#FF6B6B' },
    { name: 'Blue', hex: '#4D96FF' },
    { name: 'Green', hex: '#6BCB77' },
    { name: 'Yellow', hex: '#FFD93D' },
    { name: 'Purple', hex: '#9254C8' },
    { name: 'Orange', hex: '#FF9F43' }
  ];
  const [target, setTarget] = useState(colors[0]);
  const [options, setOptions] = useState([]);

  const generateRound = () => {
    const t = colors[Math.floor(Math.random() * colors.length)];
    setTarget(t);
    setOptions([...colors].sort(() => Math.random() - 0.5));
    const utterance = new SpeechSynthesisUtterance(`Find the color ${t.name}`);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => generateRound(), []);

  const handlePick = (color) => {
    if (color.name === target.name) {
      playSound('success');
      onScore(10);
      confetti();
      generateRound();
    } else {
      playSound('error');
    }
  };

  return (
    <div className="container fade-in" style={{ textAlign: 'center', padding: '50px' }}>
      <button className="btn-primary" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px' }}><ArrowLeft size={20} /></button>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Find {target.name}!</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {options.map((c, i) => (
          <div key={i} onClick={() => handlePick(c)} style={{ backgroundColor: c.hex, height: '150px', borderRadius: '20px', cursor: 'pointer', border: '4px solid #2D3436', boxShadow: '0 8px 0 rgba(0,0,0,0.1)' }} />
        ))}
      </div>
    </div>
  );
};

// Alphabet Learning Game
const AlphabetGame = ({ onBack }) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [currentIdx, setCurrentIdx] = useState(0);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    playSound('click');
    const next = (currentIdx + 1) % letters.length;
    setCurrentIdx(next);
    speak(letters[next]);
  };

  const handlePrev = () => {
    playSound('click');
    const prev = (currentIdx - 1 + letters.length) % letters.length;
    setCurrentIdx(prev);
    speak(letters[prev]);
  };

  return (
    <div className="container fade-in" style={{ textAlign: 'center', padding: '50px' }}>
      <button className="btn-primary" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px' }}><ArrowLeft size={20} /></button>
      <div className="game-card" style={{ maxWidth: '400px', margin: '40px auto', padding: '60px' }}>
        <div style={{ fontSize: '12rem', fontWeight: 'bold', color: '#4D96FF' }}>{letters[currentIdx]}</div>
        <button onClick={() => speak(letters[currentIdx])} style={{ background: '#FFD93D', borderRadius: '50%', padding: '20px', marginTop: '20px', border: '3px solid #2D3436' }}><Speaker size={40} /></button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button className="btn-primary" onClick={handlePrev}>Previous</button>
        <button className="btn-primary" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

// Memory Match Game
const MemoryGame = ({ onBack, onScore }) => {
  const icons = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🥑', '🍍'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);

  useEffect(() => {
    const shuffled = [...icons, ...icons].sort(() => Math.random() - 0.5).map((icon, index) => ({ id: index, icon }));
    setCards(shuffled);
  }, []);

  const handleFlip = (id) => {
    if (flipped.length === 2 || solved.includes(id) || flipped.includes(id)) return;
    playSound('click');
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setSolved([...solved, first, second]);
        setFlipped([]);
        onScore(20);
        playSound('success');
        if (solved.length + 2 === cards.length) confetti();
      } else {
        setTimeout(() => { setFlipped([]); playSound('error'); }, 1000);
      }
    }
  };

  return (
    <div className="container fade-in" style={{ textAlign: 'center', padding: '50px' }}>
      <button className="btn-primary" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px' }}><ArrowLeft size={20} /></button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', maxWidth: '500px', margin: '20px auto' }}>
        {cards.map((card, i) => (
          <div key={i} className="game-card" onClick={() => handleFlip(i)} style={{ height: '100px', fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: solved.includes(i) ? '#6BCB7733' : flipped.includes(i) ? '#FFFFFF' : '#4D96FF', cursor: 'pointer', border: '3px solid #2D3436' }}>
            {(flipped.includes(i) || solved.includes(i)) ? card.icon : '?'}
          </div>
        ))}
      </div>
    </div>
  );
};

// Basic Math Game
const MathGame = ({ onBack, onScore }) => {
  const [problem, setProblem] = useState({ a: 0, b: 0, op: '+', answer: 0 });
  const [options, setOptions] = useState([]);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const ans = op === '+' ? a + b : Math.abs(a - b);
    const finalA = op === '+' ? a : Math.max(a, b);
    const finalB = op === '+' ? b : Math.min(a, b);
    setProblem({ a: finalA, b: finalB, op, answer: ans });
    const opts = new Set([ans]);
    while(opts.size < 4) opts.add(Math.floor(Math.random() * 20));
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  useEffect(() => generateProblem(), []);

  const handleAnswer = (val) => {
    if (val === problem.answer) {
      playSound('success');
      confetti();
      onScore(10);
      generateProblem();
    } else {
      playSound('error');
    }
  };

  return (
    <div className="container fade-in" style={{ textAlign: 'center', padding: '50px' }}>
      <button className="btn-primary" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px' }}><ArrowLeft size={20} /></button>
      <div className="game-card" style={{ maxWidth: '500px', margin: '40px auto', padding: '40px' }}>
        <div style={{ fontSize: '5rem', marginBottom: '40px', fontWeight: 'bold' }}>{problem.a} {problem.op} {problem.b} = ?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {options.map((opt, i) => (
            <button key={i} className="btn-primary" style={{ fontSize: '2rem', padding: '20px' }} onClick={() => handleAnswer(opt)}>{opt}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Number Counting Game
const NumberGame = ({ onBack, onScore }) => {
  const [target, setTarget] = useState(0);
  const [options, setOptions] = useState([]);
  const emoji = ['🍎', '⭐️', '🍦', '🚗', '🐶'][Math.floor(Math.random() * 5)];

  const generateRound = () => {
    const num = Math.floor(Math.random() * 9) + 1;
    setTarget(num);
    const opts = new Set([num]);
    while(opts.size < 4) opts.add(Math.floor(Math.random() * 10) + 1);
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  useEffect(() => generateRound(), []);

  const handlePick = (n) => {
    if (n === target) {
      playSound('success');
      confetti();
      onScore(10);
      generateRound();
    } else {
      playSound('error');
    }
  };

  return (
    <div className="container fade-in" style={{ textAlign: 'center', padding: '50px' }}>
      <button className="btn-primary" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px' }}><ArrowLeft size={20} /></button>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>How many {emoji} do you see?</h2>
      <div style={{ fontSize: '4rem', marginBottom: '40px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {Array(target).fill(emoji).map((e, i) => <span key={i}>{e}</span>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
        {options.map(opt => <button key={opt} className="btn-primary" style={{ fontSize: '2rem' }} onClick={() => handlePick(opt)}>{opt}</button>)}
      </div>
    </div>
  );
};

// Shape Recognition Game
const ShapeGame = ({ onBack, onScore }) => {
  const shapes = [
    { name: 'Circle', svg: <circle cx="50" cy="50" r="40" fill="currentColor" /> },
    { name: 'Square', svg: <rect x="10" y="10" width="80" height="80" fill="currentColor" /> },
    { name: 'Triangle', svg: <polygon points="50,10 90,90 10,90" fill="currentColor" /> },
    { name: 'Star', svg: <polygon points="50,5 63,35 95,35 70,55 80,85 50,70 20,85 30,55 5,35 37,35" fill="currentColor" /> }
  ];
  const [target, setTarget] = useState(shapes[0]);
  const [options, setOptions] = useState([]);

  const generateRound = () => {
    const t = shapes[Math.floor(Math.random() * shapes.length)];
    setTarget(t);
    setOptions([...shapes].sort(() => Math.random() - 0.5));
  };

  useEffect(() => generateRound(), []);

  const handlePick = (s) => {
    if (s.name === target.name) {
      playSound('success');
      confetti();
      onScore(10);
      generateRound();
    } else {
      playSound('error');
    }
  };

  return (
    <div className="container fade-in" style={{ textAlign: 'center', padding: '50px' }}>
      <button className="btn-primary" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px' }}><ArrowLeft size={20} /></button>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Find the {target.name}!</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 200px)', gap: '20px', justifyContent: 'center' }}>
        {options.map((s, i) => (
          <div key={i} className="game-card" onClick={() => handlePick(s)} style={{ cursor: 'pointer', color: '#4D96FF' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100px', height: '100px' }}>{s.svg}</svg>
          </div>
        ))}
      </div>
    </div>
  );
};

// Spelling Game
const SpellingGame = ({ onBack, onScore }) => {
  const words = [
    { word: 'CAT', image: '🐱' }, { word: 'DOG', image: '🐶' }, { word: 'FISH', image: '🐟' }, { word: 'BIRD', image: '🐦' }, { word: 'APPLE', image: '🍎' }
  ];
  const [current, setCurrent] = useState(words[0]);
  const [input, setInput] = useState('');

  const generateRound = () => {
    const w = words[Math.floor(Math.random() * words.length)];
    setCurrent(w);
    setInput('');
    const utterance = new SpeechSynthesisUtterance(`Spell the word ${w.word}`);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => generateRound(), []);

  const handleChar = (char) => {
    const nextInput = input + char;
    setInput(nextInput);
    playSound('click');
    if (nextInput === current.word) {
      playSound('success');
      confetti();
      onScore(50);
      setTimeout(generateRound, 1000);
    } else if (!current.word.startsWith(nextInput)) {
      playSound('error');
      setInput('');
    }
  };

  return (
    <div className="container fade-in" style={{ textAlign: 'center', padding: '50px' }}>
      <button className="btn-primary" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px' }}><ArrowLeft size={20} /></button>
      <div style={{ fontSize: '8rem', marginBottom: '20px' }}>{current.image}</div>
      <div style={{ fontSize: '3rem', letterSpacing: '10px', marginBottom: '40px', fontWeight: 'bold', color: '#4D96FF' }}>
        {current.word.split('').map((char, i) => (
          <span key={i} style={{ borderBottom: '5px solid #2D3436', margin: '0 5px', minWidth: '40px', display: 'inline-block' }}>{input[i] || ''}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => <button key={char} className="btn-primary" style={{ padding: '10px', fontSize: '1.2rem' }} onClick={() => handleChar(char)}>{char}</button>)}
      </div>
    </div>
  );
};

function App() {
  const [activeGame, setActiveGame] = useState(null);
  const [totalScore, setTotalScore] = useState(() => parseInt(localStorage.getItem('kidsGameTotalScore') || '0'));

  useEffect(() => {
    localStorage.setItem('kidsGameTotalScore', totalScore.toString());
  }, [totalScore]);

  const handleScore = (points) => setTotalScore(s => s + points);

  const renderGame = () => {
    const props = { onBack: () => setActiveGame(null), onScore: handleScore };
    switch (activeGame) {
      case 'math': return <MathGame {...props} />;
      case 'memory': return <MemoryGame {...props} />;
      case 'alphabet': return <AlphabetGame {...props} />;
      case 'colors': return <ColorGame {...props} />;
      case 'numbers': return <NumberGame {...props} />;
      case 'shapes': return <ShapeGame {...props} />;
      case 'spelling': return <SpellingGame {...props} />;
      case 'wordpuzzle': return <GameStub title="Word Puzzle" onBack={() => setActiveGame(null)} />;
      case 'animals': return <GameStub title="Animal Learning" onBack={() => setActiveGame(null)} />;
      case 'fruits': return <GameStub title="Fruits & Veggies" onBack={() => setActiveGame(null)} />;
      case 'gkquiz': return <GameStub title="General Quiz" onBack={() => setActiveGame(null)} />;
      case 'dragdrop': return <GameStub title="Drag & Drop" onBack={() => setActiveGame(null)} />;
      case 'spotdifference': return <GameStub title="Spot Difference" onBack={() => setActiveGame(null)} />;
      case 'drawing': return <GameStub title="Drawing Fun" onBack={() => setActiveGame(null)} />;
      case 'reaction': return <GameStub title="Reaction Speed" onBack={() => setActiveGame(null)} />;
      default: return (
        <div className="App">
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <div className="game-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trophy color="#FFD93D" />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total: {totalScore}</span>
            </div>
          </div>
          <Dashboard onSelectGame={(id) => setActiveGame(id)} />
        </div>
      );
    }
  };

  return renderGame();
}

export default App;
