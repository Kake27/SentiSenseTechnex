from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from Instagram.instagramScraper import Instgram
from Reddit.redditScraper import Reddit
from Youtube.youtubeScraper import Youtube
from Twitter.twitterScraper import Twitter
from transformers import pipeline
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

sent_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")
status = {"processing": False, "comments_found": False, "file_created": False, "error": False}
prev_url = ""


def analyse(url):
    global status
    global prev_url

    prev_url = url
    status["processing"] = True

    if(os.path.exists("comments.csv")):
        os.remove("comments.csv")
    

    try: 
        comments = []
        if "x.com" in url:
            scraper = Twitter()
            id = url.split("/")[-1]
            comments = scraper.tweet_by_id_run(id=id, min_replies=100)
        elif "reddit.com" in url:
            scraper = Reddit()
            comments = scraper.get_comments(url=url)
        elif "instagram.com" in url:
            scraper = Instgram()
            comments = scraper.get_comments(url=url)
        elif "youtube.com" in url:
            scraper = Youtube()
            comments = scraper.get_comments(video_url=url)
        else:
            print("Invalid URL")
            status["error"] = "Invalid URL"
            return
        
        status["comments_found"] = True

        sentiments = []
        sentiment_labels = {
            "LABEL_0": "Negative",
            "LABEL_1": "Neutral",
            "LABEL_2": "Positive"
        }

        for comment in comments:
            result = sent_pipeline(comment, truncation=True, max_length=512)
            sentiment = result[0]["label"]
            sentiments.append([comment, sentiment_labels[sentiment]])

        df = pd.DataFrame(sentiments, columns=["Comment", "Sentiment"])
        df.to_csv("comments.csv", index=False)

        print("Sentiment Analysis Completed.")
        status["file_created"] = True

    except:
        print("An error occurred")
        status["error"] = True
        
    status["processing"] = False


@app.get("/")
async def root():
    return {"message": "server running"}

@app.get("/status")
async def get_status():
    global status
    return status


@app.get("/analyse")
async def get_analysis(url: str, background_tasks: BackgroundTasks):
    global status
    if status["processing"]:
        return {"message": "Process is already running"}
    elif url == prev_url and os.path.exists("comments.csv"):
        return {"file_created": True}
    
    background_tasks.add_task(analyse, url)
    return {"message": "Analysis Started"}


@app.get("/getcsv")
async def get_file():
    if os.path.exists("comments.csv"):
        return FileResponse("comments.csv", filename="output.csv", media_type="text/csv")
    return {"error": "file not found"}


@app.get("/graphs")
async def get_graph_data():
    if(os.path.exists("comments.csv")):
        df  = pd.read_csv("comments.csv")
        sentiment_count = df["Sentiment"].value_counts().to_dict()
        print(sentiment_count)
        return sentiment_count
    return {"error": "file not found"}
    

