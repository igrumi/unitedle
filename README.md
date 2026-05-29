# Unitedle

Unitedle es un juego diario inspirado en Wordle, Loldle, Pokédle, entre otros, pero construido alrededor del roster de **Pokemon Unite**. Cada día hay un Pokemon secreto y el objetivo es adivinarlo usando pistas comparativas: rol, evolución, megaevolución, año de lanzamiento, alcance y etapa evolutiva.

La experiencia está pensada para partidas rápidas: eliges un Pokemon, el tablero responde con indicadores de color y flechas, y cada intento te acerca al objetivo del día.

## La Idea

Unitedle combina el ritual de un puzzle diario con el conocimiento de Pokemon Unite. No se trata solo de recordar nombres: el jugador debe leer las pistas, comparar características y reducir posibilidades hasta encontrar la respuesta correcta.

El juego también tiene un incentivo social: quienes inician sesión con Discord pueden guardar su resultado en el ranking diario. Las victorias anónimas cuentan para el total del día, pero la leaderboard está reservada para usuarios autenticados.

## Experiencia Principal

- Pokemon diario compartido para todos los jugadores.
- Buscador con sugerencias del roster de Pokemon Unite.
- Comparación por atributos después de cada intento.
- Indicadores visuales para respuestas correctas, incorrectas y valores mayores/menores.
- Registro local de la victoria del día para conservar el estado al volver.
- Ranking diario con intentos y perfil de Discord.
- Flujo para guardar en ranking después de ganar sin haber iniciado sesión.
- Interfaz disponible en español e inglés, con metadata actualizada según el idioma elegido.

## Tecnologías

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase Auth
- Supabase Postgres

## Ranking y Progreso

El ranking diario muestra solo victorias asociadas a un usuario autenticado. Si alguien gana antes de iniciar sesión, Unitedle conserva la victoria localmente y, al iniciar sesión, la asocia al usuario para que pueda aparecer en la leaderboard sin perder sus intentos.

Esto mantiene dos ideas separadas:

- El contador diario refleja cuántas victorias se registraron.
- La leaderboard premia a quienes guardan su resultado con Discord.

## Estado del Proyecto

Unitedle está en desarrollo activo. El foco actual es pulir la experiencia móvil, mejorar la claridad visual del tablero y fortalecer el flujo de ranking para que el juego se sienta justo, simple y confiable desde cualquier dispositivo.

## Créditos

Unitedle es un proyecto fan-made y no está afiliado con Nintendo, The Pokemon Company, TiMi Studio Group ni Pokemon Unite.
