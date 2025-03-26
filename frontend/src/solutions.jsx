import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, ThumbsUp, ThumbsDown, Minus, BarChart3, Network, LineChart, Table ,
        } from 'lucide-react';
import axios from 'axios';

function Solutions() {
    const [loadingSolns, setLoadingSolns] = useState(false)
    const [gotSoln, setSolnStatus] = useState(false)
    const [solnData, setSolnData] = useState({})
    

    const getSolutions = async () => {
        try {
          setLoadingSolns(true)
          const response = await axios.get("http://127.0.0.1:8000/solutions")
    
          if(response.data.error) {
            console.log("An error occurred")
            setLoadingSolns(false)
            return
          }
    
          setSolnData(response.data)
          setSolnStatus(true)
          setLoadingSolns(false)
    
        } catch(err){
          console.log(err)
          setLoadingSolns(false)
        }
      }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#011627] via-[#012a3f] to-[#011627] text-white p-4 md:p-8">
        <div className="container mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
            <Link 
                to="/data" 
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Analysis
            </Link>
            <h1 className="text-2xl font-bold tracking-wider text-emerald-400">
                Senti<span className="text-blue-400">Sense</span>
            </h1>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/table" 
                className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2 rounded-lg transition-colors"
            >
                <Table className="w-5 h-5 text-emerald-400" />
                <span>Show Data</span>
            </Link>
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
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center gap-3 mb-8">
            <Lightbulb className="w-12 h-12 text-purple-400" />
                <h2 className="text-3xl font-bold text-center">Suggested Solutions</h2>
                <p className="text-gray-400 text-center max-w-2xl">
                    Based on the sentiment analysis of your social media engagement, here are tailored recommendations to improve your content strategy
                </p>

                {!gotSoln && (<button className=" hover:opacity-70 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2
                                    border-2 border-emerald-500" onClick={getSolutions}>
                    {loadingSolns? (
                    <>
                        <div className='spinner' />
                    </>
                    ): (<>Get Suggestions </>) } 
                </button>)}
            </div>

            {/* {loadingSolns&& (
                <div className='bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center flex justify-center gap-8
                                  text-2xl w-fit mx-auto'>
                    <LoaderCircle className='w-8 h-8' />
                    <h1>Generating Suggestions</h1>
                </div>
            )} */}

            {/* Solutions Grid */}
            {gotSoln&&(
                <div className="grid md:grid-cols-3 gap-6">
                    {Object.entries(solnData).map(([sentiment, suggestions], index) => (
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                            {sentiment=="Positive" && (
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="bg-green-500/20 p-2 rounded-lg">
                                        <ThumbsUp className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-green-400">Positive Feedback</h3>
                                </div>
                            )}

                            {sentiment=="Negative" && (
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="bg-red-500/20 p-2 rounded-lg">
                                        <ThumbsDown className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-red-400">Negative Feedback</h3>
                                </div>
                            )}

                            {sentiment=="Neutral" && (
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="bg-blue-500/20 p-2 rounded-lg">
                                        <Minus className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-blue-400">Neutral Feedback</h3>
                                </div>
                            )}
                            <ul className="space-y-3 text-gray-300">
                                {suggestions.map((suggestion, i) => (
                                    <li className="flex items-start gap-2" key={i}>
                                        <span className={` mt-1
                                            ${sentiment=="Positive" && ("text-green-400")}
                                            ${sentiment=="Negative" && ("text-red-400")}
                                            ${sentiment=="Neutral" && ("text-blue-400")}`}>•</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                {/* Positive Sentiment */}
                {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                            <ThumbsUp className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-400">Positive Feedback</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Identify and replicate successful content formats that generate positive engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Engage more with users who leave positive comments to build community</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Create content series based on topics that receive positive feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Share success stories and testimonials to reinforce positive sentiment</span>
                    </li>
                    </ul>
                </div> */}

                {/* Negative Sentiment */}
                {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                        <ThumbsDown className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-400">Negative Feedback</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Address common concerns promptly and professionally</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Review content strategy for topics that trigger negative responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Implement feedback collection to understand pain points better</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Create educational content to address misconceptions</span>
                    </li>
                    </ul>
                </div> */}

                {/* Neutral Sentiment */}
                {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Minus className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-400">Neutral Feedback</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Add more engaging elements to content to evoke stronger responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Experiment with different content formats to find what resonates</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Include clear calls-to-action to encourage engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Use storytelling techniques to create emotional connections</span>
                    </li>
                    </ul>
                </div> */}
            </div>)}

            {/* Additional Tips */}
            {/* <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-teal-500/20 p-2 rounded-lg">
                        <LineChart className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-teal-400">General Recommendations</h3>
                </div>
                <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
                    <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Monitor sentiment trends over time to identify patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Maintain consistent brand voice across all interactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Use analytics to track the impact of implemented changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Regular content audits to ensure alignment with audience needs</span>
                    </li>
                </ul>
            </div> */}
        </div>
        </div>
    );
}

export default Solutions;