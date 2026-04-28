export const Loading = () => {
  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2 text-2xl font-medium">
        <span>Cargando</span>
        <div className="flex gap-1.5 pt-2">
          <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};