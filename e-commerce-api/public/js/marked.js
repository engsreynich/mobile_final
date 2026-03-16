function generateMarkdownSection(section) {
    return `<div class="markdown-body">${marked.parse(section.content)}</div>`;
}
