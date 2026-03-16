function generateNavigation() {
  const mainNav = $("#mainNavLinks");
  const sidebarNav = $("#sidebarNavLinks");

  // Clear existing navigation
  mainNav.empty();
  sidebarNav.empty();

  // Add static navigation items
  mainNav.append(`
        <li class="nav-item"><a class="nav-link" href="#authentication">Authentication</a></li>
        <li class="nav-item"><a class="nav-link" href="#base-url">Base URL</a></li>
    `);

  // Generate dynamic navigation from config
  apiConfig.sections.forEach((section) => {
    if (section.showInNav) {
      const navItem = `
                <li class="nav-item">
                    <a class="nav-link" href="#${section.id}">${section.title}</a>
                </li>
            `;
      sidebarNav.append(navItem);
    }
  });
}

function generateContent() {
  const mainContent = $("#mainContent");

  apiConfig.sections.forEach((section) => {
    let html = `<section id="${section.id}" class="mb-5"><h2>${section.title}</h2>`;

    switch (section.type) {
      case "simple":
        html += generateSimpleSection(section);
        break;
      case "endpoints":
        html += generateEndpointsSection(section);
        break;
      case "notice":
        html += generateNoticeSection(section);
        break;
      case "errors":
        html += generateErrorsSection(section);
        break;
      case "code-sample":
        html += generateCodeSampleSection(section);
        break;
      case "faq":
        html += generateFAQSection(section);
        break;

      // 👇 NEW SECTION TYPES
      case "auth-flow":
        html += generateAuthFlowSection(section);
        break;
      case "markdown":
        html += generateMarkdownSection(section);
        break;
      case "changelog":
        html += generateChangelogSection(section);
        break;
      case "grouped-endpoints":
        html += generateGroupedEndpointsSection(section);
        break;
      case "text-html":
        html += generateTextHtmlSection(section);
        break;
      case "embed":
        html += generateEmbedSection(section);
        break;

      default:
        html += `<div class="alert alert-danger">Unknown section type: ${section.type}</div>`;
    }

    html += `</section>`;
    mainContent.append(html);
  });
}

function generateSimpleSection(section) {
  if (typeof section.content === "string") {
    return `<div class="card"><div class="card-body"><code>${section.content}</code></div></div>`;
  }
  return `
        <div class="card">
            <div class="card-body">
                <p>${section.content.description}</p>
                <pre>${section.content.example}</pre>
                ${
                  section.content.note
                    ? `<p class="text-muted">Note: ${section.content.note}</p>`
                    : ""
                }
            </div>
        </div>
    `;
}

function generateEndpointsSection(section) {
  return section.endpoints
    .map((endpoint) => {
      const methodClass = `method-${endpoint.method.toLowerCase()}`;
      return `
            <div class="card endpoint-card ${methodClass}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><strong>${endpoint.method}</strong> ${
        endpoint.path
      }</span>
                    ${
                      endpoint.requiresAuth
                        ? '<span class="badge bg-success">Requires Auth</span>'
                        : ""
                    }
                </div>
                <div class="card-body">
                    <h5 class="card-title">${endpoint.title}</h5>
                    <p class="card-text">${endpoint.description}</p>

                    ${
                      endpoint.headers
                        ? `
                        <h6>Headers:</h6>
                        <table class="table table-sm">
                            <thead><tr><th>Header</th><th>Value</th></tr></thead>
                            <tbody>
                                ${Object.entries(endpoint.headers)
                                  .map(
                                    ([key, val]) => `
                                    <tr><td>${key}</td><td>${val}</td></tr>
                                `
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    `
                        : ""
                    }

                    ${
                      endpoint.requestBody
                        ? `
                        <h6>Request Body:</h6>
                        <pre>${JSON.stringify(
                          endpoint.requestBody,
                          null,
                          2
                        )}</pre>
                    `
                        : ""
                    }

                    ${
                      endpoint.parameters
                        ? `
                        <h6>Parameters:</h6>
                        <table class="table table-sm">
                            <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
                            <tbody>
                                ${endpoint.parameters
                                  .map(
                                    (p) => `
                                    <tr><td>${p.name}</td><td>${p.type}</td><td>${p.description}</td></tr>
                                `
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    `
                        : ""
                    }

                    ${
                      endpoint.response
                        ? `
                        <h6>Example Response:</h6>
                        <pre>${JSON.stringify(endpoint.response, null, 2)}</pre>
                    `
                        : ""
                    }
                </div>
            </div>
        `;
    })
    .join("");
}

function generateNoticeSection(section) {
  return `<div class="alert alert-info">${section.content}</div>`;
}

function generateErrorsSection(section) {
  return `
        <div class="card">
            <div class="card-body">
                ${section.errors
                  .map(
                    (error) => `
                    <h6 class="mt-3">${error.code} - ${error.title}</h6>
                    <pre>${JSON.stringify(error.example, null, 2)}</pre>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;
}
function generateCodeSampleSection(section) {
  return `
        <div class="card">
            <div class="card-body">
                <h6>Request Example:</h6>
                <pre>${JSON.stringify(section.request, null, 2)}</pre>
                <h6>Response Example:</h6>
                <pre>${JSON.stringify(section.response, null, 2)}</pre>
            </div>
        </div>
    `;
}
function generateFAQSection(section) {
  return `
        <div class="accordion" id="faqAccordion-${section.id}">
            ${section.questions
              .map(
                (q, i) => `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${i}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}">
                            ${q.question}
                        </button>
                    </h2>
                    <div id="collapse${i}" class="accordion-collapse collapse" data-bs-parent="#faqAccordion-${section.id}">
                        <div class="accordion-body">
                            ${q.answer}
                        </div>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
}

function generateAuthFlowSection(section) {
  return section.steps
    .map(
      (step, i) => `
        <div class="mb-3">
            <h6>Step ${i + 1}: ${step.title}</h6>
            <p>${step.description}</p>
            ${
              step.code
                ? `<pre>${JSON.stringify(step.code, null, 2)}</pre>`
                : ""
            }
        </div>
    `
    )
    .join("");
}
function generateMarkdownSection(section) {
  return `<div class="markdown-body">${marked.parse(section.content)}</div>`;
}

function generateChangelogSection(section) {
  return section.versions
    .map(
      (ver) => `
        <div class="mb-3">
            <h5>Version ${ver.version}</h5>
            <ul>${ver.changes
              .map((change) => `<li>${change}</li>`)
              .join("")}</ul>
        </div>
    `
    )
    .join("");
}

function generateGroupedEndpointsSection(section) {
  return section.groups
    .map(
      (group) => `
        <div class="mb-4">
            <h4>${group.groupTitle}</h4>
            ${generateEndpointsSection({ endpoints: group.endpoints })}
        </div>
    `
    )
    .join("");
}
function generateTextHtmlSection(section) {
  return section.html;
}
function generateEmbedSection(section) {
  return `<div class="ratio ratio-16x9"><iframe src="${section.url}" allowfullscreen></iframe></div>`;
}
