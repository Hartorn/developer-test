import './App.css'

import ConfigurationDisplay from './Config'
import RoutesDisplay from './Routes'
import ScenarioDisplay from './Scenario'

function App() {
  const backend_url = "http://127.0.0.1:8000"
  return (
    <div className="card">
      <h1>What are the odds?</h1>
      <ConfigurationDisplay targetUrl={`${backend_url}/config`} />
      <RoutesDisplay targetUrl={`${backend_url}/routes`} />
      <ScenarioDisplay targetUrl={`${backend_url}/odds_file`} />
    </div>
  )
}

export default App
