import { DashboardLayout } from '../../../shared/components/layout/DashboardLayout.jsx'

export const AdminDashboardPage = () => {
  return (
    <DashboardLayout title="Panel de Administrador">
      <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
      <p className="mt-2 text-gray-600">
        Este es el panel principal del administrador. Todavía no tiene
        lógica ni datos reales, solo la estructura base.
      </p>
    </DashboardLayout>
  )
}
