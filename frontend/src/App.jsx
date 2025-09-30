import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import InterviewDashboard from './pages/InterviewDashboard'


const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/dashboard' element={<InterviewDashboard/>} />
      </Routes>
    </div>
  )
}

export default App