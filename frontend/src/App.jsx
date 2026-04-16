import React, { useState } from "react";
import ExtractTab from "./ExtractTab";
import HistoryTab from "./HistoryTab";

function App() {
  const [tab, setTab] = useState("extract");

  return (
    <div style={{ padding: 20 }}>
      <h1>🍽 Recipe Extractor</h1>

      <button onClick={() => setTab("extract")}>Extract</button>
      <button onClick={() => setTab("history")}>History</button>

      {tab === "extract" ? <ExtractTab /> : <HistoryTab />}
    </div>
  );
}

export default App;