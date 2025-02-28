from twikit import Client, TooManyRequests
from dotenv import load_dotenv
import time
import os
from datetime import datetime
from random import uniform
import asyncio

load_dotenv()

class Twitter:
    def __init__(self):
        self.client = Client(language="en-US")
        self.username = os.getenv("USERNAME_X2")
        self.password = os.getenv("PASSWORD_X2")
        self.email = os.getenv("EMAIL_X2")


    async def get_comments(self, comments, id):
        if comments is None:
            print(f'{datetime.now()} - Searching for replies...')
            tweet = await self.client.get_tweet_by_id(id)
            comments = tweet.replies
        else:
            wait_time = uniform(6, 14)
            print(f'{datetime.now()} - Getting more replies after f{wait_time} seconds...')
            time.sleep(wait_time)
            replies = await replies.next()


    async def get_tweet(self, id, min_comments):
        if(os.path.exists('xcookies.json')):
            self.client.load_cookies('xcookies.json')
            print("Loaded cookies")
        else:
            try:
                await self.client.login(auth_info_1=self.username, auth_info_2=self.email, password=self.password)
                self.client.save_cookies('xcookies.json')
                print("Logged in and saved cookies")
            except:
                print("An error occured while logging in")
                return None
            
        comment_count = 0
        comments = None
        comment_data = []

        while comment_count < min_comments:
            try:
                comments = await self.get_comments(comments, id)
            except TooManyRequests as err:
                rate_limit_reset = datetime.fromtimestamp(err.rate_limit_reset)
                print(f'Rate limit exceeded. Wait until {rate_limit_reset}')
                wait_time = rate_limit_reset-datetime.now()
                time.sleep(wait_time.total_seconds())

            if not comments:
                print(f'{datetime.now()} - No tweet found.')

            for comment in comments:
                comment_count += 1
                comment_data.append(comment.text.replace(",",""))
                # print(comment.text)

            print(f'Done! Got {comment_count} comments.')
        
        return comment_data

if __name__ == "__main__":
    twitter = Twitter()
    url = "https://x.com/Shikhasingh2025/status/1895276676009074755"
    id = url.split("/")[-1]
    comments = asyncio.run(twitter.get_tweet(id=id, min_comments=100))