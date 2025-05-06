"use client";
import { Analytics } from "@vercel/analytics/react"
import { useState, ChangeEvent, FormEvent } from "react";
// Assuming post.module.css is in the same directory as FindPost.tsx
// If your CSS is one directory up, change this back to "./../post.module.css"
import postStyles from "./../page.module.css";
import axios from "axios";

// Define interfaces for the data we expect from the API
interface PostData {
  id: string;
  title: string;
  explanation: string;
  code: string;
}

interface ApiResponse {
  post?: PostData; // For fetching a single post
  posts?: PostData[]; // For fetching all posts
  error?: string; // For error messages
}

export default function FindPost() {
  const [id, setId] = useState("");
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // To track if the response is success or error


  const handleFind = async (e: FormEvent) => {
    e.preventDefault();
    setResponseData(null); // Clear previous data
    setResponseMsg(null); // Clear previous message
    setIsSuccess(null); // Clear previous status

    try {
      // Construct the API URL based on whether an ID is provided
      const apiUrl = id ? `/api/get?id=${encodeURIComponent(id)}` : "/api/get";

      const res = await axios.get<ApiResponse>(apiUrl);

      if (res.status === 200) {
        setResponseData(res.data);
        setIsSuccess(true); // Mark as success
        if (id && res.data.post) {
          setResponseMsg(`✅ Successfully found Post with ID: ${id}`);
        } else if (!id && res.data.posts) {
          setResponseMsg(`✅ Successfully fetched all Posts.`);
        } else if (id && !res.data.post) {
          // This case might happen if API returns 200 but no post found (though your API returns 404)
          setResponseMsg(`⚠️ No Post found with ID: ${id}`);
          setIsSuccess(false); // Treat as a non-error but not a full success
        }

      } else {
        // Handle non-200 status codes from the API (though your API returns 404/500)
        // Axios will throw for 4xx/5xx by default, so this block might not be reached for those.
        throw new Error(`API responded with status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      // Extract the error message from the response if available, otherwise use the generic message
      const msg = err.response?.data?.error || err.message || "An unknown error occurred.";
      setResponseMsg(`❌ Error fetching post(s): ${msg}`);
      setIsSuccess(false); // Mark as error
    }
  };

  return (
    <main className={postStyles.postPage}> {/* Reuse postPage style */}
      <Analytics/>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem" }}>
        Find Post(s)
      </h1>

      <form onSubmit={handleFind} className={postStyles.postForm}> {/* Reuse postForm style */}
        {/* ID Input */}
        <div className={postStyles.field}> {/* Reuse field style */}
          <label htmlFor="id">Post ID (Optional)</label>
          <input
            id="id"
            type="text"
            value={id}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
            placeholder="Enter ID or leave empty for all posts"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className={postStyles.submitBtn}> {/* Reuse submitBtn style */}
          Find Post(s)
        </button>
      </form>

      {/* In-page Response Message */}
      {responseMsg && (
        <div className={`${postStyles.responseBox} ${isSuccess === true ? postStyles.success : isSuccess === false ? postStyles.error : ''}`}> {/* Reuse responseBox style, add success/error classes */}
          <pre>{responseMsg}</pre>
        </div>
      )}

      {/* Display Fetched Data */}
      {responseData && responseData.post && (
        <div className={postStyles.responseBox}> {/* Reuse responseBox style for data display */}
          <h2>Post Details:</h2>
          <p><strong>ID:</strong> {responseData.post.id}</p>
          <p><strong>Title:</strong> {responseData.post.title}</p>
          <p><strong>Explanation:</strong> {responseData.post.explanation}</p>
          <h3>Code:</h3>
          <pre>{responseData.post.code}</pre> {/* Display code in a pre tag */}
        </div>
      )}

      {responseData && responseData.posts && responseData.posts.length > 0 && (
        <div className={postStyles.responseBox}> {/* Reuse responseBox style for data display */}
          <h2>All Posts:</h2>
          <ul>
            {responseData.posts.map(post => (
              <li key={post.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                <p><strong>ID:</strong> {post.id}</p>
                <p><strong>Title:</strong> {post.title}</p>
                <p><strong>Explanation:</strong> {post.explanation}</p>
                {/* Optionally display code snippet or link to full post */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {responseData && ((responseData.posts && responseData.posts.length === 0) || (id && !responseData.post && isSuccess === true)) && (
        <div className={postStyles.responseBox}>
          <pre>No posts found matching your criteria.</pre>
        </div>
      )}
    </main>
  );
}
