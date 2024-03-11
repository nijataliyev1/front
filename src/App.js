import LoginSignin from "./Components/LoginSignin";
import {
  Routes,
  Route
} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="front/"
          element={<LoginSignin />}
        />
      </Routes>
      
    </div>
  );
}

export default App;
