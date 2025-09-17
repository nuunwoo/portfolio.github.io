import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";
import SplashLayer from "../layers/SplashLayer";

function App() {
  const [count, setCount] = useState(0);

  const apiUrl = import.meta.env.VITE_API_URL;

  console.log(import.meta.env);
  console.log(apiUrl);

  return (
    <>
      <SplashLayer
        aboveFoldImageSelectors={["img[alt='logo']", ".dock img"]}
        timeoutMs={3000}
        onDone={() => {
          // 여기서 로그인/데스크탑 상태 전환 시작(예: setPhase('login' | 'desktop'))
        }}
      />
      <img src="/wallpapers/wallpapers_1.webp" alt="background" className="background" />

      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p> */}
    </>
  );
}

export default App;
