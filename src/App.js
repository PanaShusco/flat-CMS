import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [noticias, setNoticias] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [parrafo, setParrafo] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");

  const cargarNoticias = async () => {
    try {
      const respuesta = await fetch("/noticias");
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setNoticias(datos);
      }
    } catch (error) {
      console.log("Esperando conexión con el backend...");
    }
  };

  useEffect(() => {
    cargarNoticias();
    const intervalo = setInterval(cargarNoticias, 2000);
    return () => clearInterval(intervalo);
  }, []);

  const manejarPublicacion = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      alert("¡El título de la noticia es obligatorio!");
      return;
    }

    const nueva = {
      id: Date.now(),
      titulo: titulo.trim(),
      parrafo: parrafo.trim(),
      imagen: imagenUrl.trim(),
      hora: new Date().toLocaleTimeString(),
    };

    try {
      await fetch("/noticias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva),
      });
      cargarNoticias();

      setTitulo("");
      setParrafo("");
      setImagenUrl("");
      setMostrarFormulario(false);
    } catch (e) {
      alert("El servidor Node.js debe estar corriendo en el puerto 3001.");
    }
  };

  const borrarNoticia = async (id) => {
    try {
      await fetch(`/noticias/${id}`, { method: "DELETE" });
      cargarNoticias();
    } catch (e) {
      console.error("Error al borrar", e);
    }
  };

  return (
    <div className="contenedor-principal">
      <header className="cabecera">
        <h1>HELL GAMES</h1>
      </header>

      <nav className="barra-atajos">
        <a href="#noticia" className="btn-atajo">
          Noticias
        </a>
        <a href="#review" className="btn-atajo">
          Reseñas
        </a>
        <a href="#lanzamiento" className="btn-atajo">
          Salidas
        </a>
        <a href="#acercaDe" className="btn-atajo">
          Acerca de
        </a>
      </nav>

      <div className="contenido-central">
        <main id="noticia" className="seccion-noticias">
          <div className="encabezado-noticias">
            <h2>Últimas Noticias</h2>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className={mostrarFormulario ? "btn-cancelar" : "btn-add"}
            >
              {mostrarFormulario ? "x" : "+"}
            </button>
          </div>

          {mostrarFormulario && (
            <form onSubmit={manejarPublicacion} className="formulario-crear">
              <input
                type="text"
                placeholder="Título de la noticia... (obligatorio)"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              <input
                type="text"
                placeholder="URL de la imagen... (opcional)"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
              />
              <textarea
                placeholder="Desarrolla la noticia aquí... (opcional)"
                rows="3"
                value={parrafo}
                onChange={(e) => setParrafo(e.target.value)}
              ></textarea>
              <button type="submit" className="btn-publicar">
                Publicar Noticia
              </button>
            </form>
          )}

          <div className="lista-scroll">
            {noticias.length === 0 && <p className="vacio">Sin noticias...</p>}

            {noticias.map((item) => (
              <div key={item.id} className="tarjeta-noticia">
                <button
                  onClick={() => borrarNoticia(item.id)}
                  className="btn-borrar"
                >
                  🗑️
                </button>

                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt="Portada de noticia"
                    className="imagen-noticia"
                  />
                )}

                <div className="info-noticia">
                  <h4 className="titulo-noticia">{item.titulo}</h4>
                  {item.parrafo && (
                    <p className="parrafo-noticia">{item.parrafo}</p>
                  )}

                  <small className="hora-noticia">{item.hora}</small>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="panel-lateral">
          <section id="review" className="seccion-extra">
            <h3>Reseñas Destacadas</h3>
            <p>
              <strong>Elden Ring: Shadow of the Erdtree</strong>
              <br />
              Una expansión masiva que redefine el juego base. 10/10.
            </p>
            <hr />
            <p>
              <strong>Resident Evil Requiem</strong>
              <br />
              Jugar con Grace es básicamente "Escondite Extremo", donde el
              buscador quiere comerte la cara. Luego cambias a Leon, que está
              demasiado cansado para seguir asustado y empieza a parar todo con
              un hacha. 10/10
            </p>
          </section>

          <section id="lanzamiento" className="seccion-extra">
            <h3>Próximos Lanzamientos</h3>
            <ul>
              <li>5/3/2026 - Pokémon Pokopia</li>
              <li>19/3/2026 - Crimson Desert</li>
              <li>24/4/2026 - Pragmata</li>
              <li>19/5/2026 - Forza Horizon 6</li>
            </ul>
          </section>
        </aside>
      </div>

      <footer id="acercaDe" className="pie-pagina">
        <div className="footer-contenido">
          <div className="footer-seccion">
            <h4>SOBRE HELL GAMES</h4>
            <p>
              Sitio para las noticias más recientes, reseñas y las últimas
              novedades del mundo del gaming. Mantente al día con nosotros.
            </p>
          </div>

          <div className="footer-seccion">
            <h4>NUESTRAS REDES</h4>
            <div className="redes-sociales">
              <a
                href="https://www.facebook.com/profile.php?id=100063899859494&sk=about"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
