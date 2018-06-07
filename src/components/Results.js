import React from "react";

const Results = (props) => {
  console.log(props)
  return (
    <div className="resultsContainer">
      <h6>Here are your top matches</h6>
      <div>{props.results}</div>
    </div>
  )
}

export default Results;
