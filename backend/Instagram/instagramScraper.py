from instaloader import Instaloader, Post
import time
import random

L = Instaloader()
L.load_session_from_file('sentisensei7')
print("login success")

url = "https://www.instagram.com/p/DFtT1dQTRvL/"
shortcode = url.split("/p/")[-1].split("/")[0]

post = Post.from_shortcode(L.context, shortcode)
comments = post.get_comments()
comment_count = post.comments
print(f"Found {comment_count} comments")

all_comments = []

for comment in comments:
    print(comment.text)
    all_comments.append(comment.text.replace(",",""))

    print(f"got {len(all_comments)} comments so far...")

    if((len(all_comments))%15 == 0):
        print(f"Sleeping for some time...") 
        time.sleep(random.uniform(7, 15))

    wait_time = random.uniform(0.5,2)
    print(f"Waiting for {wait_time} seconds...")
    time.sleep(wait_time)

print(f"got {len(all_comments)} comments")