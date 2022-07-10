const path = require('path');
const replacements = require('./replacements');
const util = require('./utility.js');
const pug = require('pug');

const pugContainer = pug.compileFile(__dirname + '/templates/container.pug');
const pugContents = pug.compileFile(__dirname + '/templates/contents.pug');
const pugCover = pug.compileFile(__dirname + '/templates/cover.pug');
const pugNcx = pug.compileFile(__dirname + '/templates/ncx.pug');
const pugOpf = pug.compileFile(__dirname + '/templates/opf.pug');
const pugSection = pug.compileFile(__dirname + '/templates/section.pug');

const constituents = {
  // Provide the contents of the mimetype file (which should not be compressed).
  getMimetype: () => 'application/epub+zip',

  // Provide the contents of the container XML file.
  getContainer: (document) => {
    return pugContainer();
  },

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
      coverText = constituents.processTextContent(cover);
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

  // Provide the contents of the NCX file.
  getNCX: (document) => {
    const replacementContext = replacements(document, {
      document
    });

    return pugNcx(replacementContext);
  },

  // Provide the contents of the OPF (spine) file.
  getOPF: (document) => {
    let coverContent;
    let coverFilename;
    if(document.coverType === "image") {
      coverContent = "cover-image";
      coverFilename = path.basename(document.cover);
    } else {
      coverContent = "cover";
    }

    const replacementContext = replacements(document, {
      document,
      coverContent,
      coverFilename,
      path,
      util
    });
    return pugOpf(replacementContext);
  },

  // Provide the contents of a single section's HTML.
  getSection: (document, sectionNumber) => {
    const section = document.sections[sectionNumber - 1];
    const { title: sectionTitle } = section;
    const { content: rawContent } = section;

    content = constituents.processTextContent(rawContent);

    const replacementContext = replacements(document, {
      sectionTitle,
      sectionNumber,
      content
    });
    return pugSection(replacementContext);
  },

  // Provide the contents of the TOC file.
  getTOC: (document) => {
    let callbackContent;
    if(document.generateContentsCallback) {
      callbackContent = document.generateContentsCallback(document.filesForTOC);
    }
    return constituents.getContents(document, callbackContent);
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

module.exports = constituents;
