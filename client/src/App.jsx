import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AlertPreferences from './pages/Preference';
import AboutPage from './pages/About';
import WeatherNews from './pages/WheatherNews';

function App(){
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/preference' element={<AlertPreferences/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/wheather' element={<WeatherNews/>}/>
      </Routes>
    </Router>
  )
};
export default App;