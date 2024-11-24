import { baseUrl } from "./constants";

export function checkResponse(res) {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
}

export function getProjects() {
  return fetch(`${baseUrl}/portfolio`).then((res) => {
    return checkResponse(res);
  });
}

export async function addProject(title: string, showTitle: boolean, link: string, role: string, thumbnail?: string) {
  console.log(title, showTitle, link, role, thumbnail);
  try {
    const res = fetch(`${baseUrl}/portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, showTitle, link, role, thumbnail }),
    });
    const responseData = await checkResponse(res);
    return responseData;
  } catch (err) {
    console.error("Error adding project:", err);
  }
}

export async function uploadThumbnail(file: File) {
  if (!file) {
    console.error("No file selected for upload");
    return;
  }
  console.log(file);
  const formData = new FormData();
  formData.append("file", file);
  console.log(formData);

  try {
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      console.log(result.filePath)
      return result.filePath;
    } else {
      console.error("failed to upload file:", res.statusText);
    }
  } catch (error) {
    console.error("an error happened in uploadThumbnail", error);
  }
}
