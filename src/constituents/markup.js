const path = require('path');
const replacements = require('./replacements');
const pug = require('pug');

const pugContents = pug.compileFile(__dirname + '/templates/contents.pug');
const pugCover = pug.compileFile(__dirname + '/templates/cover.pug');
const pugSection = pug.compileFile(__dirname + '/templates/section.pug');

const markup = {

  // Provide the contents page.
  getContents: (document, overrideContents) => {
    const {
      sections
    } = document;

    const replacementContext = replacements(document, {
      overrideContents,
      sections
    });
    return pugContents(replacementContext);
  },

  // Provide the contents of the TOC file.
  getTOC: (document) => {
    let callbackContent;
    if(document.generateContentsCallback) {
      callbackContent = document.generateContentsCallback(document.filesForTOC);
    }
    return markup.getContents(document, callbackContent);
  },

  // Provide the contents of the cover HTML enclosure.
  getCover: (document) => {
    const {
      coverType,
      cover
    } = document;

    let coverFilename;
    if(coverType === "image") {
      coverFilename = path.basename(cover);
    }

    let coverText;
    if(coverType === "text") {
      coverText = markup.processTextContent(cover);
    }

    const replacementContext = replacements(document, {
      coverType,
      coverFilename,
      coverText
    });
    return pugCover(replacementContext);
  },

  // Provide the contents of the CSS file.
  getCSS: (document) => document.CSS,

  // Provide the contents of a single section's HTML.
  getSection: (document, sectionNumber) => {
    const section = document.sections[sectionNumber - 1];
    const { title: sectionTitle } = section;
    const { content: rawContent } = section;

    content = markup.processTextContent(rawContent);

    const replacementContext = replacements(document, {
      sectionTitle,
      sectionNumber,
      content
    });
    return pugSection(replacementContext);
  },

  processTextContent: (content) => {
    let result = '';

    const lines = content.split('\n');
    lines.forEach((line) => {
      if (line.length > 0) {
        result += `${line}\n`;
      }
    });

    return result;
  }

};

module.exports = markup;
