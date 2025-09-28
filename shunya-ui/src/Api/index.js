import { toast } from "react-toastify";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api/";
axios.defaults.headers.post["Content-Type"] = "application/json";
/* axios.defaults.withCredentials = true; */


export const apiRequests = {
  postRequestWithNoToken: async (URL, requestData) => {
    try {
      const response = await axios.post(URL, requestData);
      // return response.data;
      return response.data;
    } catch (err) {
      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },
 
  getRequest: async (URL) => {
    try {
      const response = await axios({
        method: "GET",
        url: URL,
        data: {},
        headers: {
          Authorization : `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
 
      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }
 
      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  }, 
 
  postRequest: async (URL, requestData = {}) => {
    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: requestData,
        headers: {
          Authorization : `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
 
      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }
 
      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },
 
 
  putRequest: async (URL, requestData) => {
    try {
      const response = await axios({
        method: "PUT",
        url: URL,
        data: requestData,
        headers: {
          authorization: process.env.REACT_APP_Authorization,
          accesstoken: localStorage?.getItem("token"),
          token1: localStorage?.getItem("token1"),
          token2: localStorage?.getItem("token2"),
          buyer_id: localStorage?.getItem("buyer_id"),
          supplier_id: localStorage?.getItem("supplier_id"),
          admin_id: localStorage?.getItem("admin_id"),
          "Content-Type": "application/json",
          usertype: localStorage?.getItem("buyer_id")
            ? "Buyer"
            : localStorage?.getItem("supplier_id")
            ? "Supplier"
            : localStorage?.getItem("admin_id")
            ? "Admin"
            : localStorage?.getItem("seller_id")
            ? "Seller"
            : undefined,
        },
      });
 
      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }
 
      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },
 
  deleteRequest: async (URL) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: URL,
        headers: {
          authorization: process.env.REACT_APP_Authorization,
          accesstoken: localStorage?.getItem("token"),
          token1: localStorage?.getItem("token1"),
          token2: localStorage?.getItem("token2"),
          buyer_id: localStorage?.getItem("buyer_id"),
          supplier_id: localStorage?.getItem("supplier_id"),
          admin_id: localStorage?.getItem("admin_id"),
          "Content-Type": "application/json",
          usertype: localStorage?.getItem("buyer_id")
            ? "Buyer"
            : localStorage?.getItem("supplier_id")
            ? "Supplier"
            : localStorage?.getItem("admin_id")
            ? "Admin"
            : localStorage?.getItem("seller_id")
            ? "Seller"
            : undefined,
        },
      });
 
      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          localStorage?.clear();
          window?.location?.reload();
          return;
        }, 1000);
      }
 
      return {
        code: err?.response?.status || 500,
        message: err?.response?.data?.message,
      };
    }
  },
};