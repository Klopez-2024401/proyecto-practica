import { Routes, Route } from 'react-router-dom'
import { HomePage } from '../../features/home/pages/HomePage.jsx'
import { LoginPage } from '../../features/auth/pages/LoginPage.jsx'
import { RegisterPage } from '../../features/auth/pages/RegisterPage.jsx'
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage.jsx'
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx'
import { ClientDashboardPage } from '../../features/client/pages/ClientDashboardPage.jsx'
import { AdminDashboardPage } from '../../features/admin/pages/AdminDashboardPage.jsx'
import { TasksPage } from '../../features/tasks/pages/TasksPage.jsx'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/client" element={<ClientDashboardPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
    </Routes>
  )
}
