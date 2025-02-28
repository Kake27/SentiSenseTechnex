import requests
import json
from bs4 import BeautifulSoup
import time
import cloudscraper 

base_url = "https://in.pinterest.com/resource/UnifiedCommentsResource/get/"
post_url = "https://in.pinterest.com/pin/1058134874952305128/"
PIN = post_url.split("/")[-2]

scraper = cloudscraper.create_scraper()

def getAPID(post_url):
    response = scraper.get(post_url)
    with open("pinterest_page.html", "wb") as file:
        file.write(response.content)

    print("HTML file saved as pinterest_page.html")

    time.sleep(30)
    soup = BeautifulSoup(response.text, "html.parser")
    script_tags = soup.find_all("script", {"data-relay-response": "true", "type": "application/json"})

    if len(script_tags) > 1:
        second_script_content = script_tags[1].string.strip()
        try:
            json_data = json.loads(second_script_content) 
            print(json_data)
            time.sleep(5)
            APID = json_data["response"]["data"]["v3GetPinQuery"]["data"]["aggregatedPinData"]["entityId"]
            print(APID)

        except json.JSONDecodeError as e:
            print("Error decoding JSON:", e)


def get_comments(url):
    APID = getAPID(url)
    PIN = post_url.split("/")[-2]

    print("Sleeping for 1 minute.")
    time.sleep(60)

    params = {
    "source_url": f"/pin/{PIN}/",
    "data": json.dumps({
        "options": {
            "aggregated_pin_id": str(APID),
            "comment_featured_ids": [],
            "page_size": 40,
            "redux_normalize_feed": True,
            "is_reversed": False
        },
        "context": {}
    }),
    "_": "1740684759450"
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Referer": f"https://in.pinterest.com/pin/{PIN}/",
        "X-Requested-With": "XMLHttpRequest"
    }

    response = scraper.get(url, params=params, headers=headers)
    print(response)
    if response.status_code == 200:
        try:
            _data = response.json()
            data = _data.get("resource_response", {}).get("data", [])

            if data:
                text = [d.get("text", "No text found") for d in data]
                print(*text, sep="\n")
            else:
                print("No comments found.")

        except json.JSONDecodeError:
            print("Failed to decode JSON response.")
    else:
        print(f"Request failed with status code {response.status_code}")


get_comments(post_url)



# if len(script_tags) > 1:
#     second_script_content = script_tags[1].string.strip()
#     try:
#         json_data = json.loads(second_script_content) 
#         APID = json_data["response"]["data"]["v3GetPinQuery"]["data"]["aggregatedPinData"]["entityId"]
#         print(APID)

        # params = {
        #     "source_url": f"/pin/{PIN}/",
        #     "data": json.dumps({
        #         "options": {
        #             "aggregated_pin_id": str(APID),
        #             "comment_featured_ids": [],
        #             "page_size": 40,
        #             "redux_normalize_feed": True,
        #             "is_reversed": False
        #         },
        #         "context": {}
        #     }),
        #     "_": "1740684759450"
        # }


        # headers = {
        #     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        #     "Accept": "application/json, text/javascript, */*; q=0.01",
        #     "Referer": f"https://in.pinterest.com/pin/{PIN}/",
        #     "X-Requested-With": "XMLHttpRequest"
        # }
        # response = requests.get(base_url, params=params, headers=headers)

        # if response.status_code == 200:
        #     try:
        #         _data = response.json()
        #         data = _data.get("resource_response", {}).get("data", [])

        #         if data:
        #             text = [d.get("text", "No text found") for d in data]
        #             print(*text, sep="\n")
        #         else:
        #             print("No comments found.")

        #     except json.JSONDecodeError:
        #         print("Failed to decode JSON response.")
        # else:
        #     print(f"Request failed with status code {response.status_code}")

#     except json.JSONDecodeError as e:
#         print("Error decoding JSON:", e)

# else:
#     print("Couldnt find the comment data")



# for i, script in enumerate(script_tags):
#     try:
#         json_data = json.loads(script.string)  # Convert to Python dictionary
#         print(f"Script {i + 1}:\n", json.dumps(json_data, indent=2))  # Pretty print JSON
#     except json.JSONDecodeError:
#         print(f"Script {i + 1}: Could not decode JSON")