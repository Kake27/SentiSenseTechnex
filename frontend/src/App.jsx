import { useState } from 'react'

import './App.css'

function App() {


  return (
    <>
      <div className='page' >
        <header>SentiSense</header>

        <div className='main'>
          <div className='intro'>
            <div className='about'>
              <h1>Unlock the Power of <span className='decorator'>Sentiment Analysis</span></h1>
              <p>Paste a link, and let our AI analyze the sentiment behind the comments!
                 Whether it's a product review, social media post, or blog discussion, we break down emotions,
                highlight key opinions, and give you valuable insights—instantly. 🚀</p>
            </div>
            <div className='image'></div>
          </div>
          <form >
            <input type='text' placeholder='Enter post URL...' required/>
            <button type='submit'>Analyse</button>
          </form>
          
        </div>

        <footer>
          © 2025 SentiSense. All Rights Reserved.
        </footer>
      </div>
    </>
  )
}

export default App
