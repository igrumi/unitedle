interface LogoProps {
  className?: string; // Por si quieres añadir estilos extra como margen
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <img 
        src="/unitedle_logo.png" // Asegúrate de tener el archivo en tu carpeta /public del nuevo proyecto
        alt="Unitedle Logo"
        // Este es el tamaño responsivo que definimos al final (compacto)
        className="w-16 md:w-20 lg:w-24 h-auto object-contain transition-all duration-300"
        loading="eager" // Al ser el logo, queremos que cargue rápido
      />
    </div>
  );
};