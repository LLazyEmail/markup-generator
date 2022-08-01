import { generateTemplateName, writeHTML,  } from './utils';

const writingFile = (content, name = 'prefix') => {
  if (!content) {
    throw new Error('no content was passed into writingFile method');
  }

  const fileName = generateTemplateName(name);

  try {
    writeHTML(fileName, content);
  } catch (error) {

    catchErrorTraceOutput(error);    
  }
};

export default writingFile;
