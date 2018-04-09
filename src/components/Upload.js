import React, { Component } from "react"

import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from 'react-fine-uploader'
import 'react-fine-uploader/gallery/gallery.css'

const uploader = new FineUploaderTraditional({
    options: {
        chunking: {
            enabled: true
        },
        deleteFile: {
            enabled: true,
            endpoint: '/upload'
        },
        request: {
            endpoint: 'uploadedphotostomatch.s3.amazonaws.com',
            accessKey: process.env.S3_PUBLIC_ACCESS_KEY
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
        <h2>Upload your photo here to start match</h2>
        <Gallery uploader={ uploader } />
      </div>
    );
  }
}

export default Upload;
