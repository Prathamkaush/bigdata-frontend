import api from "./admin.js";

export const fetchRecords = (params = {}) =>
  api.get("/v1/admin/records", { params });

export const countRecords = () =>
  api.get("/v1/admin/records/count");
