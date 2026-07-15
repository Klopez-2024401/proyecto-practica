import logoImg from '../../../assets/img/logo.png'

export const Footer = () => {
  return (
    <footer className="border-t border-border/20 bg-surface py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 overflow-hidden rounded-lg border border-border/40 bg-white">
              <img
                src={logoImg}
                alt="Kairo Logo"
                className="h-full w-full scale-[1.85] object-cover"
              />
            </div>
            <span className="text-sm font-bold text-text-primary tracking-tight">Kairo</span>
            <span className="text-xs text-text-secondary">© 2026. Todos los derechos reservados.</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-text-secondary">
            <a href="#" className="transition-colors hover:text-text-primary">Términos y condiciones</a>
            <a href="#" className="transition-colors hover:text-text-primary">Privacidad</a>
            <a href="#" className="transition-colors hover:text-text-primary">Contacto</a>
          </div>

        </div>
      </div>
    </footer>
  )
}
