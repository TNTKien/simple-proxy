addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("nothing here", { status: 400 });
  }

  const targetRequestUrl = new URL(targetUrl);

  for (const [key, value] of url.searchParams.entries()) {
    if (key !== "url") {
      targetRequestUrl.searchParams.append(key, value);
    }
  }

  const modifiedRequest = new Request(targetRequestUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "follow",
  });

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);

  // Inject CORS headers
  modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
  modifiedResponse.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  modifiedResponse.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return modifiedResponse;
}
