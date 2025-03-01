from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
import numpy as np
import json
from dotenv import load_dotenv

load_dotenv()



class Clustering:
    def __init__(self):
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    def create_cluster(self, df):
        df["embeddings"] = df["Comment"].apply(lambda x: self.model.encode(x))

        num_clusters = 3
        sentiment_clusters = {}

        for sentiment in df["Sentiment"].unique():
            subset = df[df["Sentiment"] == sentiment]
            X = np.vstack(subset["embeddings"].values)
            kmeans = KMeans(n_clusters=min(num_clusters, len(subset)), random_state=42, n_init=10)
            clusters = kmeans.fit_predict(X)
            df.loc[df["Sentiment"] == sentiment, "cluster"] = clusters

            cluster_map = {}
            for i in range(num_clusters):
                phrases = subset.iloc[np.where(clusters == i)]["Comment"].tolist()
                if phrases:
                    cluster_map[i] = phrases[:3]

            sentiment_clusters[sentiment] = cluster_map
        
        json_output = json.dumps(sentiment_clusters, indent=4, ensure_ascii=False)
        print(json_output)

        return json_output


        # for sentiment, clusters in sentiment_clusters.items():
        #     print(f"\n🔹 Sentiment: {sentiment}")
        #     for cluster_id, phrases in clusters.items():
        #         print(f"   Cluster {cluster_id}: {phrases}")