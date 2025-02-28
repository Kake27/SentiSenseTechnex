import subprocess
import os
import csv
import json

url = "https://www.youtube.com/watch?v=HV82kA8AH0Q"

subprocess.run([
    "yt-dlp",
    "--write-comments",
    "--skip-download",
    "-o", "%(id)s",
    url
])

video_id = url.split("v=")[-1]
json_filename = f"{video_id}.info.json"
csv_filename = f"{video_id}_comments.csv"

if os.path.exists(json_filename):
    with open(json_filename, "r", encoding="utf-8") as f:
        data = json.load(f)
    if "comments" in data:
        comments = [comment["text"] for comment in data["comments"]]
        
        with open(csv_filename, "w", encoding="utf-8", newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["Comment"])
            for comment in comments:
                print(comment)
                writer.writerow([comment])
        print(f"Comments saved to {csv_filename}")
        os.remove(json_filename)
    else:
        print("No comments found.")
else:
    print("JSON file not found. yt-dlp might not have extracted comments.")