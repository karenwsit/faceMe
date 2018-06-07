import React from "react";

const Results = (props) => {
  console.log(props.results)
  const originalUpload = props.results.pop()
  const results = props.results

  return (
    <div className="resultsContainer">
      <table>
        <tbody>
          <tr>
            <div>Your Upload</div>
            <img src={originalUpload} alt='original upload' />
            { results.map((item) => {
                return <img className="result" src={item.image_url} key={item.uid} confidence={item.confidence} alt={item.url}>
                </img>
              }
            )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Results
