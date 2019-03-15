import React from 'react'
import Dropzone from 'react-dropzone'
import { saveAs } from 'file-saver'
import axios from 'axios'

const URL = 'https://a5xp5w2m61.execute-api.us-east-1.amazonaws.com/dev/remove-meta-data'
// const URL = 'http://localhost:3100/remove-meta-data'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

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

    this.setState({ loading: true })

    // Sending the content to Server and saving the result to `Downloads` directory of your system
    axios.post(URL, data, { responseType: 'blob' })
      .then(res => {
        this.setState({ loading: false})
        return saveAs(new Blob([res.data]), `${file.name}`)
      })
      .catch(err => {
        this.setState({ loading: false })
      })
  }

  render () {
    return (
      <div className='container'>
        <div className='loading' />
        Drop a file below to remove metadata from your PDF

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
          .container {
            display: flex;
            flex-direction: column;
            flex: 1;
          }
          .loading {
            height: 10px;
            width: ${this.state.loading ? '100' : 0}%;
            opacity: ${this.state.loading ? 1 : 0};
            background-color: red;
            transition: width 10s linear;
          }
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