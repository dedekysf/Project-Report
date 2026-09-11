import ProjectDetail from "../tasktag-project-detail.jsx";
import ProjectDetailV2 from "../tasktag-project-detail-v2.jsx";

export default function App() {
  const path = window.location.pathname;

  if (path === "/") {
    window.location.replace("/v1" + window.location.search);
    return null;
  }

  if (path.startsWith("/v1")) {
    return <ProjectDetail />;
  }

  if (path.startsWith("/v2")) {
    return <ProjectDetailV2 />;
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", color: "#0a1629" }}>
      Page not found.
    </div>
  );
}
