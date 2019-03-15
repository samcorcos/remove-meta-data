'use strict'

const Busboy = require('busboy')

/**
 * Get Content-Type from `event`
 */
const getContentType = (event) => {
  const contentType = event.headers['content-type']
  if (!contentType) {
    return event.headers['Content-Type']
  }
  return contentType
}

/**
 * Parsing the multipart requests to get the attached file using Busboy
 * Busboy is a Node js module for parsing incoming HTML form data.
 */
const parser = (event) => new Promise((resolve, reject) => {
  // initialize the busboy instance and pass the content type to its constructor
  const busboy = new Busboy({
    headers: {
      'content-type': getContentType(event)
    }
  })

  // result
  const result = {}

  // event listener of busboy instance, which will fire once any file is found in event.body.
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    // file is stream, get the entire file data from `data` listener
    file.on('data', (data) => {
      result.file = data
    })

    // grab filename and mime type at the end
    file.on('end', () => {
      result.filename = filename
      result.contentType = mimetype
    })
  })

  // grab fields from multipart form data
  busboy.on('field', (fieldname, value) => {
    result[fieldname] = value
  })

  // if something goes wrong, reject the promise.
  busboy.on('error', (error) => reject(`Parse error: ${error}`))
  // resolve a promise with the `event` object by rewriting its body with the result object, which contains files and fields.
  busboy.on('finish', () => {
    event.body = result
    resolve(event)
  })

  /** pass event.body to busboy, in order to parse it.
     * As a second argument we pass encoding, if you are using API Gateway Proxy Integration
     * you may have a param isBase64Encoded with tells integration request to encode the body with base64,
     * if it is set to false, we just set encoding to binary.
     */
  busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary')
  busboy.end()
})

module.exports = {
  parser
}
