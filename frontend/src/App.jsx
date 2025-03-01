import { useState } from 'react'
import axios from "axios"
import './App.css'
import Papa from "papaparse"
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title,Tooltip, Legend);

function App() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileCreated, setFileCreated] = useState(false)
  const [gotComments, setComments] = useState(false)

  const [tableData, setTableData] = useState([])
  const [showTable, setShowTable] = useState(false)

  const [showGraph, setGraphStatus] = useState(false)
  const [graphData, setGraphData] = useState({})

  const [loadingClusters, setLoadCluster] = useState(false)
  const [gotClusters, setGotClusters] = useState(false)
  const [showClusters, setClusters] = useState(false)
  const [clusterData, setClusterData] = useState([])

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

      getGraphs()

    } catch(err) {
      console.log("Failed to fetch csv file: " + err)
    }
  }

  const getGraphs = async () => {
    try {
      const graph = await axios.get("http://127.0.0.1:8000/graphs")
      setGraphData(graph.data)

    } catch (err) {
      console.log("Error drawing graphs: "+err)
    }
  }

  const chartData = {
    labels: Object.keys(graphData),
    datasets: [
      {
        label: "Sentiment Count",
        data: Object.values(graphData), 
        backgroundColor: ["#FFBB28", "#FF4444", "#00C49F"],
        borderColor: ["#E5A800", "#C62F2F", "#008C7E"],
        borderWidth: 1,
        color: "#FFFFFF"
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "left" },
      title: { text: "Sentiment Analysis" }
    },
  };

  const getClusters = async () => {
    try{
      setLoadCluster(true) 
      const response = await axios.get("http://127.0.0.1:8000/clustering")
      const data = JSON.parse(response.data)

      if(response.error) {
        console.log("An error occured while getting clusters!")
        return 
      }

      console.log(data)
      setLoadCluster(false)

      const formattedData = [];

      Object.entries(data).forEach(([sentiment, clusters]) => {
        Object.entries(clusters).forEach(([cluster, comments]) => {
          comments.forEach((comment, index) => {
            formattedData.push({
              sentiment,
              cluster,
              comment,
            });
          });
        });
      });

      setClusterData(formattedData)

      setGotClusters(true)

    } catch(err) {
      console.log("An error occured: " + err)
    }
    

  }


  return (
    <>
      <div className="flex  min-h-screen w-full bg-[#000C18] m-0 text-white p-0 
      flex-col bg-[url('/background.png')] bg-no-repeat " >
        <header className='flex justify-center text-center align-middle text-amber-200 text-5xl font-bold
        mt-2'>SentiSense</header>

        <div className='flex flex-col justify-center items-center text-center flex-1'>
          <div className='flex items-center justify-center mt-30 gap-8'>
            <div className='max-w-[40%]'>
              <h1 className='text-3xl font-bold mb-8'>Unlock the Power of 
                <span className='text-green-300'> Sentiment Analysis</span></h1>
              <p className='mt-12 text-center text-base'>Paste a link, and let us analyze the sentiments behind the comments!
                 Whether it's a video, social media post, or a reel, we break down emotions,
                highlight key opinions, and give you valuable insights—instantly. 🚀</p>
            </div>

            <div className="bg-[url('/robot.png')] bg-cover bg-center h-[250px] w-[250px] opacity-85 flex justify-center items-center text-center">
            </div>
          </div>

          <form onSubmit={analyse} className="flex justify-center items-center text-center mt-16 w-[25rem]">
            <input type='text' onChange={(e) => setUrl(e.target.value)} placeholder='Enter post URL...' required
            className='h-9 min-w-4/5 bg-[#000C18] text-wheat border border-white rounded-tl-lg rounded-bl-lg px-2 focus:outline-none'/>
            <button type='submit' disabled={loading}
            className='h-[2.3rem] min-w-1/5 bg-blue-600 text-white text-base border border-blue-600 rounded-tr-lg rounded-br-lg'
            >{loading? "Analysing..." : "Analyse" }</button>
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
            <div className='my-4 '>
              <h1 className='text-yellow-200 text-[1.2rem]'>File is available to download!</h1>
              <a href='http://127.0.0.1:8000/getcsv' download="output.csv">
                <button className='border-amber-300 border-2 h-8 w-40 my-2 rounded-2xl'>Download CSV File</button>
              </a>
            </div>
          )}

          {tableData.length > 0 ? (
            <div>
              <div className='w-[70vw] my-6 mx-auto flex justify-items-start gap-0 align-middle text-center'>
                <button className="border-green-600 border-2 rounded-tl-lg rounded-bl-lg  h-[3rem] w-[7rem]
                py-auto bg-green-600"
                onClick={() => setShowTable(!showTable)}>Toggle Table</button>

                <button className='border-green-600 border-2 h-[3rem] w-[7rem] rounded-tr-lg rounded-br-lg 
                text-center py-auto bg-green-600'
                onClick={() => setGraphStatus(!showGraph)}>
                  Toggle Graphs
                </button>

                {gotClusters? 
                (<button className='border-2 h-[3rem] min-w-[7rem] border-green-600 ml-10'
                onClick={() => setClusters(!showClusters)}>
                  Toggle Clusters
                </button>) : 
                (<button className='border-2 h-[3rem] min-w-[7rem] border-green-600'
                  onClick={getClusters}>
                    {loadingClusters ? "Analysing..." : "Analyse Clusters"}
                  </button>)}
              </div>
              

              {showTable && (
                <div className="overflow-x-auto text-center">
                <table className="max-w-3/4 mx-auto border border-white rounded-3xl">
                  <thead className="bg-[#000C18]">
                    <tr>
                      {Object.keys(tableData[0]).map((key) => (
                        <th key={key} className="border border-white rounded-3xl px-4 py-2">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}
                      className="border border-white rounded-3xl">
                        {Object.values(row).map((cell, i) => (
                          <td key={i} className={`border border-white rounded-3xl  px-4 py-2
                            ${
                              cell==="Positive" ?  "text-green-400" : cell==="Negative" ? "text-red-500" : "text-gray-300"
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

          {showGraph && (
            <div className='flex justify-between items-center text-center gap-10'>
              <div className='bar w-full h-full max-w-2xl max-h-2xl'>
                <Bar data={chartData} options={options} />
              </div>
              <div className='pie w-full h-full max-w-2xl max-h-2xl'>
                <Pie data={chartData} options={options} />
              </div>
            </div>
          )}

          {showClusters && (
            <table className="table-auto border-collapse border border-gray-300 w-3/4 my-10">
            <thead>
              <tr className="">
                <th className="border border-gray-300 px-4 py-2">Sentiment</th>
                {/* <th className="border border-gray-300 px-4 py-2">Cluster</th> */}
                <th className="border border-gray-300 px-4 py-2">Comment</th>
              </tr>
            </thead>
            <tbody>
              {clusterData.map((row, index) => (
                <tr key={index} className="">
                  <td className="border border-gray-300 px-4 py-2">{row.sentiment}</td>
                  {/* <td className="border border-gray-300 px-4 py-2">{row.cluster}</td> */}
                  <td className="border border-gray-300 px-4 py-2">{row.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}



        </div>
        <footer className='bg-[#000C18] text-center justi py-4 text-gray-400'> © 2025 SentiSense.</footer>
      </div>
    </>
  )
}

export default App
