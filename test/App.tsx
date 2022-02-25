import React, { useState } from "https://esm.sh/react@17.0.2";

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Deno ❤ React!</h1>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        count :{count}
      </button>
    </div>
  );
};

export default App;
