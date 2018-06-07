import React from "react";

const Results = (props) => {
  console.log(props.results)
  const results = props.results

  return (
    <div className="resultsContainer">
      <h6>Here are your top matches</h6>
      <table>
        <tbody>
          <tr>
            { results.map((item) => {
                return <td className="result" key={item.uid} confidence={item.confidence} url={item.url}>
                  {item.url}
                </td>
              }
            )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Results
