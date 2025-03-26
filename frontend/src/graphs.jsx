import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Network, Lightbulb, Table } from 'lucide-react';
import Papa from 'papaparse';
import axios from 'axios';

import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, scales, Ticks } from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title,Tooltip, Legend);

function Graphs() {
    const [graphData, setGraphData] = useState({})
    console.log(graphData)

    useEffect(()=> {
        getGraphs()
    }, [])


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
          legend: { position: "top", labels: {color:"#ffffff"}},
          title: { text: "Sentiment Analysis" },
          
          scales: {
            x: {Ticks: {color: "#ffffff"}},
            y: {Ticks: {color: "#ffffff"}}
          }
        },
      };

    //   getGraphs();

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
          <Link to="/table" 
            className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2 rounded-lg transition-colors"
          >
             <Table className="w-5 h-5 text-emerald-400" />
            <span>Show Data</span>
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
          
        </div>
        
        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-8">
          <div className="flex justify-center items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-teal-400" />
            <h2 className="text-2xl font-bold text-center">Sentiment Analysis Graphs</h2>
          </div>

          {Object.keys(graphData).length? (
            <div className="flex flex-col justify-center items-center gap-4 mt-20">
                <div className='bar w-full h-full max-w-2xl max-h-2xl'>
                    <Bar data={chartData} options={options} />
                </div>
                <div className='pie max-w-2xl max-h-2xl '>
                    <Pie data={chartData} options={options} />
                </div>
            </div>
          ): (
            <div className="text-center py-8 text-gray-300">
                <p className="text-lg mb-2">No graph data available yet.</p>
                <p>Start by analysing a social media post from the home page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Graphs;