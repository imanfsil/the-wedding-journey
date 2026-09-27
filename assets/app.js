const pages = {
  dashboard: {
    title: "Dashboard",
    render: () => `
      <div class="hero">
        <p class="eyebrow">IMAN & DANIAL</p>
        <h2>Our Wedding Journey ♡</h2>
        <p>
          Tunang — 1 May 2027
          &nbsp; • &nbsp;
          Akad Nikah — 28 August 2027
        </p>
      </div>

      <div class="grid">
        <div class="card">
          <div class="metric-label">💰 TOTAL BUDGET</div>
          <div class="metric-value">RM —</div>
        </div>

        <div class="card">
          <div class="metric-label">💸 PAID</div>
          <div class="metric-value">RM —</div>
        </div>

        <div class="card">
          <div class="metric-label">⏳ BALANCE</div>
          <div class="metric-value">RM —</div>
        </div>

        <div class="card">
          <div class="metric-label">📋 PROGRESS</div>
          <div class="metric-value">0%</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          <h3>Wedding Progress</h3>
          <span class="small">0 / 0 tasks</span>
        </div>

        <div class="card">
          <strong>Overall preparation</strong>

          <div class="progress">
            <span style="width:0%"></span>
          </div>
        </div>
      </div>

      <div class="section two-col">

        <div class="card">
          <div class="section-title">
            <h3>🔔 Next To Do</h3>
            <span class="badge">View only</span>
          </div>

          <div class="task">
            <i class="check"></i>

            <div>
              <strong>Visit JIWA Damansara</strong>
              <span>4 October 2026 • Nikah</span>
            </div>
          </div>

          <div class="task">
            <i class="check"></i>

            <div>
              <strong>Book JIWA Damansara</strong>
              <span>Venue • Nikah</span>
            </div>
          </div>

          <div class="task">
            <i class="check"></i>

            <div>
              <strong>Kursus Pra-Perkahwinan</strong>
              <span>November / December 2026</span>
            </div>
          </div>
        </div>

        <div class="card">

          <div class="section-title">
            <h3>💍 Events</h3>
          </div>

          <div class="task">
            <div>
              <strong>Majlis Tunang</strong>
              <span>1 May 2027</span>
            </div>
          </div>

          <div class="task">
            <div>
              <strong>Akad Nikah</strong>
              <span>
                28 August 2027 • JIWA Damansara
              </span>
            </div>
          </div>

        </div>

      </div>
    `
  },

  timeline: {
    title: "Timeline",

    render: () =>
      simplePage(
        "📋 Wedding Timeline",
        "All major preparation tasks will appear here once the Google Sheets backend is connected."
      )
  },

  budget: {
    title: "Budget",

    render: () =>
      simplePage(
        "💰 Budget",
        "Budget, paid amount and balance will be loaded from the Google Sheets backend."
      )
  },

  tunang: {
    title: "Tunang",

    render: () =>
      simplePage(
        "💍 Tunang",
        "Theme, card, outfit, fitting, MUA and dulang planning."
      )
  },

  nikah: {
    title: "Nikah + Resepsi",

    render: () =>
      simplePage(
        "🤍 Nikah + Resepsi",
        "Venue, outfit, fitting, MUA, card, decor, dulang and jewellery."
      )
  },

  guests: {
    title: "Guest List",

    render: () =>
      simplePage(
        "👥 Guest List",
        "Guest list and RSVP data will be loaded from the Google Sheets backend."
      )
  },

  legal: {
    title: "Legal",

    render: () =>
      simplePage(
        "📑 Legal",
        "Selangor/Melaka documents, course, HIV test, SPPIM and Kebenaran Berkahwin."
      )
  },

  prep: {
    title: "Personal Prep",

    render: () =>
      simplePage(
        "🧖🏻‍♀️ Personal Prep",
        "Beauty, self-care, fitting follow-up and final preparation."
      )
  },

  inspo: {
    title: "Inspiration",

    render: () => `
      <div class="section">

        <div class="section-title">
          <h3>🎨 Inspiration Vault</h3>

          <span class="small">
            Google Drive media will appear here
          </span>
        </div>

        <div class="media-grid">

          ${["Card", "Baju", "Decor", "MUA"]
            .map(
              x => `
                <div class="media-card">

                  <div class="media-placeholder">
                    ♡
                  </div>

                  <div>
                    <strong>${x}</strong>
                    <br>

                    <span class="small">
                      No media yet
                    </span>
                  </div>

                </div>
              `
            )
            .join("")}

        </div>

      </div>
    `
  }
};


function simplePage(title, text) {

  return `
    <div class="hero">

      <p class="eyebrow">
        IMAN & DANIAL
      </p>

      <h2>
        ${title}
      </h2>

      <p>
        ${text}
      </p>

    </div>

    <div class="card empty">

      Backend connection will populate this section.

    </div>
  `;
}


const app = document.getElementById("app");

const pageTitle = document.getElementById("pageTitle");


function showPage(key) {

  const page = pages[key] || pages.dashboard;

  pageTitle.textContent = page.title;

  app.innerHTML = page.render();


  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === key
      );

    });


  document
    .getElementById("sidebar")
    .classList.remove("open");

}


document
  .querySelectorAll(".nav-item")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => showPage(button.dataset.page)
    );

  });


document
  .getElementById("mobileMenu")
  .addEventListener(
    "click",
    () => {

      document
        .getElementById("sidebar")
        .classList.toggle("open");

    }
  );


showPage("dashboard");


// =====================================================
// GOOGLE APPS SCRIPT BACKEND
// =====================================================
//
// This will be connected later.
//
// DO NOT put passwords, private keys,
// Google credentials, or admin secrets here.
//
// Example:
//
// const API_URL =
//   "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
//
// =====================================================
