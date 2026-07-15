import { Navbar } from '../../../shared/components/layout/Navbar.jsx'
import heroImg from '../../../assets/img/hero.png'

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-20 text-center">
        <img src={heroImg} alt="" className="h-40 w-auto" />
        <h1 className="text-4xl font-bold text-gray-900">Bienvenido</h1>
        <p className="max-w-xl text-gray-600">
          Esta es la página de inicio del proyecto. Todavía no tiene lógica ni
          datos reales, solo la estructura base.
        </p>
      </section>
    </div>
  )
}
