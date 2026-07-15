import { DashboardLayout } from '../../../shared/components/layout/DashboardLayout.jsx'

export const ClientDashboardPage = () => {
  return (
    <DashboardLayout title="Panel de Cliente">
      <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
      <p className="mt-2 text-gray-600">
        Este es el panel principal del cliente. Todavía no tiene lógica ni
        datos reales, solo la estructura base.
      </p>
    </DashboardLayout>
  )
}
