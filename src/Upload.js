import React, { Component } from "react"

import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from 'react-fine-uploader'

const uploader = new FineUploaderTraditional({
    options: {
        chunking: {
            enabled: true
        },
        deleteFile: {
            enabled: true,
            endpoint: '/uploads'
        },
        request: {
            endpoint: '/uploads'
        },
        retry: {
            enableAuto: true
        }
    }
})

class Upload extends Component {
  render() {
    return (
      <div>
        <h2>Upload?</h2>
        <Gallery uploader={ uploader } />
      </div>
    );
  }
}

export default Upload;
