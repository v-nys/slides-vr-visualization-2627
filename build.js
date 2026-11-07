const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const root = __dirname;
const output = path.join(root, 'dist');
const revealUrl = 'reveal.js';
const numberingRegex = /\d+ *- */;
const excludedDirectories = new Set(['node_modules', 'voorbeeldslides', 'dist']);

function ensureDirectory(directory) {
    fs.mkdirSync(directory, { recursive: true });
}

function copyDirectory(source, destination) {
    fs.cpSync(source, destination, { recursive: true });
}

function getPresentations() {
    return fs.readdirSync(root, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .filter(name => !name.startsWith('.') && !excludedDirectories.has(name))
        .filter(name => fs.existsSync(path.join(root, name, 'index.md')))
        .sort();
}

function getPresentationImage(presentation) {
    return fs.existsSync(path.join(root, presentation, 'onderwerp.png'))
        ? 'onderwerp.png'
        : '../fallback-onderwerp.png';
}

fs.rmSync(output, { recursive: true, force: true });
ensureDirectory(output);

// Static assets used by the templates and presentations.
for (const asset of ['style.css', 'favicon.ico', 'logo.svg', 'fallback-onderwerp.png']) {
    fs.copyFileSync(path.join(root, asset), path.join(output, asset));
}
copyDirectory(path.join(root, 'node_modules', 'reveal.js'), path.join(output, 'reveal.js'));
copyDirectory(
    path.join(root, 'node_modules', 'reveal.js-mermaid-plugin'),
    path.join(output, 'reveal.js-mermaid-plugin')
);

const presentations = getPresentations();
const presentationsWithImage = presentations.map(presentation => ({
    presentation,
    presentationImage: getPresentationImage(presentation),
    presentationName: presentation.replace(numberingRegex, '')
}));

const overview = ejs.render(
    fs.readFileSync(path.join(root, 'overview.ejs'), 'utf8'),
    { presentationsWithImage: presentationsWithImage.map(item => ({
        ...item,
        presentationImage: item.presentationImage.replace('../', ''),
        presentation: item.presentation
    })) }
).replaceAll('href="/', 'href="./').replaceAll('src="/', 'src="./').replaceAll('../reveal.js/', `${revealUrl}/`);
fs.writeFileSync(path.join(output, 'index.html'), overview);

for (const presentation of presentations) {
    const destination = path.join(output, presentation);
    ensureDirectory(destination);

    const html = ejs.render(
        fs.readFileSync(path.join(root, 'presentation.ejs'), 'utf8'),
        {
            markdownContent: fs.readFileSync(path.join(root, presentation, 'index.md'), 'utf8'),
            folderName: presentation
        }
    ).replaceAll('../reveal.js/', `../${revealUrl}/`)
     .replaceAll("./node_modules/reveal.js-mermaid-plugin/", '../reveal.js-mermaid-plugin/');
    fs.writeFileSync(path.join(destination, 'index.html'), html);

    // Preserve images and any other presentation-specific assets.
    for (const entry of fs.readdirSync(path.join(root, presentation), { withFileTypes: true })) {
        if (entry.name === 'index.md' || entry.name === 'index.html') continue;
        const source = path.join(root, presentation, entry.name);
        const target = path.join(destination, entry.name);
        entry.isDirectory() ? copyDirectory(source, target) : fs.copyFileSync(source, target);
    }
}

console.log(`Built ${presentations.length} presentations in ${output}`);
