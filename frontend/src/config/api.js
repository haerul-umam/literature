import axios from "axios";

export const API = axios.create({
  baseURL: "http://127.0.0.1:3333/api/v1/",
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export const download = (url, filename) => {
  axios({
    url: url,
    method: "GET",
    responseType: "blob"
  }).then(response => {
    const data = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = data
    link.setAttribute("download", filename+".pdf")
    document.body.appendChild(link)
    link.click()
  })
}

