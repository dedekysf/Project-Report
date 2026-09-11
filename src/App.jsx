import ProjectDetail from "../tasktag-project-detail.jsx";

// /v1 is this version of the report preview; /v2 (a different version)
// will get its own branch here once it exists.
export default function App() {
  const path = window.location.pathname;

  if (path === "/") {
    window.location.replace("/v1" + window.location.search);
    return null;
  }

  if (path.startsWith("/v1")) {
    return <ProjectDetail />;
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", color: "#0a1629" }}>
      Page not found.
    </div>
  );
}
