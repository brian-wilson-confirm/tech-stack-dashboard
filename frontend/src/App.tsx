import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Breadcrumbs } from './components/Breadcrumbs'
import TechStack from './pages/TechStack'
import HistoryPage from './pages/HistoryPage'
import StarredPage from './pages/StarredPage'
import DesignPage from './pages/DesignPage'
import SalesPage from './pages/SalesPage'
import TravelPage from './pages/TravelPage'

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar className="border-r" />
      <div className="flex-1 flex flex-col min-h-screen">
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<TechStack />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/starred" element={<StarredPage />} />
            <Route path="/design" element={<DesignPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/travel" element={<TravelPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
