import {generateTemplateName} from './utils';

const writingFile = (content, name) => {
  if (!content) {
    throw new Error('no content was passed into writingFile method');
  }
  
  const fileName = generateTemplateName(name);

  try {
    writeHTML(fileName, content);
  } catch (err) {
    //console.log(err);
    //console.log(content);
  }
};

export { writingFile };
