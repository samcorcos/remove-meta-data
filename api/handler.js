'use strict';

require('pdftk-lambda')

const fs = require('fs')
const pdftk = require('node-pdftk');
const { multiFormParser, removeMeta } = require('./helpers')

/**
 * Removing the metadata from PDF file (attached in the multipart/form-data) from 
 * the request and send it back to client as Base64 encoded content
 */
module.exports.removeMetaData = async (event) => {
  
  try {
    /* Extracting File from the multipart form */
    const body = await multiFormParser(event.body, event.headers)
    
    const path = `./${body.name}` /* A temporary path on disk to save the PDF file to remove meta data */
    fs.writeFileSync(path, body.buffer, 'binary') /* Saving the content as PDF */
    await removeMeta(path) /* Removing meta data from the saved PDF */

    /* Flattening the PDF file to make it irreversible and getting the content as buffer  */
    const buffer = await pdftk.input(path).flatten().output()
    fs.unlinkSync(path) /* Removing the PDF file on disk finally */

    /* Sending the PDF file in Base64 encoded format */
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename=' + body.name
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    }
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to remove meta data from the file',
        err: err
      }),
    }
  }
};