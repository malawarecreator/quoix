"use client";
import { Analytics } from "@vercel/analytics/react"
import { useState, ChangeEvent, FormEvent } from "react";
// Assuming post.module.css is in the same directory as DeletePost.tsx
// If your CSS is one directory up, change this back to "./../post.module.css"
import postStyles from "./../page.module.css";
import axios from "axios";

// Define interface for the data we send to the API
interface DeletionRequestData {
    requestedId: string;
    reason: string;
}

// Define interface for the data we expect back from the API
interface ApiResponse {
    instertedId?: string; // Typo 'instertedId' from your API logic
    error?: string; // For error messages
}

export default function DeletePost() {
    const [requestedId, setRequestedId] = useState("");
    const [reason, setReason] = useState("");
    const [responseMsg, setResponseMsg] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // To track if the response is success or error

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setResponseMsg(null); // Clear previous message
        setIsSuccess(null); // Clear previous status

        try {
            // Send the deletion request data to the API
            const res = await axios.post<ApiResponse>("/api/delete", { requestedId, reason });

            if (res.status === 201) {
                // Use the typo 'instertedId' as per your API's response structure
                setResponseMsg(`✅ Deletion request created with ID: ${res.data.instertedId}`);
                setIsSuccess(true); // Mark as success
                // clear form on success
                setRequestedId("");
                setReason("");
            } else {
                // Handle non-201 status codes from the API
                // Axios will typically throw for 4xx/5xx, but good to have this fallback
                throw new Error(`API responded with status ${res.status}`);
            }
        } catch (err: any) {
            console.error("Submission error:", err);
            // Extract the error message from the response if available, otherwise use the generic message
            const msg = err.response?.data?.error || err.message || "An unknown error occurred.";
            setResponseMsg(`❌ Error submitting deletion request: ${msg}`);
            setIsSuccess(false); // Mark as error
        }
    };

    return (
        <main className={postStyles.postPage}> {/* Reuse postPage style */}
            <Analytics/>
            <h1 style={{ textAlign: "center", fontSize: "2.5rem" }}>
                Request Post Deletion
            </h1>

            <form onSubmit={handleSubmit} className={postStyles.postForm}> {/* Reuse postForm style */}
                {/* Post ID Input */}
                <div className={postStyles.field}> {/* Reuse field style */}
                    <label htmlFor="requestedId">Post ID to Delete</label>
                    <input
                        id="requestedId"
                        type="text"
                        value={requestedId}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestedId(e.target.value)}
                        placeholder="Enter the ID of the post to delete"
                        required // Make this field required
                    />
                </div>

                {/* Reason Input */}
                <div className={postStyles.field}> {/* Reuse field style */}
                    <label htmlFor="reason">Reason for Deletion</label>
                    <input
                        id="reason"
                        type="text"
                        value={reason}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
                        placeholder="Provide a reason for the deletion request"
                        required // Make this field required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className={postStyles.submitBtn}> {/* Reuse submitBtn style */}
                    Submit Deletion Request
                </button>
            </form>

            {/* In-page Response Message */}
            {responseMsg && (
                <div className={`${postStyles.responseBox} ${isSuccess === true ? postStyles.success : isSuccess === false ? postStyles.error : ''}`}> {/* Reuse responseBox style, add success/error classes */}
                    <pre>{responseMsg}</pre>
                </div>
            )}
        </main>
    );
}
