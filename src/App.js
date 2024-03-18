import LoginSignin from "./Components/LoginSignin";
import { useSelector } from 'react-redux';

function App() {

  const general = useSelector(state => state.general);

  return (
    <div className="App">
      {
        Boolean(general.user) ||
        <LoginSignin />
      }
    </div>
  );
}

export default App;
