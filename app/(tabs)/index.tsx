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

  const parseDuration = (
    durationString: string
  ): { hours: number; minutes: number; seconds: number } | null => {
    const match = durationString.match(/^PT(\d+H)?(\d+M)?(\d+S)?$/);
    if (match) {
      const hours = parseInt(match[1] ? match[1].slice(0, -1) : "0", 10);
      const minutes = parseInt(match[2] ? match[2].slice(0, -1) : "0", 10);
      const seconds = parseInt(match[3] ? match[3].slice(0, -1) : "0", 10);
      return { hours, minutes, seconds };
    }
    return null;
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

  const fetchVideoData = () => {
    if (!videoLink) return;
    Promise.all([fetchVideoDetails(videoLink), fetchVideoDuration(videoLink)]);
  };

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
        <View>
          <Image
            source={{
              uri: data.snippet.thumbnails.high.url,
            }}
          />
          <Text
            style={{
              color: "#fff",
            }}
          >
            {data.snippet.title}
          </Text>
          <Text
            style={{
              color: "#fff",
            }}
          >
            {videoDuration !== null &&
              parseDuration(videoDuration) !== null &&
              parseDuration(videoDuration).hours}
            {parseDuration(videoDuration).hours} hours,{" "}
            {parseDuration(videoDuration).minutes} minutes,{" "}
            {parseDuration(videoDuration).seconds} seconds
          </Text>
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
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  todoText: {
    fontSize: 16,
  },
});
