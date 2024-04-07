import axios from "axios";
import { useState } from "react";

const useQuery = async () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideoDetails = async (videoId: string) => {
    const apiKey = "AIzaSyCtPtV8givx5iqEkKkfnMFUQh_XP3Jw9a0"; // Replace with your actual API key
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    setLoading(true);
    try {
      const response = await axios.get(url);
      setData(response.data.items[0]);
      setLoading(false);
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

  return {
    data,
    loading,
    isError,
    error,
    fetchVideoDetails,
  };
};

export default useQuery;
