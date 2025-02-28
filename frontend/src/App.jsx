import { useState } from 'react'
import axios from "axios"
import './App.css'
import Papa from "papaparse"

function App() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileCreated, setFileCreated] = useState(false)
  const [gotComments, setComments] = useState(false)
  const [tableData, setTableData] = useState([])
  const [showTable, setShowTable] = useState(false)

  const analyse = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFileCreated(false)
    setComments(false)
    
    try {
      const response = await axios.get(`http://127.0.0.1:8000/analyse?url=${url}`)

      if(response.data.error){
        console.log(response.data.error)
      } else if(response.data.file_created){
        console.log("File obtained")

        getFile()
        setLoading(false)
        setFileCreated(true)
      } else {
        checkProgress()
      }

    } catch(err) {
        console.log("An error occured!" + err)
        setLoading(false)
    }
  }

  const checkProgress = async () => {
    setTimeout(async () => {
      try {
        const status = await axios.get("http://127.0.0.1:8000/status")
        if(status.data.file_created) {
          console.log("Sentiment Data obtained")

          getFile()
          setFileCreated(true)
          setLoading(false)
         
        } else if(status.data.comments_found) {
          setComments(true)
          checkProgress()

        } else if(status.data.error) {
          setLoading(false)
          console.log("An error occured while fetching status")

        } else {
          checkProgress()
        }
      } catch(err) {
        console.log("Error occured: "+err)
        setLoading(false)
      }
    }, 10000)
  }

  const getFile = async() => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/getcsv", {
        responseType: "blob"
      })
      const csvText = await response.data.text();

      Papa.parse(csvText, {
        header: true, 
        skipEmptyLines: true,
        complete: (result) => {
          setTableData(result.data);
        },
      });


    } catch(err) {
      console.log("Failed to fetch csv file: " + err)
    }
  }


  return (
    <>
      <div className='page' >
        <header>SentiSense</header>

        <div className='main'>
          <div className='intro'>
            <div className='about'>
              <h1>Unlock the Power of <span className='decorator'>Sentiment Analysis</span></h1>
              <p>Paste a link, and let us analyze the sentiments behind the comments!
                 Whether it's a video, social media post, or a reel, we break down emotions,
                highlight key opinions, and give you valuable insights—instantly. 🚀</p>
            </div>
            <div className='image'></div>
          </div>
          <form onSubmit={analyse}>
            <input type='text' onChange={(e) => setUrl(e.target.value)} placeholder='Enter post URL...' required/>
            <button type='submit' disabled={loading}>{loading? "Analysing..." : "Analyse" }</button>
          </form>

          <div className='analysis-status' hidden={!loading}>
            {!gotComments && (
              <h3>Scraping Comments...</h3>
            )}

            {!fileCreated && gotComments && (
              <h3>Analysing Comments...</h3>
            )}
          </div>
          
          {fileCreated && (
            <div className='download-button'>
              <h2>File is available to download!</h2>
              <a href='http://127.0.0.1:8000/getcsv' download="output.csv">
                <button>Download CSV File</button>
              </a>
            </div>
          )}

          {tableData.length > 0 ? (
            <div>
              <button className="" onClick={() => setShowTable(!showTable)}>Toggle Table</button>

              {showTable && (
                <div className="table-div">
                <table className="">
                  <thead className="">
                    <tr>
                      {Object.keys(tableData[0]).map((key) => (
                        <th key={key} className="">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}
                      className="">
                        {Object.values(row).map((cell, i) => (
                          <td key={i} className={`
                            ${
                              cell==="Positive" ?  "green" : cell==="Negative" ? "red" : "white"
                            }`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          ) : null}
        </div>

        <footer> © 2025 SentiSense.</footer>
      </div>
    </>
  )
}

export default App
