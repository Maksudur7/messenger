async function checkApi() {
  const res = await fetch('https://frontend-task-chatapp.onrender.com/docs/swagger-ui-init.js');
  const text = await res.text();
  const pathsMatch = text.match(/"paths":\s*(\{.*?\})\s*,\s*"definitions"/s) || text.match(/"paths":\s*(\{.*?\})\s*,\s*"components"/s);
  
  if (pathsMatch) {
    const paths = JSON.parse(pathsMatch[1]);
    console.log("=== ALL AVAILABLE BACKEND API ENDPOINTS ===");
    for (const p of Object.keys(paths)) {
      console.log(p, Object.keys(paths[p]));
    }
  } else {
    console.log("Could not parse paths JSON, printing raw match area:");
    const idx = text.indexOf('"paths":');
    console.log(text.slice(idx, idx + 2000));
  }
}

checkApi();
