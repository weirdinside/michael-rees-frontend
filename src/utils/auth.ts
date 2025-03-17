import { checkResponse } from "./api";
import { baseUrl } from "./constants";

async function signIn(name: string, password: string) {
  try {
    const res = await fetch(`${baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, password }),
    });

    const responseData = await checkResponse(res);
    if (responseData.token) {
      localStorage.setItem("token", responseData.token);
    }
    return responseData;
  } catch (err) {
    console.error("Error signing in:", err);
    throw err; // rethrow so the caller can handle it
  }
}

async function register(name: string, password: string, secret: string) {
  try{
    const res = await fetch(`${baseUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, password, secret }),
    })

    const responseData = await checkResponse(res);
    return responseData;
  } catch (err) {
    console.error("Error registering user:", err)
  }
}

export { signIn, register };
