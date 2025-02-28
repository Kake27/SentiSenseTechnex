from twikit import Client, TooManyRequests
from dotenv import load_dotenv
import time
import os
from datetime import datetime
from random import uniform, randint
import asyncio
import json

load_dotenv()

client = Client(language="en-US")
MINIMUM_COMMENTS = 50

username = os.getenv("USERNAME_X2")
password = os.getenv("PASSWORD_X2")
email = os.getenv("EMAIL_X2")
client = Client(language='en-US')

url = "https://x.com/Shikhasingh2025/status/1895276676009074755"
id = url.split("/")[-1]

async def get_replies(comments, id):
    if comments is None:
        print(f'{datetime.now()} - Searching for replies...')
        tweet = await client.get_tweet_by_id(id)
        comments = tweet.replies
    else:
        wait_time = uniform(5, 13)
        print(f'{datetime.now()} - Getting more replies after f{wait_time} seconds...')
        time.sleep(wait_time)
        comments = await comments.next()

    return comments

async def get_tweet(id, min_comments = 50):
    # await client.login(auth_info_1=username, auth_info_2=email, password=password)
    # client.save_cookies('xcookies.json')

    client.load_cookies('xcookies.json')

    comment_count = 0
    comments = None
    comment_data = []

    while comment_count < min_comments:
        try:
            comments = await get_replies(comments, id)
        except TooManyRequests as err:
            rate_limit_reset = datetime.fromtimestamp(err.rate_limit_reset)
            print(f'Rate limit exceeded. Wait until {rate_limit_reset}')
            wait_time = rate_limit_reset-datetime.now()
            time.sleep(wait_time.total_seconds())

        if not comments:
            print(f'{datetime.now()} - No tweet found.')

        for reply in comments:
            comment_count += 1
            comment_data.append(reply.text.replace(",",""))
            print(reply.text)

        print(f'Done! Got {comment_count} comments.')


asyncio.run(get_tweet(id))