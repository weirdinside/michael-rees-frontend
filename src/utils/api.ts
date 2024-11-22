export function checkResponse(res){
    return (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
}

export function getProjects() {
    return fetch(`${baseUrl}/portfolio`).then((res) => {
      return checkResponse(res);
    });
  }