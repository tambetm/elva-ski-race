import React, { useState, useEffect, useCallback, useRef } from 'react';

const CHARACTERS = {
  kristjan: {
    name: 'Kristjan',
    nickname: 'The Pro',
    color: '#2563eb',
    skinColor: '#fcd5b4',
    speed: 3.5,
    stamina: 100,
    height: 28,
    width: 16,
    quote: '"Paarikümend suusakilomeetrit juba purgis!"',
    outfit: 'Racing suit, aerodynamic helmet, professional wax',
    style: 'Efficient, minimal words, already warmed up',
    weakness: 'Gets bored if pace is too slow',
    special: 'SPRINT - Double speed burst',
    bio: 'The athlete of the group. Already has 20km logged this season while others are still finding their skis. Uses "Heia" as greeting. May not show up if transport is inconvenient.',
  },
  daniel: {
    name: 'Daniel',
    nickname: 'The Captain',
    color: '#dc2626',
    skinColor: '#ffe0bd',
    speed: 2.8,
    stamina: 85,
    height: 26,
    width: 15,
    quote: '"Ahoi! Hommikupudru lisanditega enda peale!"',
    outfit: 'Classic red jacket, brings breakfast supplies',
    style: 'Enthusiastic, poetic, calls people "Ahoi"',
    weakness: 'Stops to photograph everything',
    special: 'PORRIDGE POWER - Stamina boost',
    bio: 'The initiator. His "inspiring phone call" started this whole event. Greets everyone with "Ahoi", volunteers for breakfast duty, promises to build escape rooms.',
  },
  heiki: {
    name: 'Heiki',
    nickname: 'The Driver',
    color: '#16a34a',
    skinColor: '#f5d5c8',
    speed: 2.5,
    stamina: 90,
    height: 24,
    width: 14,
    quote: '"Plaanisin Tallinnast autoga tulla. Võin kellegi peale võtta."',
    outfit: 'Practical green gear, car keys jingling',
    style: 'Brief, reliable, always has a car',
    weakness: 'Knee problems from basketball',
    special: 'TAXI SERVICE - Pull nearby skiers',
    bio: 'The reliable one. Drives from Tallinn, offers rides to everyone. Communication style: short, efficient, always helpful. Had knee issues from basketball but still shows up.',
  },
  tambet: {
    name: 'Tambet',
    nickname: 'The Organizer',
    color: '#7c3aed',
    skinColor: '#fcd5b4',
    speed: 2.0,
    stamina: 70,
    height: 32,
    width: 17,
    quote: '"Hea kui 5 km vastu pean..."',
    outfit: 'Tall, purple jacket, clipboard for organizing',
    style: 'Detailed planning, self-deprecating about fitness',
    weakness: 'Questionable fitness level',
    special: 'FLAT TRACK - Removes hills temporarily',
    bio: 'The host and organizer. Owns the Elva house. Tallest in the group. Admits his fitness is "questionable" and prefers flat tracks. Sends very detailed emails.',
  },
  keemik: {
    name: 'Keemik',
    nickname: 'The Chemist',
    color: '#ea580c',
    skinColor: '#ffe4c4',
    speed: 1.5,
    stamina: 60,
    height: 22,
    width: 13,
    quote: '"Suusatamisega on ka kahtlane lugu aga võib ju proovida."',
    outfit: 'Orange lab coat converted to ski gear, goggles',
    style: 'Formal "Lugupidamisega", loves hitching rides',
    weakness: 'Zero ski confidence',
    special: 'CHEMISTRY - Creates slippery trail boost',
    bio: 'Real name Olavi. Grows tomatoes, needs rides everywhere. Always signs off with formal "Lugupidamisega". Openly admits skiing is "a doubtful matter" but tries anyway. Shortest and least sporty.',
  }
};

const OBSTACLES = ['🌲', '🪨', '⛷️', '🦌', '🍺'];
const POWERUPS = ['🧪', '☕', '🥣', '⚡', '🚗'];

// Pixel art character renderer
const PixelSkier = ({ character, x, y, isMoving, direction, isCrashed }) => {
  const char = CHARACTERS[character];
  const bobOffset = isMoving ? Math.sin(Date.now() / 100) * 2 : 0;
  const crashRotate = isCrashed ? 90 : 0;
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + bobOffset,
        transform: `rotate(${crashRotate}deg) scaleX(${direction})`,
        transition: 'transform 0.1s',
        imageRendering: 'pixelated',
        zIndex: 10,
      }}
    >
      {/* Pixel art skier */}
      <svg width={char.width * 2} height={char.height * 2} viewBox={`0 0 ${char.width} ${char.height}`}>
        {/* Head */}
        <rect x={char.width/2 - 3} y={0} width={6} height={6} fill={char.skinColor} />
        {/* Hair/Hat */}
        <rect x={char.width/2 - 3} y={0} width={6} height={2} fill={char.color} />
        {/* Eyes */}
        <rect x={char.width/2 - 2} y={2} width={1} height={1} fill="#000" />
        <rect x={char.width/2 + 1} y={2} width={1} height={1} fill="#000" />
        {/* Body */}
        <rect x={char.width/2 - 4} y={6} width={8} height={char.height - 16} fill={char.color} />
        {/* Arms with poles */}
        <rect x={char.width/2 - 6} y={8} width={2} height={6} fill={char.skinColor} />
        <rect x={char.width/2 + 4} y={8} width={2} height={6} fill={char.skinColor} />
        <rect x={char.width/2 - 7} y={8} width={1} height={char.height - 8} fill="#8B4513" />
        <rect x={char.width/2 + 6} y={8} width={1} height={char.height - 8} fill="#8B4513" />
        {/* Legs */}
        <rect x={char.width/2 - 3} y={char.height - 10} width={2} height={6} fill="#1e3a5f" />
        <rect x={char.width/2 + 1} y={char.height - 10} width={2} height={6} fill="#1e3a5f" />
        {/* Skis */}
        <rect x={char.width/2 - 5} y={char.height - 4} width={10} height={2} fill="#4a5568" />
        <rect x={char.width/2 - 6} y={char.height - 3} width={1} height={1} fill="#4a5568" />
        <rect x={char.width/2 + 5} y={char.height - 3} width={1} height={1} fill="#4a5568" />
      </svg>
      {/* Name tag */}
      <div style={{
        position: 'absolute',
        top: -20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: char.color,
        color: 'white',
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        fontFamily: '"Press Start 2P", monospace',
      }}>
        {char.name}
      </div>
    </div>
  );
};

// Track segment with trees and obstacles
const TrackSegment = ({ y, obstacles, powerups }) => (
  <div style={{
    position: 'absolute',
    top: y,
    left: 0,
    right: 0,
    height: 100,
  }}>
    {/* Track markings */}
    <div style={{
      position: 'absolute',
      left: '20%',
      top: 0,
      bottom: 0,
      width: 4,
      background: 'repeating-linear-gradient(to bottom, #ef4444 0, #ef4444 10px, transparent 10px, transparent 20px)',
    }} />
    <div style={{
      position: 'absolute',
      right: '20%',
      top: 0,
      bottom: 0,
      width: 4,
      background: 'repeating-linear-gradient(to bottom, #ef4444 0, #ef4444 10px, transparent 10px, transparent 20px)',
    }} />
    {/* Obstacles */}
    {obstacles.map((obs, i) => (
      <div key={i} style={{
        position: 'absolute',
        left: obs.x,
        top: obs.y,
        fontSize: 24,
        transform: 'translate(-50%, -50%)',
      }}>
        {obs.type}
      </div>
    ))}
    {/* Powerups */}
    {powerups.map((pu, i) => (
      <div key={i} style={{
        position: 'absolute',
        left: pu.x,
        top: pu.y,
        fontSize: 20,
        transform: 'translate(-50%, -50%)',
        animation: 'pulse 1s infinite',
      }}>
        {pu.type}
      </div>
    ))}
  </div>
);

// Main game component
export default function App() {
  const [gameState, setGameState] = useState('menu'); // menu, select, playing, finished
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [playerPos, setPlayerPos] = useState({ x: 250, y: 400 });
  const [playerStamina, setPlayerStamina] = useState(100);
  const [distance, setDistance] = useState(0);
  const [npcPositions, setNpcPositions] = useState({});
  const [obstacles, setObstacles] = useState([]);
  const [powerups, setPowerups] = useState([]);
  const [isCrashed, setIsCrashed] = useState(false);
  const [direction, setDirection] = useState(1);
  const [specialReady, setSpecialReady] = useState(true);
  const [showQuote, setShowQuote] = useState(null);
  const gameRef = useRef(null);
  const keysPressed = useRef({});
  
  const FINISH_LINE = 5000; // 5km race
  
  // Initialize NPCs
  useEffect(() => {
    if (gameState === 'playing' && selectedCharacter) {
      const npcs = {};
      let npcIndex = 0;
      Object.keys(CHARACTERS).forEach((char) => {
        if (char !== selectedCharacter) {
          // Spread NPCs evenly across the track (100-400 range)
          npcs[char] = {
            x: 130 + npcIndex * 70,
            y: 420,
            stamina: CHARACTERS[char].stamina,
            crashed: false,
          };
          npcIndex++;
        }
      });
      setNpcPositions(npcs);
      setPlayerStamina(CHARACTERS[selectedCharacter].stamina);
      
      // Generate initial obstacles - spread more and less dense
      const initObstacles = [];
      const initPowerups = [];
      for (let i = 0; i < 40; i++) {
        if (Math.random() > 0.6) {
          // Obstacles spread across track with more space in the middle
          const side = Math.random() > 0.5;
          const xPos = side
            ? 100 + Math.random() * 120  // Left side (100-220)
            : 320 + Math.random() * 120; // Right side (320-440)
          initObstacles.push({
            x: xPos,
            y: 600 + i * 200 + Math.random() * 150,
            type: OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)],
          });
        }
        if (Math.random() > 0.8) {
          initPowerups.push({
            x: 150 + Math.random() * 200, // Powerups more centered
            y: 700 + i * 250 + Math.random() * 150,
            type: POWERUPS[Math.floor(Math.random() * POWERUPS.length)],
          });
        }
      }
      setObstacles(initObstacles);
      setPowerups(initPowerups);
    }
  }, [gameState, selectedCharacter]);
  
  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const gameLoop = setInterval(() => {
      if (isCrashed) return;
      
      const char = CHARACTERS[selectedCharacter];
      let speed = char.speed;
      let moveX = 0;
      
      if (keysPressed.current.ArrowLeft || keysPressed.current.a) {
        moveX = -4;
        setDirection(-1);
      }
      if (keysPressed.current.ArrowRight || keysPressed.current.d) {
        moveX = 4;
        setDirection(1);
      }
      if (keysPressed.current.ArrowUp || keysPressed.current.w) {
        speed *= 1.5;
        setPlayerStamina(s => Math.max(0, s - 0.3));
      }
      
      // Update player position
      setPlayerPos(pos => ({
        x: Math.max(60, Math.min(440, pos.x + moveX)),
        y: pos.y,
      }));
      
      // Update distance
      setDistance(d => {
        const newDist = d + speed * 10;
        if (newDist >= FINISH_LINE) {
          setGameState('finished');
        }
        return newDist;
      });
      
      // Check collisions with obstacles
      obstacles.forEach(obs => {
        const obsScreenY = obs.y - distance;
        if (obsScreenY > 380 && obsScreenY < 440) {
          if (Math.abs(obs.x - playerPos.x) < 30) {
            setIsCrashed(true);
            setTimeout(() => setIsCrashed(false), 1500);
          }
        }
      });
      
      // Check powerup collection
      setPowerups(pus => pus.filter(pu => {
        const puScreenY = pu.y - distance;
        if (puScreenY > 380 && puScreenY < 440 && Math.abs(pu.x - playerPos.x) < 30) {
          setPlayerStamina(s => Math.min(100, s + 20));
          return false;
        }
        return true;
      }));
      
      // Update NPCs
      setNpcPositions(npcs => {
        const updated = { ...npcs };
        Object.keys(updated).forEach(npcChar => {
          const npcData = CHARACTERS[npcChar];
          // Simple AI: move towards center with weaving, faster movement
          const targetX = 250 + Math.sin(Date.now() / 800 + npcChar.charCodeAt(0)) * 120;
          updated[npcChar].x += (targetX - updated[npcChar].x) * 0.05;
          // Keep NPCs within track bounds
          updated[npcChar].x = Math.max(100, Math.min(400, updated[npcChar].x));

          // NPC progresses based on their speed
          const npcProgress = distance + (npcData.speed - char.speed) * 200 + Math.random() * 50 - 25;
          updated[npcChar].y = 420 + (distance - npcProgress) / 10;
        });
        return updated;
      });
      
    }, 50);
    
    return () => clearInterval(gameLoop);
  }, [gameState, selectedCharacter, isCrashed, distance, playerPos.x, obstacles]);
  
  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      if (e.key === ' ' && specialReady && gameState === 'playing') {
        // Use special ability
        setSpecialReady(false);
        setShowQuote(CHARACTERS[selectedCharacter].quote);
        setTimeout(() => setShowQuote(null), 2000);
        setTimeout(() => setSpecialReady(true), 10000);
        
        // Apply special effect
        setDistance(d => d + 200);
        setPlayerStamina(s => Math.min(100, s + 30));
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, selectedCharacter, specialReady]);
  
  // Render menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-300 to-white flex flex-col items-center justify-center p-4 font-mono">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          @keyframes snow { 0% { transform: translateY(-10px); } 100% { transform: translateY(100vh); } }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
          @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          .snow { position: fixed; color: white; animation: snow linear infinite; opacity: 0.8; font-size: 20px; }
        `}</style>
        
        {/* Falling snow */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className="snow" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}>❄️</div>
        ))}
        
        <div className="relative z-10 text-center">
          <h1 style={{ 
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '2rem',
            color: '#1e40af',
            textShadow: '4px 4px 0 #fff, 6px 6px 0 #3b82f6',
            marginBottom: '0.5rem',
            lineHeight: 1.4,
          }}>
            🎿 ELVA SKI RACE 🎿
          </h1>
          <h2 style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.7rem',
            color: '#7c3aed',
            marginBottom: '2rem',
          }}>
            Tartu Maraton Tracks Edition
          </h2>
          
          <div className="bg-white/90 rounded-2xl p-6 shadow-2xl border-4 border-blue-400 max-w-md mx-auto mb-6">
            <p className="text-gray-700 text-sm mb-4">
              Race your friends through the legendary Tartu Maraton trails!
              <br/><br/>
              🏁 <strong>5km to the finish</strong><br/>
              🏠 <strong>End at Vana-Koidu 26, Elva</strong><br/>
              🧖 <strong>Sauna awaits!</strong><br/>
              🍺 <strong>Beer at the finish!</strong>
            </p>
            
            <div className="flex gap-4 justify-center text-3xl mb-4">
              <span style={{ animation: 'bob 1s ease-in-out infinite' }}>⛷️</span>
              <span style={{ animation: 'bob 1s ease-in-out infinite 0.2s' }}>🌲</span>
              <span style={{ animation: 'bob 1s ease-in-out infinite 0.4s' }}>🏔️</span>
              <span style={{ animation: 'bob 1s ease-in-out infinite 0.6s' }}>🍺</span>
              <span style={{ animation: 'bob 1s ease-in-out infinite 0.8s' }}>🧖</span>
            </div>
          </div>
          
          <button
            onClick={() => setGameState('select')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition-transform border-4 border-white"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.8rem' }}
          >
            START RACE
          </button>
          
          <p className="text-gray-600 mt-6 text-xs">
            Based on the "Elva nädalavahetus vol 3" event<br/>
            January 31 - February 1, 2026
          </p>
        </div>
      </div>
    );
  }
  
  // Render character select
  if (gameState === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-white to-sky-100 p-4 font-mono">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        `}</style>
        
        <h2 style={{ 
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '1.2rem',
          textAlign: 'center',
          color: '#1e40af',
          marginBottom: '1.5rem',
        }}>
          CHOOSE YOUR SKIER
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {Object.entries(CHARACTERS).map(([key, char]) => (
            <div
              key={key}
              onClick={() => setSelectedCharacter(key)}
              className={`bg-white rounded-xl p-4 cursor-pointer transition-all border-4 ${
                selectedCharacter === key 
                  ? 'border-yellow-400 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
              style={{ animation: selectedCharacter === key ? 'pulse 1s infinite' : 'none' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ background: char.color }}
                >
                  {char.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: char.color }}>{char.name}</h3>
                  <p className="text-xs text-gray-500 italic">"{char.nickname}"</p>
                </div>
              </div>
              
              <div className="text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span>Speed:</span>
                  <div className="w-24 h-2 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${char.speed / 4 * 100}%` }} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stamina:</span>
                  <div className="w-24 h-2 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${char.stamina}%` }} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Height:</span>
                  <div className="w-24 h-2 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${char.height / 32 * 100}%` }} />
                  </div>
                </div>
              </div>
              
              <p className="mt-3 text-xs text-gray-600 italic bg-gray-50 p-2 rounded">
                {char.quote}
              </p>
              
              <div className="mt-2 text-xs">
                <span className="font-bold text-orange-600">Special: </span>
                <span>{char.special}</span>
              </div>
              
              <p className="mt-2 text-xs text-gray-500">{char.bio}</p>
              
              <div className="mt-2 text-xs text-gray-400">
                <strong>Outfit:</strong> {char.outfit}
              </div>
            </div>
          ))}
        </div>
        
        {selectedCharacter && (
          <div className="fixed bottom-4 left-0 right-0 flex justify-center">
            <button
              onClick={() => setGameState('playing')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform border-4 border-white"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.7rem' }}
            >
              🎿 START AS {CHARACTERS[selectedCharacter].name.toUpperCase()}! 🎿
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // Render game
  if (gameState === 'playing' || gameState === 'finished') {
    const char = CHARACTERS[selectedCharacter];
    const progress = (distance / FINISH_LINE) * 100;

    return (
      <div className="h-screen bg-gradient-to-b from-sky-300 via-white to-sky-100 overflow-hidden relative font-mono flex justify-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        `}</style>

        {/* Game container - fixed 500px width */}
        <div className="relative w-[500px] h-full">

        {/* HUD */}
        <div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-start">
          <div className="bg-black/70 text-white p-3 rounded-lg text-xs space-y-2">
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.6rem' }}>
              {char.name}
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <div className="w-20 h-3 bg-gray-700 rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
                  style={{ width: `${playerStamina}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{(distance / 1000).toFixed(2)} km / 5 km</span>
            </div>
            {specialReady ? (
              <div className="text-green-400 animate-pulse">⭐ SPACE: Special Ready!</div>
            ) : (
              <div className="text-gray-500">⭐ Recharging...</div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="bg-black/70 p-3 rounded-lg">
            <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 text-xs">🏁</div>
              {/* Player markers */}
              <div 
                className="absolute top-0 bottom-0 w-2 bg-white rounded"
                style={{ left: `${Math.min(98, progress)}%` }}
              />
            </div>
            <div className="text-white text-xs mt-1 text-center">
              {gameState === 'finished' ? '🏁 FINISH!' : `${(5 - distance/1000).toFixed(1)} km left`}
            </div>
          </div>
          
          {/* Controls hint */}
          <div className="bg-black/70 text-white p-2 rounded-lg text-xs">
            <div>← → Move</div>
            <div>↑ Sprint</div>
            <div>SPACE Special</div>
          </div>
        </div>
        
        {/* Game area */}
        <div 
          ref={gameRef}
          className="absolute inset-0 overflow-hidden"
          style={{ 
            background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 30%, #ffffff 70%, #f0f9ff 100%)',
          }}
        >
          {/* Track */}
          <div className="absolute inset-x-0" style={{ top: 0, height: '100%' }}>
            {/* Center track area */}
            <div 
              className="absolute"
              style={{
                left: '15%',
                right: '15%',
                top: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.3) 100%)',
                borderLeft: '4px dashed #3b82f6',
                borderRight: '4px dashed #3b82f6',
              }}
            />
            
            {/* Ski tracks */}
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${25 + i * 5}%`,
                  top: ((-distance * 0.5) % 100) + i * 100,
                  width: 2,
                  height: 50,
                  background: 'rgba(100, 100, 100, 0.2)',
                }}
              />
            ))}
            
            {/* Trees on sides */}
            {[...Array(20)].map((_, i) => (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: 'absolute',
                    left: `${5 + Math.random() * 8}%`,
                    top: ((-distance * 0.3) % 600) + i * 80,
                    fontSize: 30 + Math.random() * 20,
                  }}
                >🌲</div>
                <div
                  style={{
                    position: 'absolute',
                    right: `${5 + Math.random() * 8}%`,
                    top: ((-distance * 0.3) % 600) + i * 80 + 40,
                    fontSize: 30 + Math.random() * 20,
                  }}
                >🌲</div>
              </React.Fragment>
            ))}
            
            {/* Obstacles */}
            {obstacles.map((obs, i) => {
              const screenY = obs.y - distance;
              if (screenY < -50 || screenY > 600) return null;
              return (
                <div
                  key={`obs-${i}`}
                  style={{
                    position: 'absolute',
                    left: obs.x,
                    top: screenY,
                    fontSize: 28,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5,
                  }}
                >
                  {obs.type}
                </div>
              );
            })}
            
            {/* Powerups */}
            {powerups.map((pu, i) => {
              const screenY = pu.y - distance;
              if (screenY < -50 || screenY > 600) return null;
              return (
                <div
                  key={`pu-${i}`}
                  style={{
                    position: 'absolute',
                    left: pu.x,
                    top: screenY,
                    fontSize: 24,
                    transform: 'translate(-50%, -50%)',
                    animation: 'pulse 1s infinite',
                    zIndex: 5,
                  }}
                >
                  {pu.type}
                </div>
              );
            })}
            
            {/* Finish line */}
            {distance > FINISH_LINE - 500 && (
              <div
                style={{
                  position: 'absolute',
                  left: '15%',
                  right: '15%',
                  top: FINISH_LINE - distance + 400,
                  height: 20,
                  background: 'repeating-linear-gradient(90deg, #000 0, #000 20px, #fff 20px, #fff 40px)',
                  borderTop: '4px solid gold',
                  borderBottom: '4px solid gold',
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl">
                  🏁 ELVA FINISH 🏁
                </div>
              </div>
            )}
          </div>
          
          {/* NPCs */}
          {Object.entries(npcPositions).map(([npcKey, npcPos]) => (
            <PixelSkier
              key={npcKey}
              character={npcKey}
              x={npcPos.x}
              y={npcPos.y}
              isMoving={true}
              direction={1}
              isCrashed={npcPos.crashed}
            />
          ))}
          
          {/* Player */}
          <PixelSkier
            character={selectedCharacter}
            x={playerPos.x}
            y={playerPos.y}
            isMoving={!isCrashed}
            direction={direction}
            isCrashed={isCrashed}
          />
          
          {/* Quote bubble */}
          {showQuote && (
            <div 
              className="absolute bg-white p-3 rounded-xl shadow-lg border-2 border-gray-300 max-w-xs text-sm"
              style={{
                left: playerPos.x + 50,
                top: playerPos.y - 60,
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.5rem',
              }}
            >
              {showQuote}
              <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-r-2 border-b-2 border-gray-300 rotate-45" />
            </div>
          )}
          
          {/* Crash indicator */}
          {isCrashed && (
            <div 
              className="absolute text-4xl"
              style={{
                left: playerPos.x,
                top: playerPos.y - 40,
              }}
            >
              💥
            </div>
          )}
        </div>
        
        {/* Finish screen */}
        {gameState === 'finished' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 border-4 border-yellow-400">
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '1rem' }}
              >
                🏁 RACE COMPLETE! 🏁
              </h2>
              
              <div className="text-6xl mb-4">🎉🍺🧖</div>
              
              <p className="text-gray-700 mb-4">
                <strong>{char.name}</strong> made it to Elva!
              </p>
              
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-lg mb-4">
                <p className="text-lg font-bold text-orange-800">Now arriving at:</p>
                <p className="text-gray-700">📍 Vana-Koidu 26, Elva</p>
                <div className="flex justify-center gap-4 mt-2 text-2xl">
                  <span>🧖</span>
                  <span>🍺</span>
                  <span>🎮</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Time for sauna, beer, and games!
                </p>
              </div>
              
              <p className="text-sm text-gray-500 italic mb-4">
                {char.quote}
              </p>
              
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setGameState('select');
                    setDistance(0);
                    setPlayerPos({ x: 250, y: 400 });
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    setGameState('menu');
                    setDistance(0);
                    setSelectedCharacter(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
        </div>{/* End game container */}
      </div>
    );
  }

  return null;
}
