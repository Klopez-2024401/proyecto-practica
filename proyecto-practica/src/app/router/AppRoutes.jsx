import { Routes, Route } from 'react-router-dom'
import { HomePage } from '../../features/home/pages/HomePage.jsx'
import { LoginPage } from '../../features/auth/pages/LoginPage.jsx'
import { ClientDashboardPage } from '../../features/client/pages/ClientDashboardPage.jsx'
import { AdminDashboardPage } from '../../features/admin/pages/AdminDashboardPage.jsx'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/client" element={<ClientDashboardPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
    </Routes>
  )
}
