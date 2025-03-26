import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Network, Lightbulb, Table, Download } from 'lucide-react';
import Papa from 'papaparse';
import axios from 'axios';

function TableData() {
    const [tableData, setTableData] = useState([])
    useEffect(()=> {
        getFile()
    }, [])


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
    <div className="min-h-screen bg-gradient-to-br from-[#011627] via-[#012a3f] to-[#011627] text-white p-4 md:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Home
            </Link>
            <h1 className="text-2xl font-bold tracking-wider text-emerald-400 md:hidden">
              Senti<span className="text-blue-400">Sense</span>
            </h1>
          </div>
          <h1 className="hidden md:block text-2xl font-bold tracking-wider text-emerald-400">
            Senti<span className="text-blue-400">Sense</span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/graphs" 
            className="flex items-center gap-2 bg-teal-500/20 hover:bg-teal-500/30 px-4 py-2 rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <span>Show Graphs</span>
          </Link>
          <Link to="/clusters" 
            className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-lg transition-colors"
          >
            <Network className="w-5 h-5 text-blue-400" />
            <span>Show Clusters</span>
          </Link>
          <Link to="/solutions" 
            className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 px-4 py-2 rounded-lg transition-colors"
          >
            <Lightbulb className="w-5 h-5 text-purple-400" />
            <span>Suggest Solutions</span>
          </Link>
          <a href='http://127.0.0.1:8000/getcsv' download="output.csv">
            <button
                className="flex items-center gap-2 bg-gray-500/20 hover:bg-gray-500/30 px-4 py-2 rounded-lg transition-colors ml-auto">
                <Download className="w-5 h-5 text-gray-400" />
                <span>Download CSV</span>
            </button>
          </a>
          
        </div>
        
        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-8 w-4/5 mx-auto">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Table className="w-8 h-8 text-emerald-400" />
            <h2 className="text-2xl font-bold text-center">Sentiment Analysis Results</h2>
          </div>
          
          {/* Table Section */}
          {tableData.length>0 ? (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center">
                    <thead>
                        <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-center text-lg font-bold text-gray-300">Comment</th>
                        <th className="px-4 py-3 text-center text-lg font-bold text-gray-300">Sentiment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {tableData.map((row, index) => (
                            <tr key={index} className='text-gray-300 hover:bg-white/5 transition-colors'>
                                {Object.values(row).map((cell, i) => (
                                    <td key={i}  className={`px-4 py-3 text-sm
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

          ):(
            <div className="text-center py-8 text-gray-300">
                <p className="text-lg mb-2">No analysis data available yet.</p>
                <p>Start by analyzing a social media post from the home page.</p>
            </div>
          )
          }

        </div>
      </div>
    </div>
  );
}

export default TableData;