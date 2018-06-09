import React from "react";

const Results = (props) => {
  console.log(props.results)
  const originalUpload = props.results.pop()
  const results = props.results

  return (
    <div className="resultsContainer">
      <div className="uploadContainer">
        <img src={originalUpload} alt='original upload' />
      </div>
      <div className="topMatchesContainer">
        { results.map((item) => {
            return <img className="result" src={item.image_url} key={item.uid} confidence={item.confidence} alt={item.url}>
            </img>
          }
        )}
      </div>
    </div>
  )
}

export default Results
