import html from '../lib/whatwg-flora';

export const config = {
  runtime: 'edge'
}

function encodeHTML(s: string) {
  return s.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function removePlus(s: string) {
  return s.replace(/\+/g, ' ');
}

export default async function (req: Request) {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "What are Web Intents?";

  const response = fetch(`${proto}://tldr.rocks/api/polymath.js?query=${query}`);

  try {
    const output = await html`
    <html>
      <head>
        <title>Ask Paul: ${removePlus(encodeHTML(query))}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/ask.css">
        <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-S99S9FDQQP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-S99S9FDQQP');
</script>
      </head>
      <body>
      <header>
        <h1>Question</h1>
        <form method="GET" action="/ask-paul">
          <input type="text" name="query" value="${removePlus(encodeHTML(query))}"/>
          <input type="submit" value="Ask" />
        </form>
      </header>
      <main>
      <p class="loader">Particulating Splines... One moment please.</p>
      ${response
        .then(result => {
          if (result.ok) {
            return result.json()
              .then(({ completion, infos }) => html`<article class="completion">${encodeHTML(completion)}</article><div class="results"><h2>Links</h2>
          ${infos.map((bit) => html`<p class="link"><a href="${bit.url}">${bit.title}</a></p>`)}<style>.loader {display:none;}</style></div>`)
              .catch((e) => html`<p class="error">Something went wrong.</p>`)
          }
          else {
            console.log("Ok", result.ok);
            console.log("Status", result.status);
            console.log("StatusText", result.statusText);
          }
          return html`There was an error.`;
        })
      }
      </main>
      <footer>
      <p>Powered by <a href="https://www.npmjs.com/package/@polymath-ai/client">Polymath</a>.</p>
      </footer>
    </body>
  </html>`;
    return new Response(output, { headers: { "content-type": "text/html" } });
  } catch (e) {
    console.log(e);
    return new Response("Error", { headers: { "content-type": "text/html" }, status: 500 });
  }
}
