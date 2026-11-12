import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { setLang, useLang } from "./i18n.ts";
import { Home } from "./Home.tsx";
import { Studio } from "./Studio.tsx";

const REPO = "https://github.com/tahamukhtar20/rideau";

function readRoute() {
  return { path: location.pathname.replace(/\/+$/, "") || "/", scene: new URLSearchParams(location.search).get("scene") };
}

export default function App() {
  const { lang, t } = useLang();
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onPop = () => setRoute(readRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const go = (path: string) => {
    history.pushState(null, "", path);
    setRoute(readRoute());
    window.scrollTo(0, 0);
  };
  const link = (path: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    go(path);
  };
  const inStudio = route.path === "/studio";

  return (
    <div className={inStudio ? "app in-studio" : "app"}>
      <header className="top">
        <a className="logo" href="/" onClick={link("/")}>
          Rideau<b>.</b>
        </a>
        <nav>
          <a href="/studio" onClick={link("/studio")} aria-current={inStudio ? "page" : undefined}>
            {t.studio}
          </a>
          {!inStudio && <a href="#how">{t.how}</a>}
        </nav>
        <div className="sp" />
        <div className="lang" role="group" aria-label={t.language}>
          {(["en", "fr"] as const).map((l) => (
            <button key={l} type="button" className={l === lang ? "on" : ""} aria-pressed={l === lang} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        {!inStudio && (
          <a className="btn" href="/studio" onClick={link("/studio")}>
            {t.openStudio}
          </a>
        )}
      </header>
      {/* Remount the studio when the sample in the URL changes. */}
      {inStudio ? <Studio key={route.scene ?? ""} sceneId={route.scene} /> : <Home go={go} />}
      {!inStudio && (
        <footer className="foot">
          <span>{t.footer}</span>
          <a href={REPO}>{t.source}</a>
        </footer>
      )}
    </div>
  );
}
