import React, { Component } from "react"

import FineUploaderS3 from 'fine-uploader-wrappers/s3'
import Gallery from 'react-fine-uploader'
import 'react-fine-uploader/gallery/gallery.css'
import Results from './Results'

const uploader = new FineUploaderS3({
    options: {
        request: {
            endpoint: 'uploadedphotostomatch.s3.amazonaws.com',
            accessKey: process.env.REACT_APP_AWS_ACCESS_KEY_ID
        },
        validation: {
          allowedExtensions: ["gif", "jpeg", "jpg", "png"],
          acceptFiles: "image/gif, image/jpeg, image/png",
          minSizeLimit: 0,
          sizeLimit: 5000000,
          itemLimit: 1
        },
        signature: {
            endpoint: "/s3handler"
        },
        uploadSuccess: {
          endpoint: "/s3handler/success"
        }
    }
})

const transformToArray = (results) => {
  let newResults = []
  for (const key in results) {
    if (key !== 'success') {
      newResults.push(results[key])
    }
  }
  return newResults
}

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {results: []}
  }

  componentDidMount() {
    uploader.on('complete', (id, name, response) => {
       if (response) {
         const results = transformToArray(response)
         this.setState({results})
       }
    })
  }

  render() {
    const resultsReceived = this.state.results.length !== 0
    return (
      <div>

        { resultsReceived
            ? (<div>
                <h2>Here are your top matches</h2>
                <Results results={ this.state.results }/>
              </div>)
            : (<div>
                <h2>Upload your photo here to start match</h2>
                <Gallery uploader={ uploader } />
              </div>)
        }
      </div>
    );
  }
}

export default Upload
