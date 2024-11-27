import { baseUrl } from "./constants";

export function checkResponse(res: Response) {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
}

export function getSiteData() {
  return fetch(`${baseUrl}/data`).then((res) => {
    return checkResponse(res);
  });
}

export function setSiteData(order: ProjectInfo[], lastEdited: string) {
  return fetch(`${baseUrl}/data`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ order, lastEdited }),
  });
}

export function getProjects() {
  return fetch(`${baseUrl}/portfolio`).then((res) => {
    return checkResponse(res);
  });
}

export async function addProject(
  title: string,
  showTitle: boolean,
  link: string,
  role: string,
  thumbnail?: string,
) {
  console.log(title, showTitle, link, role, thumbnail);
  try {
    const res = await fetch(`${baseUrl}/portfolio`, {
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

export async function editProject(
  _id: string,
  title: string,
  showTitle: boolean,
  link: string,
  role: string,
  thumbnail: string | undefined,
) {
  try {
    const res = await fetch(`${baseUrl}/portfolio/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ _id, title, showTitle, link, role, thumbnail }),
    });
    const responseData = await checkResponse(res);
    return responseData;
  } catch (err) {
    console.error(err);
  }
}

export async function deleteThumbnail(filename: string) {
  const newFilename = filename.replace("thumbnails/", "");
  try {
    const res = await fetch(`${baseUrl}/api/delete/${newFilename}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const responseData = await checkResponse(res);
    console.log(responseData);
    return responseData;
  } catch (err) {
    console.error("Error deleting image from storage:", err);
  }
}

export async function deleteProject(id: string) {
  console.log(id);
  try {
    const res = await fetch(`${baseUrl}/portfolio/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const responseData = await checkResponse(res);
    return responseData;
  } catch (err) {
    console.error("Error deleting project:", err);
  }
}

export async function uploadThumbnail(file: File) {
  if (!file) {
    console.error("No file selected for upload");
    return;
  }

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
      console.log(result.filePath);
      return result.filePath;
    } else {
      console.error("failed to upload file:", res.statusText);
    }
  } catch (error) {
    console.error("an error happened in uploadThumbnail", error);
  }
}
