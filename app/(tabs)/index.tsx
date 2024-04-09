import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Image } from "react-native";
import { Text } from "@/components/Themed";
import TodoList from "@/components/TodoList";
import useQuery from "@/hooks/useQuery";
import axios from "axios";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  timeAdded?: Date;
}

export default function TabOneScreen() {
  const [videoLink, setVideoLink] = useState("");
  const [data, setData] = useState(null);
  const [imageThumbnail, setImageThumbnail] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const extractYoutubeIdFromUrl = (url: string): string | null => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=)?)([^#&?\/\s]*)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchVideoDetails = async (videoURL: string) => {
    const videoId = extractYoutubeIdFromUrl(videoURL);
    const apiKey = "AIzaSyCtPtV8givx5iqEkKkfnMFUQh_XP3Jw9a0"; // Replace with your actual API key
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    setLoading(true);
    try {
      const response = await axios.get(url);
      setData(response.data.items[0]);
      setLoading(false);
      setVideoLink("");
      return response.data.items[0]; // Assuming single video fetched
    } catch (error) {
      console.error("Error fetching video details:", error);
      setIsError(true);
      setError(error);

      // Handle errors appropriately in your app
    } finally {
      setLoading(false);
    }
  };

  const parseDuration = (durationString: string): string => {
    const match = durationString.match(/^PT(\d+H)?(\d+M)?(\d+S)?$/);
    if (match) {
      const hours = parseInt(match[1] ? match[1].slice(0, -1) : "0", 10);
      const hoursFormatted = hours !== 0 ? hours + ":" : "";
      const minutes = parseInt(match[2] ? match[2].slice(0, -1) : "0", 10);
      const minutesFormatted = minutes !== 0 ? minutes + ":" : "";
      const seconds = parseInt(match[3] ? match[3].slice(0, -1) : "0", 10);
      const secondsFormatted = seconds !== 0 ? seconds : "";
      return hoursFormatted + minutesFormatted + secondsFormatted;
    } else {
      return "Duration format is wrong!";
    }
  };

  const fetchVideoDuration = async (videoURL: string) => {
    const videoId = extractYoutubeIdFromUrl(videoURL);
    const apiKey = "AIzaSyCtPtV8givx5iqEkKkfnMFUQh_XP3Jw9a0"; // Replace with your actual API key
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;
    setLoading(true);
    try {
      const response = await axios.get(url);
      setVideoDuration(response.data.items[0].contentDetails.duration);
      setLoading(false);
      setVideoLink("");
      return response.data.items[0]; // Assuming single video fetched
    } catch (error) {
      console.error("Error fetching video details:", error);
      setIsError(true);
      setError(error);

      // Handle errors appropriately in your app
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoData = async () => {
    if (!videoLink) return;
    const data = await Promise.all([
      fetchVideoDetails(videoLink),
      fetchVideoDuration(videoLink),
    ]);
    console.log("data: ", data);
    setImageThumbnail(data[0].snippet.thumbnails.high.url);
  };

  // const totalVideoDuration =

  return (
    <View style={styles.container}>
      <Text style={styles.title}>YouTube Videos</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Add a new video..."
        value={videoLink}
        onChangeText={setVideoLink}
      />
      <Button title="Add" onPress={fetchVideoData} />
      {loading && (
        <Text
          style={{
            color: "#fff",
          }}
        >
          Loading...
        </Text>
      )}
      {isError && (
        <Text
          style={{
            color: "#fff",
          }}
        >
          Error fetching video: {error.message}
        </Text>
      )}
      {data && (
        <View style={styles.videoContainer}>
          <Image
            source={{
              uri: imageThumbnail || "https://via.placeholder.com/200",
            }}
            style={styles.thumbnail}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
              }}
            >
              {data.snippet.title}
            </Text>
            <Text
              style={{
                color: "#fff",
              }}
            >
              {videoDuration === null ? "NULL" : parseDuration(videoDuration)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  textInput: {
    fontSize: 16,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    color: "#fff",
  },
  videoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 20,
  },
  thumbnail: {
    width: 75 * 1.5,
    height: 50 * 1.5,
    borderRadius: 20,
  },
});
