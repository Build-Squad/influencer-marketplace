import { AxiosError } from 'axios';
import instance from '../api/instance';

const getService = async (url: string, params?: any) => {
  try {
    const response = await instance.get(url, { params });
    if (response.data?.isSuccess) {
      return {
        isSuccess: response?.data?.isSuccess,
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.message,
        errors: response?.data?.errors,
      };
    } else {
      return {
        isSuccess: response?.data?.isSuccess,
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.message,
        errors: response?.data?.errors,
      };
    }
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return {
        isSuccess: false,
        statusCode: e?.response?.status,
        data: null,
        message: e?.response?.data?.error,
        errors: null,
      };
    }
    return {
      isSuccess: false,
      statusCode: 500,
      data: null,
      message: "Something went wrong, please try again later",
      errors: null,
    };
  } finally {
  }
};

const postService = async (url: string, data: unknown, params?: any) => {
  try {
    const response = await instance.post(url, data, { params });
    return {
      isSuccess: response?.data?.isSuccess,
      statusCode: response?.status,
      data: response?.data,
      message: response?.data?.message,
      errors: response?.data?.errors,
    };
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return {
        isSuccess: false,
        statusCode: e?.response?.status,
        data: null,
        message: e?.response?.data?.error,
        errors: null,
      };
    }
    return {
      isSuccess: false,
      statusCode: 500,
      data: null,
      message: "Something went wrong, please try again later",
      errors: null,
    };
  }
};

const patchService = async (url: string, data: unknown, params?: any) => {
  try {
    const response = await instance.patch(url, data, { params });
    return {
      isSuccess: response?.data?.isSuccess,
      statusCode: response?.status,
      data: response?.data,
      message: response?.data?.message,
      errors: response?.data?.errors,
    };
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return {
        isSuccess: false,
        statusCode: e?.response?.status,
        data: null,
        message: e?.response?.data?.error,
        errors: null,
      };
    }
    return {
      isSuccess: false,
      statusCode: 500,
      data: null,
      message: "Something went wrong, please try again later",
      errors: null,
    };
  }
};

const deleteService = async (url: string) => {
  try {
    const response = await instance.delete(url, {
      withCredentials: true,
    });
    return {
      isSuccess: response?.data?.isSuccess,
      statusCode: response?.status,
      data: response?.data,
      message: response?.data?.message,
      errors: response?.data?.errors,
    };
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return {
        isSuccess: false,
        statusCode: e?.response?.status,
        data: null,
        message: e?.response?.data?.error,
        errors: null,
      };
    }
    return {
      isSuccess: false,
      statusCode: 500,
      data: null,
      message: "Something went wrong, please try again later",
      errors: null,
    };
  }
};

export {
  getService,
  postService,
  deleteService,
  patchService,
};
