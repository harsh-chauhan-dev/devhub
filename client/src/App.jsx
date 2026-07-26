import Approute from "./routes/Approute";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Approute />
    </ErrorBoundary>
  );
}

export default App;
