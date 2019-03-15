const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')
/* Instance of Exiftool can be executable as a process on system */
const ep = new exiftool.ExiftoolProcess(exiftoolBin)

/**
 * Removing meta data from a PDF file using `node-exiftool`
 * @param path - Path of the PDF file to be meta data removed
 */
const removeMeta = async (path) => new Promise(async (resolve, reject) => {
  /* check if the exiftool was already opened and close if yes */
  if (ep.isOpen) {
    console.info('Exiftool was already opened. closing...')
    await ep.close()
    console.info('Closed.')
  }

  try {
    /* opening the exiftool */
    console.info('Opening Exiftool...')
    await ep.open()
    console.info('Removing metadata...')
    /* overwrite the current meta data with empty string (Removing meta data) */
    await ep.writeMetadata(path, { all: '' }, ['overwrite_original'])
    console.info('Meta data removed.')
    /* close the exiftool process */
    await ep.close()
    console.info('Exiftool closed.')
    /* Resolve */
    resolve()
  } catch (err) {
    console.error('Something wrong with Exiftool.\n', err)
    reject(err)
  }
})

module.exports = {
  removeMeta
}
