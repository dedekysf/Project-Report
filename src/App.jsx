import ProjectDetail from "../tasktag-project-detail.jsx";
import ProjectDetailV2 from "../tasktag-project-detail-v2.jsx";

// v2 is now the default (served at "/"); v1 lives on at /archive.
// /v1 and /v2 are kept as aliases so existing links don't break.
export default function App() {
  const path = window.location.pathname;

  if (path === "/" || path.startsWith("/v2")) {
    return <ProjectDetailV2 />;
  }

  if (path.startsWith("/archive") || path.startsWith("/v1")) {
    return <ProjectDetail />;
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", color: "#0a1629" }}>
      Page not found.
    </div>
  );
}
