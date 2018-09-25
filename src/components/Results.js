import React from "react"
import "./Results.css"

const Results = (props) => {
  const originalUpload = props.results[props.results.length - 1]
  const results = props.results.slice(0,props.results.length)

  return (
    <div className="resultsContainer">
      <div className="uploadContainer">
        <h2>Your Upload</h2>
        <img className="uploadImage" src={originalUpload} alt='original upload' />
      </div>
      <div className="topMatchesContainer">
        <h2>Your Top Matches</h2>
        <div className="topImagesContainer">
          { results.map((item) => {
              return (
              <figure>
                <img className="resultImage" src={item.image_url} key={item.uid} confidence={item.confidence} alt={item.url} />
                <figcaption>
                  <a href={item.url}>{item.title}</a>
                </figcaption>
              </figure>
            )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Results
