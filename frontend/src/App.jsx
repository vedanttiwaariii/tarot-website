import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import Landing from './pages/Landing'
import AdminDashboard from './pages/AdminDashboard'
import ManageBooking from './pages/ManageBooking'
import Disclaimer from './pages/Disclaimer'

function App() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/disclaimer" element={
            <div className="min-h-screen flex flex-col w-full">
              <Navbar />
              <main className="flex-grow w-full">
                <Disclaimer />
              </main>
              <Footer />
              <MobileBottomNav />
            </div>
          } />
          <Route path="/manage-booking" element={
            <div className="min-h-screen flex flex-col w-full">
              <Navbar />
              <main className="flex-grow w-full">
                <ManageBooking />
              </main>
              <Footer />
              <MobileBottomNav />
            </div>
          } />
          <Route path="*" element={
            <div className="min-h-screen flex flex-col w-full">
              <Navbar />
              <main className="flex-grow w-full">
                <Landing />
              </main>
              <Footer />
              <MobileBottomNav />
            </div>
          } />
        </Routes>
      </Router>
    </div>
  )
}

export default App