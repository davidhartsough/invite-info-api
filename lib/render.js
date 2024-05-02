"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function renderPage({ id, title, location, description, start, end, link, email, gCalLink, icsLink, }) {
    const metaTitle = `"${title}" | Invite•Info`;
    const metaDescription = `"${title}" • Event details: "${description}"`;
    const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${metaTitle}</title>
      <meta name="description" content="${metaDescription}" />
      <meta name="keywords" content="event,meetup,share,invite,invitation,info,information" />
      <meta name="author" content="David Hartsough" />
      <meta name="application-name" content="Invite•Info" />
      <meta name="theme-color" content="#132535" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="${metaTitle}" />
      <meta property="og:description" content="${metaDescription}" />
      <meta property="og:url" content="https://invite-info.web.app/event/${id}" />
      <meta property="og:site_name" content="Invite•Info" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content="/icon512.png" />
      <meta property="og:image:alt" content="Invite•Info logo icon" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="${metaTitle}" />
      <meta name="twitter:description" content="${metaDescription}" />
      <meta name="twitter:image" content="/icon512.png" />
      <meta name="twitter:image:alt" content="Invite•Info logo icon" />
      <meta name="twitter:image:type" content="image/png" />
      <meta name="twitter:image:width" content="512" />
      <meta name="twitter:image:height" content="512" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
      <link rel="icon" href="/icon16.png" type="image/png" sizes="16x16" />
      <link rel="icon" href="/icon32.png" type="image/png" sizes="32x32" />
      <link rel="icon" href="/icon192.png" type="image/png" sizes="192x192" />
      <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#132535" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="stylesheet" href="/base.css" />
      <link rel="stylesheet" href="/event.css" />
    </head>
    <body>
      <main>
        <nav>
          <a href="/" class="brand flex-center">
            <span class="logo-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg></span>
            Invite <span class="separator">•</span> Info
          </a>
        </nav>
        <header>
          <div class="centered">
            <h1 id="title">${title}</h1>
          </div>
        </header>
        <section>
          <div class="centered">
            <div class="info" id="when">
              <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h5" /><path d="M17.5 17.5 16 16.25V14" /><path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" /></svg></div>
              <p id="date-time">
                <span id="start" data-dtms="${start}">...</span> - <span id="end" data-dtms="${end}">...</span>
              </p>
            </div>
            <div class="info" id="where">
              <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></div>
              <p id="location">${location}</p>
            </div>
            ${link
        ? `<div class="info" id="website">
              <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-2"><path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 1 1 0 10h-2" /><line x1="8" x2="16" y1="12" y2="12" /></svg></div>
              <p><a href="${link}" id="link" target="_blank">${link}</a></p>
            </div>`
        : ""}
            ${email
        ? `<div class="info" id="contact">
              <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg></div>
              <p><a href="mailto:${email}" id="email" target="_blank">${email}</a></p>
            </div>`
        : ""}
            <div id="what">
              <p id="description">${description}</p>
            </div>
            <footer>
              <button type="button" class="btn flex-center" id="add-to-cal">
                <span class="btn-icon icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-plus"><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><line x1="19" x2="19" y1="16" y2="22" /><line x1="16" x2="22" y1="19" y2="19" /></svg></span>
                <span>Add to Calendar</span>
              </button>
              <div id="modal">
                <div>
                  <a href="${gCalLink}" target="_blank" id="add-to-google-cal" class="cal-btn">
                    <span class="btn-icon icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi" viewBox="0 0 16 16"><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" /></svg></span>
                    <span class="btn-text">Google</span>
                  </a>
                  <a href="${icsLink}" target="_blank" id="add-to-apple-cal" class="cal-btn" download="event-${id}.ics">
                    <span class="btn-icon icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi" viewBox="0 0 16 16"><path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7" /><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" /></svg></span>
                    <span class="btn-text">Other</span>
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </section>
      </main>
      <script src="/event.js"></script>
    </body>
  </html>`;
    return html;
}
exports.default = renderPage;
//# sourceMappingURL=render.js.map