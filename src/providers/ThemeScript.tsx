/* Runs before paint to stamp data-theme on <html>, avoiding a flash of the
   wrong theme. Reads the saved preference, else falls back to the OS setting.
   Server component — emits a tiny inline script. */
export function ThemeScript() {
  const js = `(function(){try{
    var t=localStorage.getItem('bricklayer:theme');
    if(!t){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}
    document.documentElement.setAttribute('data-theme',t);
  }catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
