import { Toaster } from "react-hot-toast";
import "./App.css";
import 'react-loading-skeleton/dist/skeleton.css'
import FilterPanel from "./components/filter-panel/filter-panel.component";

function App() {
  return (
    <div className="p-10 px-6">
      <FilterPanel />
      <Toaster />
    </div>
  );
}

export default App;
