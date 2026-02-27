import "./App.css";

function App() {
  return (
    <div className="contenedor-principal">
      <header className="cabecera">
        <h1>HELL GAMES</h1>
      </header>

      <nav className="barra-atajos">
        <a href="#noticias" className="btn-atajo">Noticias</a>
        <a href="#reviews" className="btn-atajo">Reseñas</a>
        <a href="#lanzamientos" className="btn-atajo">Salidas</a>
        <a href="#footer" className="btn-atajo">Acerca de</a>
      </nav>

      <div className="contenido-central">
        <main id="noticias" className="seccion-noticias">
          <h2>Últimas Noticias</h2>
          <p className="vacio">Vacio</p>
        </main>
      </div>

      <footer id="footer" className="pie-pagina">
        <p>Hell games 2026</p>
      </footer>
    </div>
  );
}

export default App;
