import { baseUrl } from "./constants";

export async function checkResponse(res: Response) {
  return res.ok ? await res.json() : Promise.reject(`Error: ${res.status}`);
}

export async function getSiteData() {
  const res = await fetch(`${baseUrl}/data`);
  return await checkResponse(res);
}

export function setSiteData({
  order,
  personalWorkOrder,
  clientWorkOrder,
  lastEdited,
  homeClientList,
  veronikaVideos,
}: {
  order?: ProjectInfo[];
  personalWorkOrder?: ProjectInfo[];
  clientWorkOrder?: ProjectInfo[];
  lastEdited: string;
  homeClientList?: string[];
  veronikaVideos?: string[];
}) {
  return fetch(`${baseUrl}/data`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      order,
      personalWorkOrder,
      clientWorkOrder,
      lastEdited,
      homeClientList,
      veronikaVideos,
    }),
  });
}

export function getProjects() {
  return fetch(`${baseUrl}/portfolio`).then((res) => {
    return checkResponse(res);
  });
}

export async function addProject({
  category,
  description,
  title,
  link,
  role,
  thumbnail,
}: {
  category: string;
  description: string;
  title: string;
  link: string;
  role: string;
  thumbnail?: string;
}) {
  try {
    const res = await fetch(`${baseUrl}/portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        category,
        description,
        title,
        link,
        role,
        thumbnail,
      }),
    });
    const responseData = await checkResponse(res);
    return responseData;
  } catch (err) {
    console.error("Error adding project:", err);
  }
}

export async function editProject({
  description,
  category,
  _id,
  title,
  link,
  role,
  thumbnail,
}: {
  description: string;
  category: string;
  _id: string;
  title: string;
  link: string;
  role: string;
  thumbnail: string | undefined;
}) {
  try {
    const res = await fetch(`${baseUrl}/portfolio/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        category,
        description,
        _id,
        title,
        link,
        role,
        thumbnail,
      }),
    });
    console.log(res);
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
