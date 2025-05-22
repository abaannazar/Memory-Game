import { useState, useEffect } from 'react';

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');

  const [difficulty, setDifficulty] = useState('medium');

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setAttempts(0);
    setTimer(0);
    setIsActive(false); // Timer will start on first click
    setMessage('');
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 500);
    }
  };

  const handleClick = (id) => {
    if (disabled || won) return;

    // Start timer on first click
    if (!isActive && flipped.length === 0 && solved.length === 0) {
      setIsActive(true);
    }

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        setAttempts((prev) => prev + 1);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
      setIsActive(false);

      if (timer <= 20) {
        setMessage("🔥 Speed Demon! Awesome memory!");
      } else if (timer <= 40) {
        setMessage("⚡ Great Job! That was fast.");
      } else {
        setMessage("💪 You made it! Keep practicing.");
      }
    }
  }, [solved, cards]);

  const handleDifficultyChange = (e) => {
    const level = e.target.value;
    setDifficulty(level);
    switch (level) {
      case 'easy':
        setGridSize(2);
        break;
      case 'medium':
        setGridSize(4);
        break;
      case 'hard':
        setGridSize(6);
        break;
      case 'extreme':
        setGridSize(8);
        break;
      default:
        setGridSize(4);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Memory Game</h1>

      {/* Difficulty Dropdown */}
      <div className="mb-4">
        <label htmlFor="difficulty" className="mr-2">
          Difficulty:
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          className="border px-2 py-1 rounded"
        >
          <option value="easy">🟢 Easy (2x2)</option>
          <option value="medium">🟡 Medium (4x4)</option>
          <option value="hard">🔴 Hard (6x6)</option>
          <option value="extreme">💀 Extreme (8x8)</option>
        </select>
      </div>

      {/* Timer and Score */}
      <div className="mb-4 text-lg">
        <p>⏱️ Time: <span className="font-bold">{timer}s</span></p>
        <p>🎯 Attempts: <span className="font-bold">{attempts}</span></p>
      </div>

      {/* Game Board */}
      <div
        className="grid gap-2 mb-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(100%,${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`aspect-square flex items-center justify-center text-xl 
              font-bold border rounded-lg cursor-pointer transition-all duration-300 
              ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
          >
            {isFlipped(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>

      {/* Winning Message */}
      {won && (
        <div className="mt-4 text-2xl font-bold text-green-600 text-center">
          <div className="animate-bounce">🎉 YOU WON! 🎉</div>
          <div className="mt-2 text-lg italic">{message}</div>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
