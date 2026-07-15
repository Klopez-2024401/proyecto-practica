import { Navbar } from '../../../shared/components/layout/Navbar.jsx'
import heroImg from '../../../assets/img/hero.png'

export const HomePage = () => {
  return (
    <div className="bg-dot-grid min-h-screen bg-surface">
      <Navbar />
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-20 text-center">
        <img src={heroImg} alt="" className="h-40 w-auto" />
        <h1 className="text-4xl font-bold tracking-tight text-text-primary">
          Bienvenido
        </h1>
        <p className="max-w-xl text-text-secondary">
          Esta es la página de inicio del proyecto. Todavía no tiene lógica ni
          datos reales, solo la estructura base.
        </p>
      </section>
    </div>
  )
}
