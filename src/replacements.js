const moment = require('moment');

// Replace a single tag.
const tagReplace = (original, tag, value) => {
  const fullTag = `[[${tag}]]`;
  return original.split(fullTag).join(value || '');
};

// Do all in-line replacements needed.
const replacements = function(document, additionalContext) {
    const modified = moment().format('YYYY-MM-DD');

    const context = {
      "COVER": document.metadata.cover,
      "ID": document.metadata.id,
      "TITLE": document.metadata.title,
      "SERIES": document.metadata.series,
      "SEQUENCE": document.metadata.sequence,
      "COPYRIGHT": document.metadata.copyright,
      "LANGUAGE": document.metadata.language,
      "FILEAS": document.metadata.fileAs,
      "AUTHOR": document.metadata.author,
      "PUBLISHER": document.metadata.publisher,
      "DESCRIPTION": document.metadata.description,
      "PUBLISHED": document.metadata.published,
      "GENRE": document.metadata.genre,
      "TAGS": document.metadata.tags,
      "CONTENTS": document.metadata.contents,
      "SOURCE": document.metadata.source,
      "MODIFIED": modified,
    };

    return {
      ...context,
      ...additionalContext
    };
};

module.exports = replacements;
