import LoginSignin from "./Components/LoginSignin";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="front/"
          element={<LoginSignin />}
        ></Route>
      </Routes>
      
    </div>
  );
}

export default App;
