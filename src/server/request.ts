import axios from "axios";

const service = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

export const addUser = (data: any) =>
  service.post("/user", data).then((res) => res.data);

export const getList = (data: any) =>
  service.get("/user", { params: data }).then((res) => res.data);

export const delUser = (data: any) =>
  service.delete(`/user/${data.id}`).then((res) => res.data);
export const updateUser = (data: any) =>
  service.patch(`/user/${data.id}`, data).then((res) => res.data);
export const addTags = (data: any) => {
  service.post("/user/add/tags", data).then((res) => {
    res.data;
  });
};
