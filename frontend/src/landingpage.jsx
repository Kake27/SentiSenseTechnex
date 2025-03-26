import React from 'react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, MessageSquare, BarChart3, Sparkles, ArrowRight, Youtube, Instagram, Twitter } from 'lucide-react';
import axios from 'axios';


function LandingPage() {
  const sectionRef = useRef(null);
  const scrollToSection = () => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileCreated, setFileCreated] = useState(false)
  const [gotComments, setComments] = useState(false)

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

        // getFile()
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

          // getFile()
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#011627] via-[#012a3f] to-[#011627] text-white">

      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold tracking-wider text-emerald-400">
            Senti<span className="text-blue-400">Sense</span>
          </h1>
        </div>
      </header>

      <div className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="relative container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="max-w-3xl text-center mt-20">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Understand Your Social Media Impact
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Analyze comments and engagement across all your social platforms with our advanced AI-powered sentiment analysis tool.
            </p>
            <div className="flex justify-center">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all"
                      onClick={scrollToSection}>
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center">
            <div className="bg-emerald-500/20 p-3 rounded-lg mb-4">
              <Brain className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
            <p className="text-gray-400">Advanced machine learning algorithms analyze sentiment patterns in real-time.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center">
            <div className="bg-blue-500/20 p-3 rounded-lg mb-4">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Multi-Platform Support</h3>
            <p className="text-gray-400">Analyze comments from YouTube, Instagram, Twitter, and more in one place.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center">
            <div className="bg-emerald-500/20 p-3 rounded-lg mb-4">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Detailed Insights</h3>
            <p className="text-gray-400">Get comprehensive reports with actionable insights and trends.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-8">Supported Platforms</h2>
        <div className="bg-nonebackdrop-blur-sm rounded-xl p-8">
          <div className="flex justify-center gap-12 flex-wrap">
            <div className="flex items-center gap-3 text-xl hover:text-emerald-400 transition-colors cursor-pointer">
              <Youtube className="w-8 h-8 text-red-500" />
              <span>YouTube</span>
            </div>
            <div className="flex items-center gap-3 text-xl hover:text-emerald-400 transition-colors cursor-pointer">
              <Instagram className="w-8 h-8 text-pink-500" />
              <span>Instagram</span>
            </div>
            <div className="flex items-center gap-3 text-xl hover:text-emerald-400 transition-colors cursor-pointer">
              <Twitter className="w-8 h-8 text-blue-400" />
              <span>Twitter</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20" ref={sectionRef}>
        <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
          <div className="max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-emerald-400" />
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-8">
              Paste your social media post URL below to analyze its sentiment
            </p>
            <form onSubmit={analyse} className="flex gap-4 max-w-xl mx-auto">
              
              <input 
                type="url" 
                onChange={(e) => setUrl(e.target.value)} required
                placeholder="Enter social media post URL (e.g., https://x.com/user/status/123...)" 
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                disabled={loading}
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
                {loading? (
                  <>
                    <div className='spinner' />
                  </>
                ): (<>Analyse <ArrowRight className="w-5 h-5" /></>) } 
              </button>
            </form>

            {fileCreated && (<div className="mt-6">
              <Link 
                to="/table" 
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                View Data <ArrowRight className="w-5 h-5" />
              </Link>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;