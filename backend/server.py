from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from Instagram.instagramScraper import Instgram
from Reddit.redditScraper import Reddit
from Youtube.youtubeScraper import Youtube
from Twitter.twitterScraper import Twitter

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/")
async def root():
    return {"message": "server running"}

