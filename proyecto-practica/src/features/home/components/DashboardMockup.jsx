import mockupImg from '../../../assets/img/Imagen_1.jpg'

export const DashboardMockup = () => {
  return (
    <div className="relative lg:col-span-7">
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-primary/5">
        <img
          src={mockupImg}
          alt="Kairo Dashboard Mockup"
          className="w-full h-auto object-cover rounded-2xl"
        />
      </div>
    </div>
  )
}
