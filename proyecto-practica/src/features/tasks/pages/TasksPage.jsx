import { DashboardLayout } from '../../../shared/components/layout/DashboardLayout.jsx'
import { getUser } from '../../../shared/utils/authSession.js'

export const TasksPage = () => {
  const user = getUser()

  return (
    <DashboardLayout title="Mis tareas">
      <h1 className="text-2xl font-bold text-gray-900">
        Bienvenido{user?.name ? `, ${user.name}` : ''}
      </h1>
      <p className="mt-2 text-gray-600">
        Todavía no hay tareas cargadas — esta vista se conectará al Servicio
        de Gestión de Tareas en el próximo Sprint.
      </p>
    </DashboardLayout>
  )
}
