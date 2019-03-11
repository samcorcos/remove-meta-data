'use strict';

/**

  NOTE This is how I do it locally. Keep in mind that after you remove the metadata
  (which is what exiftool is doing), you also have to flatten it because metadata
  tags are reversible (which is what qpdf is doing).

  const shell = require('shelljs')
  const file = process.argv[2]

  // This works by removing the data, then flattening the PDF to make the changes
  // irreversible (otherwise, tags are reversible)

  shell.exec(`exiftool -all:all= ${file}`)
  shell.exec(`qpdf ${file} _${file}`)

 */

module.exports.removeMetaData = async (event, context) => {
  // TODO do some processing here
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
