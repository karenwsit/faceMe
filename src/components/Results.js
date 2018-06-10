import React from "react"
import "./Results.css"

const Results = (props) => {
  console.log(props.results)
  const originalUpload = props.results.pop()
  const results = props.results

  return (
    <div className="resultsContainer">
      <div className="uploadContainer">
        <h2>Your Upload</h2>
        <img src={originalUpload} alt='original upload' />
      </div>
      <div className="topMatchesContainer">
        <h2>Your Top Matches</h2>
        <div className="topImages">
          { results.map((item) => {
              return (
              <figure>
                <img className="result" src={item.image_url} key={item.uid} confidence={item.confidence} alt={item.url} />
                <figcaption>
                  <a href={item.url}>NAME</a>
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
