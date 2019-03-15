'use strict';

require('pdftk-lambda')

const fs = require('fs')
const pdftk = require('node-pdftk');
const { removeMeta } = require('./remove-meta')
const { parser } = require('./parser')

/**
 * Removing the metadata from PDF file (attached in the multipart/form-data) from 
 * the request and send it back to client as Base64 encoded content
 */
module.exports.removeMetaData = async (event) => {
  
  try {
    /* Parsing multi form data */
    const { body } = await parser(event)

    /* A temporary path on disk to save the PDF file to remove meta data */
    const path = process.env.NODE_ENV === 'development' ? `./${body.filename}` : `/tmp/${body.filename}`
    
    /* Saving the content as PDF */
    console.info('Saving PDF file in temp...')
    fs.writeFileSync(path, body.file)
    
    /* Removing meta data from the saved PDF */
    console.info('Starting to remove meta data...')
    await removeMeta(path)

    /* Flattening the PDF file to make it irreversible and getting the content as buffer  */
    console.info('Flattening the PDF...')
    const buffer = await pdftk.input(path).flatten().output()

    /* Removing the PDF file on disk finally */
    console.info('Finished flattening. Removing the PDF file from temp.')
    fs.unlinkSync(path)

    /* Sending the PDF file in Base64 encoded format */
    console.info('Done.')
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename=' + body.filename
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