import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fetchTechStack } from './api';

function App() {
  const [count, setCount] = useState(0);

  const [stack, setStack] = useState<any[]>([]);

  const handleClick = async () => {
    const data = await fetchTechStack();
    setStack(data);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div style={{ padding: '2rem' }}>
        <h1>Tech Stack Learning Dashboard</h1>
        <button onClick={handleClick}>Load Tech Stack</button>
        <ul>
          {stack.map((item) => (
            <li key={item.id}>
              {item.name} ({item.category})
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
