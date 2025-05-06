"use client";
import { Analytics } from "@vercel/analytics/react"
import { useState, ChangeEvent, FormEvent } from "react";
// Assuming post.module.css is in the same directory as Post.tsx
// If your CSS is one directory up, change this back to "./../post.module.css"
import postStyles from "./../page.module.css";
import { Editor } from "@monaco-editor/react";
import axios from "axios";

interface PostData {
  id: string;
  title: string;
  explanation: string; // Changed from expl to explanation
  code: string;
}

export default function Post() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState(""); // Renamed state variable
  const [code, setCode] = useState("");
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // To track if the response is success or error


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResponseMsg(null); // Clear previous message
    setIsSuccess(null); // Clear previous status

    try {
      // Send the data with the correct key name 'explanation'
      const res = await axios.post("/api/post", { id, title, explanation, code });

      if (res.status === 201) {
        setResponseMsg(`✅ Inserted ID: ${res.data.insertedId}`);
        setIsSuccess(true); // Mark as success
        // clear form on success
        setId("");
        setTitle("");
        setExplanation(""); // Clear the renamed state variable
        setCode("");
      } else {
        // Handle non-201 status codes from the API
        throw new Error(`API responded with status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      // Extract the error message from the response if available, otherwise use the generic message
      const msg = err.response?.data?.error || err.message || "An unknown error occurred.";
      setResponseMsg(`❌ Error submitting post: ${msg}`);
      setIsSuccess(false); // Mark as error
    }
  };

  return (
    <main className={postStyles.postPage}>
      <Analytics/>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem" }}>
        Create a Post
      </h1>

      <form onSubmit={handleSubmit} className={postStyles.postForm}>
        {/* ID */}
        <div className={postStyles.field}>
          <label htmlFor="id">ID</label>
          <input
            id="id"
            type="text"
            value={id}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setId(e.target.value)}
            placeholder="Enter a unique ID"
            required // Make ID a required field
          />
        </div>

        {/* Title */}
        <div className={postStyles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Enter Title"
            required // Make Title a required field
          />
        </div>

        {/* Explanation */}
        <div className={postStyles.field}>
          <label htmlFor="explanation">Explanation</label> {/* Updated htmlFor */}
          <input
            id="explanation" // Updated id
            type="text"
            value={explanation} // Using the renamed state variable
            onChange={(e: ChangeEvent<HTMLInputElement>) => setExplanation(e.target.value)} // Updated handler
            placeholder="Enter Explanation"
            required // Make Explanation a required field
          />
        </div>

        {/* Code Editor */}
        <div className={postStyles.field}>
          <label htmlFor="code">Code</label>
          <div className={postStyles.editorWrapper}>
            <Editor
              defaultLanguage="javascript"
              value={code}
              onChange={(val) => setCode(val ?? "")}
              theme="vs-dark" // Keep the dark theme
              options={{
                wordWrap: "on",
                wrappingIndent: "same",
                minimap: { enabled: false },
                lineNumbers: "on",
                fontSize: 14,
                scrollBeyondLastLine: false, // Prevent extra space at the end
                padding: { top: 10, bottom: 10 }, // Add some padding inside the editor
                // You can add more options here as needed
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className={postStyles.submitBtn}>
          Submit Post
        </button>
      </form>

      {/* In-page Response */}
      {responseMsg && (
        <div className={`${postStyles.responseBox} ${isSuccess === true ? postStyles.success : postStyles.error}`}>
          <pre>{responseMsg}</pre>
        </div>
      )}
    </main>
  );
}
