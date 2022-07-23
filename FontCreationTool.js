/* 
 * HOW TO BUILD:
 *   1) Install Node.js from https://nodejs.org/
 *   2) Build using: npm install opentype.js prompts pkg; npx pkg FontCreationTool.js
 */

const opentype = require("opentype.js");
const prompts = require("prompts");
const fs = require("fs");
const path = require("path");

let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz`1234567890-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?".split('');
let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const digits = "0123456789".split('');
let validChars = [...uppercase, ' ', ...(uppercase.map(x=>x.toLowerCase())), ...digits, '_', '-'];

function checkFontPath(fontPath) {
    return fs.existsSync(fontPath)
        && (path.extname(fontPath) === ".ttf"
            || path.extname(fontPath) === ".otf");
}

async function getFont() {
    const fontName = (await prompts({
        type: "text",
        name: "fontName",
        message: "Enter the name of the font file you wish to create a font out of (e.g. 'Roboto-Regular.ttf'): ",
        validate: (fontPath) => checkFontPath(fontPath) ?
            true :
            "The file must be a .ttf or .otf file and be in the same folder as this program."
    })).fontName;

    let font = opentype.loadSync(fontName)
    font.name = path.parse(fontName).name;
    font.path = `${font.name}-Font-Data/`;
    return font;
};

function createCostumes(font) {
    const svgBoilerplate = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="480" height="360" viewBox="0 0 480 360"><rect fill-opacity="0" width="200" height="200" x="140" y="80" />`;

    fs.rmSync(font.path, { recursive: true, force: true });
    fs.mkdirSync(font.path);
    fs.mkdirSync(`${font.path}uppercase-costumes`)
    fs.mkdirSync(`${font.path}all-other-costumes`)

    for (let char in chars) {
        const path = font.getPath(chars[char], 240, 180, 100);
        path.fill = 'red';
        fs.writeFileSync(
            `${font.path}${uppercase.includes(chars[char]) ? "uppercase-costumes/" : "all-other-costumes/"}`
                + `${validChars.includes(chars[char]) ? chars[char] : char}.svg`,
            `${svgBoilerplate}${path.toSVG()}</svg>`
        );
    }
}

function createKerning(font) {
    let buffer = "";

    for (let i of chars) {
        for (let j of chars) {
            const leftGlyph = font.charToGlyph(i);
            const rightGlyph = font.charToGlyph(j);
    
            buffer += `${font.getAdvanceWidth(i, 1) + font.getKerningValue(leftGlyph, rightGlyph)/font.unitsPerEm}\n`;
        }
    }

    fs.writeFileSync(`${font.path}kerning.txt`, buffer);
}

async function askToCreateCostumes() {
    const response = (await prompts({
        type: "text",
        name: "response",
        message: "Generate costumes? (Y/N): "
    })).response.toLowerCase().charAt(0);

    return response == "y" || response == "";
}

async function askToCreateKerning(font) {
    if (!fs.existsSync(font.path))
        fs.mkdirSync(font.path);

    const response = (await prompts({
        type: "text",
        name: "response",
        message: "Generate kerning data? (Y/N): "
    })).response.toLowerCase().charAt(0);

    return response == "y" || response == "";
}

async function askForCharset() {
    const response1 = (await prompts({
        type: "text",
        name: "response1",
        message: "Enter a custom charset? (N/Y): "
    })).response1.toLowerCase().charAt(0);

    if (response1 == "y") {
        uppercase = (await prompts({
            type: "text",
            name: "response2",
            message: "Enter all lowercase letters: "
        })).response2.toUpperCase().split('');

        chars = [...uppercase, ...uppercase.map(x=>x.toLowerCase()), ...(await prompts({
            type: "text",
            name: "response3",
            message: "Enter the rest of the charset, excluding any letters, numbers first: "
        })).response3.split('')];

        validChars = [...uppercase, ' ', ...(uppercase.map(x=>x.toLowerCase())), ...digits, '_', '-'];

    }
}

(async function run() {
    try {
        console.clear();
        console.log("\nWelcome to NTPrograms' font creation tool for Scratch!\n");
        
        const font = await getFont();

        await askForCharset();
        
        if (await askToCreateCostumes())
            createCostumes(font);

        if (await askToCreateKerning(font))
            createKerning(font);

        console.clear();

        console.log(`\n\nSome things to keep in mind:
  • Your charset is:

  ${chars.reduce((a,b)=>a+b)}

  • Ensure that your costumes correctly match the order of
    your charset.
  • Import the costumes from the uppercase-costumes first.
  • Consider sorting by 'date modified' when importing
    costumes.
  • You're going to have to rename the costumes of all
    non-alphanumeric characters.
  • The kerning list stores how much each character has to
    move by based on the character before it, so there are
    a total of n*n combinations for each of the possible
    n*n character combination pairs
  • You can access the kerning/width values by using this
    algorithm: 

    (item ((previousChar-1)*n+currentChar) of kerning)*size

    where n is the length of the charset, previousChar
    and currentChar are the costume numbers of the previous
    and current character, and size is the size of the 
    text. Note that you would have to adjust these values
    if the costumes don't start from the beginning.`);

    } catch (err) {
        console.log(err)
        console.log("\n\nSomething went wrong. Please try again.");
    }
})();
