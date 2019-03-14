import React from 'react'
import Dropzone from 'react-dropzone'
import { saveAs } from 'file-saver'
import axios from 'axios'

const URL = 'http://localhost:3100/remove-meta-data'

export default class App extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    
    // fetch the processing endpoint, automatically download the file
    if (!acceptedFiles.length) {
      return
    }

    // Generating a form data with the uploaded file
    const file = acceptedFiles[0]
    const data = new FormData()
    data.append('file', file)
    data.append('size', file.size)

    // Sending the content to Server and saving the result to `Downloads` directory of your system
    axios.post(URL, data, { responseType: 'blob' })
      .then(res => saveAs(res.data, `./${file.name}`))
  }

  render () {
    return (
      <div>
        Foobnar?

        <Dropzone onDrop={this.onDrop}>
          {({getRootProps, getInputProps, isDragActive}) => {
            const inputProps = getInputProps()
            const rootProps = getRootProps()
            return (
              <div
                {...rootProps}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
              >
                <input {...inputProps} />
                {
                  isDragActive ?
                    <p>Drop files here...</p> :
                    <p>Try dropping some files here, or click to select files to upload.</p>
                }
              </div>
            )
          }}
        </Dropzone>
        
        <style jsx>{`
          .dropzone {
            transition: all 0.3s ease;
            height: 300px;
            width: 400px;
            background-color: #CCCCCC;
            border: 2px dashed black;
          } 
          .active {
            opacity: 0.6;
          } 
        `}</style>
      </div>
    )
  }
}