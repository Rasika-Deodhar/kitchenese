import { useState, useEffect, useRef, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import CuisineSelect from "./components/CuisineSelect";
import ModeToggle from "./components/ModeToggle";
import ResultCard from "./components/ResultCard";
import HistoryChips from "./components/HistoryChips";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { getLabels } from "./labels";
import { fetchAnalogy, ApiError } from "./api";
import { getCached, setCached } from "./cache";

const HISTORY_KEY = "kitchenese_history";
const MAX_HISTORY = 8;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [cuisine, setCuisine] = useState("Indian");
  const [mode, setMode] = useState("cook");
  const [activeConcept, setActiveConcept] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  const isFirstRun = useRef(true);

  const labels = getLabels(mode);

  const addToHistory = useCallback((concept) => {
    setHistory((prev) => {
      const next = [concept, ...prev.filter((c) => c.toLowerCase() !== concept.toLowerCase())].slice(
        0,
        MAX_HISTORY
      );
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const runLookup = useCallback(
    async (concept, cuisineArg, modeArg) => {
      const cached = getCached(concept, cuisineArg, modeArg);
      if (cached) {
        setResult(cached);
        setError(null);
        addToHistory(concept);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchAnalogy(concept, cuisineArg, modeArg);
        setCached(concept, cuisineArg, modeArg, data);
        setResult(data);
        addToHistory(concept);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [addToHistory]
  );

  function handleSubmit(concept) {
    setActiveConcept(concept);
    runLookup(concept, cuisine, mode);
  }

  function handlePairsClick(concept) {
    setActiveConcept(concept);
    runLookup(concept, cuisine, mode);
  }

  function handleHistorySelect(concept) {
    setActiveConcept(concept);
    runLookup(concept, cuisine, mode);
  }

  // Auto-regenerate when cuisine or mode changes while a card is showing.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (activeConcept) {
      runLookup(activeConcept, cuisine, mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuisine, mode]);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          Kitchen<span className="app__title-accent">ese</span>
        </h1>
        <p className="app__subtitle">Tech concepts, served kitchen-side.</p>
      </header>

      <div className="app__controls">
        <ModeToggle mode={mode} onChange={setMode} disabled={loading} />
        <CuisineSelect value={cuisine} onChange={setCuisine} disabled={loading} />
      </div>

      <SearchBar
        value={activeConcept}
        onSubmit={handleSubmit}
        submitLabel={labels.submit}
        disabled={loading}
      />

      <HistoryChips history={history} onSelect={handleHistorySelect} disabled={loading} />

      <main className="app__main">
        {loading && <LoadingState mode={mode} />}
        {!loading && error && <ErrorState message={error} onRetry={() => activeConcept && runLookup(activeConcept, cuisine, mode)} />}
        {!loading && !error && result && (
          <ResultCard result={result} mode={mode} onPairsClick={handlePairsClick} />
        )}
        {!loading && !error && !result && (
          <div className="app__empty">
            <p>Type any tech, programming, or CS concept above and see it served up.</p>
          </div>
        )}
      </main>
    </div>
  );
}
