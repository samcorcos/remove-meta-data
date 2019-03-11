import React from 'react'
import Dropzone from 'react-dropzone'
import fetch from 'isomorphic-unfetch'

export default class App extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    // fetch the processing endpoint, automatically download the file
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