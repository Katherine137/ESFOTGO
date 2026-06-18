import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import Login from './pages/Login'
import { Forgot } from './pages/Forgot'
import { Register } from './pages/Register'
import Reset from './pages/Reset'
import { Map } from './pages/Map'
import Dashboard from './layout/Dashboard'
import Profile from './pages/Profile'
import Event from './pages/Event'
import Chat from './pages/Chat'
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import { useEffect } from 'react'
import storeProfile from './context/storeProfile'
import storeAuth from './context/storeAuth'
import DashboardHome from './pages/DashboardHome'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Classroom from './pages/Classroom'
import Teacher from './pages/Teacher'
import Tutoring from './pages/Tutoring'
import List from './pages/List'
import ListClassroom from './components/List/ListClassroom'
import ListEvents from './components/List/ListEvents'
import ListTeacher from './components/List/ListTeacher'
import ListStudent from './components/List/ListStudents'
import MapCreate from './components/Mapcreate'
import CardUpdate from './components/event/CardUpdate'
import ListTutoring from './components/list/ListTutoring'

function App() {
  const { profile } = storeProfile()
  const { token } = storeAuth()

  useEffect(() => {
    if(token){
      profile()
    }
  }, [token])

  return (  
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute/>}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />}/>
          <Route path='register' element={<Register/>}/>
          <Route path='forgot/:id' element={<Forgot/>}/>
          <Route path='recuperarpassword/:token' element={<Reset/>}/>
          <Route path='map' element={<Map/>}/>
        </Route>

        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='event' element={<Event/>}/>
          <Route path='classroom' element={<Classroom/>}/>
          <Route path='teacher' element={<Teacher/>}/>
          <Route path='tutoring' element={<Tutoring/>}/>
          <Route path='actualizarevento/:id' element={<CardUpdate/>}/>
          <Route path='list' element={<List/>}/>
          <Route path='list/aulas' element={<ListClassroom/>}/>
          <Route path='list/eventos' element={<ListEvents/>}/>
          <Route path='list/docentes' element={<ListTeacher/>}/>
          <Route path='list/estudiantes' element={<ListStudent/>}/>
          <Route path='list/tutorias' element={<ListTutoring/>}/>
          <Route path='mapcreate' element={<MapCreate/>}/>
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App