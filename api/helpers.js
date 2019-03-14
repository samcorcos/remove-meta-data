const Busboy = require('busboy');
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')

/**
 * Parsing the multipart/form-data in Request to get the attached file using Busboy
 * @param body - Body of Http Request
 * @param headers - Headers of Http Request
 * @returns
 * Promise of object which contains
 * `buffer`(File Content as Buffer)
 * `name`(File Name)
 */
const multiFormParser = (body, headers) => new Promise((resolve, reject) => {

    /* Getting Content-Type, Content-Length from the headers */
    const contentType = headers['Content-Type'] || headers['content-type'];
    const contentLength = headers['Content-Length'] || headers['content-length'];

    /* Creating a Busboy instanace with the headers from request */
    const bb = new Busboy({
        headers: {
            'content-type': contentType,
            'content-length': contentLength,
        }
    })

    /* Result */
    const data = {
        buffer: '',
        name: ''
    }

    /* Busboy event triggered when it founds a file inside body */
    bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
        data.name = filename // File Name to be returned
        
        /* `file` is Nodejs Readable Stream and adding the chunks to get whole file content in buffer */
        file.on('data', (chunk) => {
            data.buffer += chunk
        })
    })

    /* Reject on error */
    bb.on('error', err => reject(err))
    /* Resolve on finish */
    bb.on('finish', () => resolve(data))
    /* Starting to parse body(multipart/form-data) */
    bb.end(body);
})

/**
 * Removing meta data from a PDF file using `node-exiftool`
 * @param path - Path of the PDF file to be meta data removed
 */
const removeMeta = (path) => new Promise((resolve, reject) => {
    /* Instance of Exiftool can be executable as a process on system */
    const ep = new exiftool.ExiftoolProcess(exiftoolBin)
    
    ep.open()
        /* Overwrite the current meta data with empty string (Removing meta data) */
        .then(() => ep.writeMetadata(path, { all: '' }, ['overwrite_original']))
        /* Reject on error */
        .then((_, err) => {
            if (err) {
                reject(err)
            }
        })
        .then(() => {
            ep.close()
            resolve()
        })
        .catch(err => {
            reject(err)
        })
})

module.exports = {
    multiFormParser,
    removeMeta
}