/* eslint-disable no-plusplus */
const path = require('path');
const replacements = require('./replacements');
const util = require('../utility.js');
const pug = require('pug');

const pugContainer = pug.compileFile(__dirname + '/templates/container.pug');
const pugPackage = pug.compileFile(__dirname + '/templates/package.pug');
const pugNcx = pug.compileFile(__dirname + '/templates/ncx.pug');

const structural = {

  // Provide the contents of the mimetype file (which should not be compressed).
  getMimetype: () => 'application/epub+zip',

  // Provide the contents of the container XML file.
  getContainer: (document) => {
    return pugContainer();
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
    return pugPackage(replacementContext);
  },

  // Provide the contents of the NCX file.
  getNCX: (document) => {
    const replacementContext = replacements(document, {
      document
    });

    return pugNcx(replacementContext);
  },

};

module.exports = structural;
