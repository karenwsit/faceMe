import React, { Component } from "react"

import FineUploaderS3 from 'fine-uploader-wrappers/s3'
import Gallery from 'react-fine-uploader'
import 'react-fine-uploader/gallery/gallery.css'

const uploader = new FineUploaderS3({
    options: {
        request: {
            endpoint: 'http://fineuploadertest.s3.amazonaws.com',
            accessKey: process.env.S3_PUBLIC_ACCESS_KEY
        },
        signature: {
            endpoint: "/upload"
        }
    }
})

// const queuedFileStatus = uploader.qq.status.QUEUED

// const uploader = new qq.s3.FineUploader({
//     options: {
//         chunking: {
//             enabled: true
//         },
//         deleteFile: {
//             enabled: true,
//             endpoint: '/upload'
//         },
//         request: {
//             endpoint: 'uploadedphotostomatch.s3.amazonaws.com',
//             accessKey: process.env.S3_PUBLIC_ACCESS_KEY
//         },
//         retry: {
//             enableAuto: true
//         },
//         signature: {
//           endpoint: '/s3/signature'
//         },
//         uploadSuccess: {
//           endpoint: '/s3/success'
//         },
//         validation: {
//           allowedExtensions: ['gif', 'jpeg', 'jpg', 'png'],
//           acceptFiles: 'image/gif, image/jpeg, impage/png',
//           sizeLimit: 5000000,
//           itemLimit: 1
//         }
//     }
// })

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
