"use client"

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const gameRef = useRef(null);
  const playerRef = useRef(null);
  const [enemies, setEnemies] = useState([]);
const [trail, setTrail] = useState([]); // 滑鼠軌跡

  const playerSize = 40;
  const enemySize = 30;

  // 玩家固定在畫面中央
  const playerX = window.innerWidth / 2 - playerSize / 2;
  const playerY = window.innerHeight / 2 - playerSize / 2;

  //滑鼠移動軌跡點
  useEffect(() => {
    const handleMouseMove = (e) => {
      const point = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setTrail((prev) => [...prev, point]);

      // 自動移除該軌跡點（例如 200ms 後）
      setTimeout(() => {
        setTrail((prev) => prev.filter(p => p.id !== point.id));
      }, 200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

//消滅敵人
useEffect(() => {
    let animationId;

    const checkCollisions = () => {
      setEnemies(prevEnemies =>
        prevEnemies.filter(enemy => {
          return !trail.some(point => {
            const dx = enemy.x + enemySize / 2 - point.x;
            const dy = enemy.y + enemySize / 2 - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < enemySize / 2;
          });
        })
      );

      animationId = requestAnimationFrame(checkCollisions);
    };

    animationId = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(animationId);
  }, [trail, enemySize]);



  // 敵人生成
useEffect(() => {
  const spawnEnemy = () => {
    const side = Math.floor(Math.random() * 4); // 0上, 1右, 2下, 3左
    let x = 0, y = 0;

    switch (side) {
      case 0: // 上
        x = Math.random() * window.innerWidth;
        y = -enemySize;
        break;
      case 1: // 右
        x = window.innerWidth + enemySize;
        y = Math.random() * window.innerHeight;
        break;
      case 2: // 下
        x = Math.random() * window.innerWidth;
        y = window.innerHeight + enemySize;
        break;
      case 3: // 左
        x = -enemySize;
        y = Math.random() * window.innerHeight;
        break;
    }

    setEnemies(prev => [...prev, { id: Date.now() + Math.random(), x, y }]);
  };

  const interval = setInterval(spawnEnemy, 2000); // 每 2 秒生成一個敵人
  return () => clearInterval(interval);
}, []);


  // 敵人移動
  useEffect(() => {
    const moveEnemies = () => {
      setEnemies(prev =>
        prev.map(enemy => {
          const dx = playerX - enemy.x;
          const dy = playerY - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const speed = 1.2; // 可調整速度

          return {
            ...enemy,
            x: enemy.x + (dx / distance) * speed,
            y: enemy.y + (dy / distance) * speed,
          };
        })
      );
      requestAnimationFrame(moveEnemies);
    };

    moveEnemies();
  }, []);

return (
  <div
    ref={gameRef}
    className="w-full h-screen bg-[#fff9ef] relative overflow-hidden"
  >
    {/* 玩家 */}
    <div
      ref={playerRef}
      style={{
        width: playerSize,
        height: playerSize,
        borderRadius: '50%',
        background: '#333',
        position: 'absolute',
        left: playerX,
        top: playerY,
      }}
    />

    {/* 敵人 */}
    {enemies.map((enemy) => (
      <div
        key={enemy.id}
        style={{
          width: enemySize,
          height: enemySize,
          borderRadius: '50%',
          background: 'crimson',
          position: 'absolute',
          left: enemy.x,
          top: enemy.y,
        }}
      />
    ))}


    {/* 滑鼠軌跡 */}
      {trail.map((point) => (
        <div
          key={point.id}
          style={{
            width: 10,
            height: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '50%',
            position: 'absolute',
            left: point.x - 5,
            top: point.y - 5,
            pointerEvents: 'none',
          }}
        />
      ))}

  </div>
);

}
