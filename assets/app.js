const API_URL = "https://script.google.com/macros/s/AKfycbwu-U9RJ7Rf6xrBoveNEclQWetHP-NlJl9Y36wcjK4q59KuhNYQvS33omGV9mvgS2c/exec";

const cache = {};

const pageConfig = {
  timeline: {
    title: "Timeline",
    action: "workflow",
    heading: "📋 Wedding Timeline",
    description: "Your wedding preparation workflow from Google Sheets."
  },

  budget: {
    title: "Budget",
    action: "budget",
    heading: "💰 Wedding Budget",
    description: "Budget, paid amount and balance from Google Sheets."
  },

  tunang: {
    title: "Tunang",
    action: "tunang",
    heading: "💍 Majlis Tunang",
    description: "Planning details for the engagement ceremony."
  },

  nikah: {
    title: "Nikah + Resepsi",
    action: "nikah",
    heading: "🤍 Nikah + Resepsi",
    description: "Akad nikah and reception planning details."
  },

  guests: {
    title: "Guest List",
    action: "guests",
    heading: "👥 Guest List",
    description: "Guest and RSVP information from Google Sheets."
  },

  legal: {
    title: "Legal",
    action: "legal",
    heading: "📑 Legal & Documents",
    description: "Marriage course, documents, HIV test and permission checklist."
  },

  prep: {
    title: "Personal Prep",
    action: "prep",
    heading: "🧖🏻‍♀️ Personal Prep",
    description: "Personal preparation and beauty checklist."
  },

  inspo: {
    title: "Inspiration",
    action: "files",
    heading: "🎨 Inspiration Vault",
    description: "Media references stored in Google Drive and listed in the Media sheet."
  }
};


const app = document.getElementById("app");
const pageTitle = document.getElementById("pageTitle");


async function api(action) {

  if (cache[action]) {
    return cache[action];
  }

  const response = await fetch(
    `${API_URL}?action=${encodeURIComponent(action)}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(
      `Backend request failed (${response.status})`
    );
  }

  const data = await response.json();

  if (!data.ok) {
    throw new Error(
      data.error ||
      "Backend returned an error."
    );
  }

  cache[action] = data;

  return data;
}


function money(value) {

  const n =
    Number(value) || 0;

  return `RM ${n.toLocaleString(
    "en-MY",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }
  )}`;
}


function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function isUrl(value) {

  return /^https?:\/\//i.test(
    String(value || "").trim()
  );
}


function renderTable(data) {

  const headers =
    data.headers || [];

  const rows =
    data.rows || [];


  if (!headers.length) {

    return `
      <div class="card empty">
        No data has been added to this section yet.
      </div>
    `;
  }


  return `
    <div class="table-wrap">

      <table class="table">

        <thead>

          <tr>

            ${headers
              .map(
                h =>
                  `<th>${escapeHtml(h)}</th>`
              )
              .join("")
            }

          </tr>

        </thead>


        <tbody>

          ${
            rows.length

              ? rows
                  .map(
                    row => `

                      <tr>

                        ${
                          headers
                            .map(
                              h => {

                                const value =
                                  row[h];

                                return `
                                  <td>

                                    ${
                                      isUrl(value)

                                        ? `
                                          <a
                                            href="${escapeHtml(value)}"
                                            target="_blank"
                                            rel="noopener"
                                          >
                                            Open
                                          </a>
                                        `

                                        : escapeHtml(value)
                                    }

                                  </td>
                                `;

                              }
                            )
                            .join("")
                        }

                      </tr>

                    `
                  )
                  .join("")

              : `
                  <tr>
                    <td colspan="${headers.length}">
                      No entries yet.
                    </td>
                  </tr>
                `
          }

        </tbody>

      </table>

    </div>
  `;
}


function loading(
  title = "Loading…"
) {

  return `
    <div class="hero">

      <p class="eyebrow">
        IMAN & DANIAL
      </p>

      <h2>
        ${title}
      </h2>

      <p>
        Connecting to your wedding planner data…
      </p>

    </div>

    <div class="card empty">
      Please wait.
    </div>
  `;
}


function errorPage(error) {

  return `
    <div class="hero">

      <p class="eyebrow">
        IMAN & DANIAL
      </p>

      <h2>
        Unable to load this section
      </h2>

      <p>
        ${escapeHtml(
          error.message || error
        )}
      </p>

    </div>

    <div class="card empty">

      Please refresh the page.

      If the problem continues,
      check the Google Apps Script
      Web App deployment.

    </div>
  `;
}


async function renderDashboard() {

  app.innerHTML =
    loading(
      "Our Wedding Journey ♡"
    );


  try {

    const data =
      await api(
        "dashboard"
      );


    const b =
      data.budget || {};

    const w =
      data.workflow || {};

    const g =
      data.guests || {};


    const pct =
      Number(
        w.percentage
      ) || 0;


    const workflow =
      await api(
        "workflow"
      )
      .catch(
        () => ({
          rows: [],
          headers: []
        })
      );


    const nextTasks =
      (
        workflow.rows || []
      )
      .filter(
        r =>
          ![
            "done",
            "completed",
            "✅ done"
          ].includes(
            String(
              r.Status || ""
            )
            .toLowerCase()
            .trim()
          )
      )
      .slice(
        0,
        3
      );


    app.innerHTML = `

      <div class="hero">

        <p class="eyebrow">
          IMAN & DANIAL
        </p>

        <h2>
          Our Wedding Journey ♡
        </h2>

        <p>
          Tunang — 1 May 2027
          &nbsp; • &nbsp;
          Akad Nikah — 28 August 2027
        </p>

      </div>


      <div class="grid">

        <div class="card">

          <div class="metric-label">
            💰 TOTAL BUDGET
          </div>

          <div class="metric-value">
            ${money(b.budget)}
          </div>

        </div>


        <div class="card">

          <div class="metric-label">
            💸 PAID
          </div>

          <div class="metric-value">
            ${money(b.paid)}
          </div>

        </div>


        <div class="card">

          <div class="metric-label">
            ⏳ BALANCE
          </div>

          <div class="metric-value">
            ${money(b.balance)}
          </div>

        </div>


        <div class="card">

          <div class="metric-label">
            📋 PROGRESS
          </div>

          <div class="metric-value">
            ${pct}%
          </div>

        </div>

      </div>


      <div class="section">

        <div class="section-title">

          <h3>
            Wedding Progress
          </h3>

          <span class="small">
            ${w.completed || 0}
            /
            ${w.total || 0}
            tasks
          </span>

        </div>


        <div class="card">

          <strong>
            Overall preparation
          </strong>

          <div class="progress">

            <span
              style="width:${Math.max(
                0,
                Math.min(
                  100,
                  pct
                )
              )}%"
            ></span>

          </div>

        </div>

      </div>


      <div class="section two-col">


        <div class="card">

          <div class="section-title">

            <h3>
              🔔 Next To Do
            </h3>

            <span class="badge">
              View only
            </span>

          </div>


          ${
            nextTasks.length

              ? nextTasks
                  .map(
                    task => `

                      <div class="task">

                        <i class="check"></i>

                        <div>

                          <strong>
                            ${escapeHtml(
                              task.Task ||
                              task.Title ||
                              task.Name ||
                              "Wedding task"
                            )}
                          </strong>

                          <span>
                            ${escapeHtml(
                              task.Date ||
                              task.Due ||
                              task.Event ||
                              task.Remark ||
                              "From Workflow"
                            )}
                          </span>

                        </div>

                      </div>

                    `
                  )
                  .join("")

              : `
                  <div class="empty">
                    No pending workflow tasks.
                  </div>
                `
          }

        </div>


        <div class="card">

          <div class="section-title">

            <h3>
              💍 Events
            </h3>

          </div>


          <div class="task">

            <div>

              <strong>
                Majlis Tunang
              </strong>

              <span>
                1 May 2027
              </span>

            </div>

          </div>


          <div class="task">

            <div>

              <strong>
                Akad Nikah
              </strong>

              <span>
                28 August 2027
                • JIWA Damansara
              </span>

            </div>

          </div>


          <div class="task">

            <div>

              <strong>
                Guest RSVP
              </strong>

              <span>
                ${g.attending || 0}
                attending /
                ${g.total || 0}
                pax
              </span>

            </div>

          </div>

        </div>

      </div>

    `;

  }

  catch (error) {

    app.innerHTML =
      errorPage(error);

  }

}


async function renderDataPage(key) {

  const config =
    pageConfig[key];


  pageTitle.textContent =
    config.title;


  app.innerHTML =
    loading(
      config.heading
    );


  try {

    const data =
      await api(
        config.action
      );


    if (
      key === "inspo"
    ) {

      return renderMedia(
        data
      );

    }


    app.innerHTML = `

      <div class="hero">

        <p class="eyebrow">
          IMAN & DANIAL
        </p>

        <h2>
          ${config.heading}
        </h2>

        <p>
          ${config.description}
        </p>

      </div>


      ${renderTable(data)}

    `;

  }

  catch (error) {

    app.innerHTML =
      errorPage(error);

  }

}


function renderMedia(data) {

  const rows =
    data.rows || [];


  if (!rows.length) {

    app.innerHTML = `

      <div class="hero">

        <p class="eyebrow">
          IMAN & DANIAL
        </p>

        <h2>
          🎨 Inspiration Vault
        </h2>

        <p>
          Add a <strong>Media</strong>
          sheet to Google Sheets with
          Drive file references to
          populate this section.
        </p>

      </div>


      <div class="card empty">

        No media references yet.

      </div>

    `;

    return;

  }


  const titleKey =
    (data.headers || [])
      .find(
        h =>
          /title|name/i.test(h)
      );


  const linkKey =
    (data.headers || [])
      .find(
        h =>
          /link|url/i.test(h)
      );


  const typeKey =
    (data.headers || [])
      .find(
        h =>
          /type|category/i.test(h)
      );


  app.innerHTML = `

    <div class="section">

      <div class="section-title">

        <h3>
          🎨 Inspiration Vault
        </h3>

        <span class="small">
          ${rows.length}
          media reference
          ${rows.length === 1 ? "" : "s"}
        </span>

      </div>


      <div class="media-grid">

        ${rows
          .map(
            row => `

              <div class="media-card">

                <div class="media-placeholder">
                  ♡
                </div>

                <div>

                  <strong>
                    ${escapeHtml(
                      row[titleKey] ||
                      row[typeKey] ||
                      "Wedding inspiration"
                    )}
                  </strong>

                  <br>

                  <span class="small">

                    ${
                      linkKey &&
                      isUrl(
                        row[linkKey]
                      )

                        ? `
                          <a
                            href="${escapeHtml(
                              row[linkKey]
                            )}"
                            target="_blank"
                            rel="noopener"
                          >
                            Open in Google Drive
                          </a>
                        `

                        : escapeHtml(
                            row[typeKey] ||
                            "Media"
                          )
                    }

                  </span>

                </div>

              </div>

            `
          )
          .join("")
        }

      </div>

    </div>

  `;

}


function showPage(key) {

  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      button =>
        button.classList.toggle(
          "active",
          button.dataset.page === key
        )
    );


  document
    .getElementById(
      "sidebar"
    )
    .classList.remove(
      "open"
    );


  pageTitle.textContent =
    key === "dashboard"
      ? "Dashboard"
      : (
          pageConfig[key]?.title ||
          "Dashboard"
        );


  if (
    key === "dashboard"
  ) {

    renderDashboard();

  }

  else {

    renderDataPage(
      key
    );

  }

}


document
  .querySelectorAll(
    ".nav-item"
  )
  .forEach(
    button =>
      button.addEventListener(
        "click",
        () =>
          showPage(
            button.dataset.page
          )
      )
  );


document
  .getElementById(
    "mobileMenu"
  )
  .addEventListener(
    "click",
    () =>
      document
        .getElementById(
          "sidebar"
        )
        .classList.toggle(
          "open"
        )
  );


showPage(
  "dashboard"
);
