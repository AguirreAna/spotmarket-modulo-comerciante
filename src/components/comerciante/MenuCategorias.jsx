// Menú desplegable completo de Categorías (Mega-Menu tipo Carrefour / Daiana45/proyect)
// Con lista lateral de categorías y columnas dinámicas de subgrupos e ítems.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuCategorias } from '../data/menuCategorias.js';

const coloresGrupo = [
  'bg-amarillo/10 text-amarillo hover:bg-amarillo/20',
  'bg-rojo/10 text-rojo hover:bg-rojo/20',
];

export default function MenuCategorias({ cerrar }) {
  const [activa, setActiva] = useState(0);
  const categoria = menuCategorias[activa] || menuCategorias[0];

  const primeraRef = useRef(null);
  useEffect(() => {
    primeraRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      {/* Fondo oscuro detrás del menú: al tocarlo se cierra */}
      <div
        aria-hidden="true"
        onClick={cerrar}
        className="fixed inset-0 top-16 z-40 bg-negro/60 backdrop-blur-xs cursor-default w-full h-[calc(100vh-4rem)]"
      />

      {/* Panel grande desplegable debajo del navbar */}
      <div
        className="absolute inset-x-0 top-full z-50 mx-auto flex h-100 max-h-[calc(100vh-7rem)] max-w-7xl overflow-hidden rounded-b-md border border-t-0 border-borde bg-gris-oscuro shadow-2xl"
      >
        {/* Izquierda: lista de categorías con scroll propio */}
        <ul className="w-56 shrink-0 overflow-y-auto border-r border-borde py-1.5 scrollbar-none">
          {menuCategorias.map((c, i) => (
            <li key={c.nombre}>
              <Link
                ref={i === 0 ? primeraRef : null}
                to={`/productos?categoria=${encodeURIComponent(c.nombre)}`}
                onClick={cerrar}
                onMouseEnter={() => setActiva(i)}
                onFocus={() => setActiva(i)}
                className={`flex items-center justify-between border-l-2 px-4 py-2 text-xs transition ${
                  i === activa
                    ? 'border-amarillo bg-negro text-amarillo font-bold'
                    : 'border-transparent text-blanco hover:bg-negro/60'
                }`}
              >
                <span>{c.nombre}</span>
                <span aria-hidden className="text-gris-azulado font-bold">›</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Derecha: título, enlace y los grupos en 3 columnas */}
        <div className="hidden flex-1 overflow-y-auto px-8 py-5 md:block scrollbar-none">
          <div className="border-b border-borde pb-2.5">
            <h2 className="text-base font-bold text-blanco">{categoria.nombre}</h2>
            <Link
              to={`/productos?categoria=${encodeURIComponent(categoria.nombre)}`}
              onClick={cerrar}
              className="mt-0.5 inline-block text-[11px] font-bold uppercase tracking-wide text-azul hover:underline"
            >
              VER TODOS LOS PRODUCTOS →
            </Link>
          </div>

          <div className="mt-4 columns-2 gap-8 lg:columns-3">
            {categoria.grupos.map((grupo, i) => (
              <div key={grupo.titulo} className="mb-4 break-inside-avoid">
                <Link
                  to={`/productos?categoria=${encodeURIComponent(categoria.nombre)}&grupo=${encodeURIComponent(grupo.titulo)}`}
                  onClick={cerrar}
                  className={`flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-bold transition ${coloresGrupo[i % coloresGrupo.length]}`}
                >
                  <span>{grupo.titulo}</span>
                  <span aria-hidden>›</span>
                </Link>

                <ul className="mt-2 flex flex-col gap-1.5 px-3">
                  {grupo.items.map((item) => (
                    <li key={item}>
                      <Link
                        to={`/productos?categoria=${encodeURIComponent(categoria.nombre)}&sub=${encodeURIComponent(item)}`}
                        onClick={cerrar}
                        className="text-xs text-gris-azulado transition hover:text-blanco"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
