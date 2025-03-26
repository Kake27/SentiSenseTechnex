import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Network, MessageSquare, ThumbsUp, ThumbsDown, Minus, Lightbulb, BarChart3, Table,
     Loader2
 } from 'lucide-react';
import axios from 'axios';

function Clusters() {
    const [loadingClusters, setLoadCluster] = useState(true)
    // const [gotClusters, setGotClusters] = useState(false)
    const [clusterData, setClusterData] = useState([])

    const getClusters = async () => {
        try{
          setLoadCluster(true) 
          const response = await axios.get("http://127.0.0.1:8000/clustering")
          const data = JSON.parse(response.data)
    
          if(response.error) {
            console.log("An error occured while getting clusters!")
            return 
          }
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
          setLoadCluster(false)
    
        } catch(err) {
          console.log("An error occured: " + err)
        }
      }

      useEffect(()=> {
            getClusters()
        }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#011627] via-[#012a3f] to-[#011627] text-white p-4 md:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
            <Link 
              to="/data" 
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Analysis
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
          <Link 
            to="/data" 
            className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2 rounded-lg transition-colors"
          >
            <Table className="w-5 h-5 text-emerald-400" />
            <span>Show Data</span>
          </Link>
          <Link 
            to="/graphs" 
            className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Show Graphs</span>
          </Link>
          <Link 
            to="/solutions" 
            className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 px-4 py-2 rounded-lg transition-colors"
          >
            <Lightbulb className="w-5 h-5 text-purple-400" />
            <span>Suggest Solutions</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Network className="w-12 h-12 text-blue-400" />
          <h2 className="text-3xl font-bold text-center">Comment Clusters</h2>
          <p className="text-gray-400 text-center max-w-2xl">
            Discover common themes and patterns in your social media comments, grouped by sentiment
          </p>
        </div>

        {/* Clusters Grid */}
        {loadingClusters? (
            <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                <p className="text-gray-400">Analyzing comment clusters...</p>
          </div>
        ):(
        <div className="space-y-8">
   
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-400">Positive Themes</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusterData.map((row, index) => (
                    row.sentiment=="Positive" && (
                        <div key={index} className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
                            <p className="text-gray-300 text-sm">{row.comment}</p>
                        </div>
                    )
                ))}
            </div>
          </div>

          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <ThumbsDown className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-red-400">Negative Themes</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusterData.map((row, index) => (
                    row.sentiment=="Negative" && (
                        <div key={index} className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
                            <p className="text-gray-300 text-sm">{row.comment}</p>
                        
                        </div>    
                        )
                    ))}
            </div>
          </div>


          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Minus className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-blue-400">Neutral Themes</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusterData.map((row, index) => (
                    row.sentiment=="Negative" && (
                        <div key={index} className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/10">
                            <p className="text-gray-300 text-sm">{row.comment}</p>
                        </div>   
                        )
                    ))}
            </div>
          </div>
        </div>)}
      </div>
    </div>
  );
}

export default Clusters;