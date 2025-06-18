import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import ReviewAnswers from './components/ReviewAnswers';
import ParticleBackground from './components/ParticleBackground';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ParticleBackground />
        <Switch>
          <Route path="/" exact component={Quiz} />
          <Route path="/result" component={Result} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/settings" component={Settings} />
          <Route path="/review" component={ReviewAnswers} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;