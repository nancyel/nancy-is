import { Octokit } from "@octokit/core";
import type { APIRoute } from "astro";

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const date = data.get("date");
    const time = data.get("time");
    const text = data.get("text");

    if (!date || !time || !text) {
      return new Response("Missing required fields", { status: 400 });
    }

    const dateTime = `${date} ${time}:00+09:00`;
    const fileName = `${date}.md`;
    const fileContent = `---
date: ${dateTime}
---

${text}
`;

    const owner = import.meta.env.GITHUB_USERNAME || "your-username";
    const repo = import.meta.env.GITHUB_REPO || "your-repo";
    const branch = "main";
    const path = `src\/content\/now\/${fileName}`;
    const message = `Create ${fileName}`;
    const content = Buffer.from(fileContent).toString("base64");

    // Check if the file exists and retrieve its SHA
    let sha;
    try {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner,
          repo,
          path,
        }
      );

      // Ensure the response is a single file, not an array or other type
      if (Array.isArray(response.data)) {
        throw new Error(`Path is a directory, expected a file at ${path}`);
      }

      if (response.data && response.data.type === "file") {
        sha = response.data.sha; // File exists, get its SHA for updating
      } else {
        throw new Error(
          `Unexpected content type at ${path}: ${response.data.type}`
        );
      }
    } catch (error: any) {
      if (error.status !== 404) {
        throw error; // Only ignore 404 errors (file not found)
      }
    }
    // Create or update the file
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
      message,
      content,
      branch,
      sha, // Include SHA only if updating an existing file
    });

    return new Response("File committed successfully", { status: 200 });
  } catch (error) {
    console.error("Error committing file:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
