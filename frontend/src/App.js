
import './App.css';
import { Body } from './components/Body';
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import "./components/NavBar"
import {About} from './components/About'
import { NavBar } from './components/NavBar';

function App() {
  return (
    <div className="App">
      
    <Router>
    <NavBar/>
    <Routes>
    <Route exact path="/" element={<Body/>} />
    <Route exact path="/About" element={<About/>}/>
    </Routes>
    </Router>

    </div>
  );
}

export default App;
