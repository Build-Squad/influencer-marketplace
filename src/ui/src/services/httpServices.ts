import { AxiosError } from 'axios';
import instance from '../api/instance';

const getService = async (url: string, params?: any) => {
  try {
    const response = await instance.get(url, { params });
    if (response.status === 200) {
      return {
        isSuccess: response?.status === 200,
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.error,
      };
    } else {
      return {
        isSuccess: false,
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.error,
      };
    }
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return {
        isSuccess: false,
        statusCode: e?.response?.status,
        data: null,
        message: e?.response?.data?.error,
      };
    }
    return {
      isSuccess: false,
      statusCode: 500,
      data: null,
      message: 'Something went wrong, please try again later',
    };
  } finally {
  }
};

const postService = async (url: string, data: unknown, params?: any) => {
  try {
    const response = await instance.post(url, data, { params });
    if (response.status === 200 || response.status === 204) {
      return {
        isSuccess: response?.status === 200 || response.status === 204,
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.error,
      };
    } else {
      if (response instanceof AxiosError) {
        return {
          isSuccess: false,
          statusCode: response?.response?.status,
          data: null,
          message: response?.response?.data?.error,
        };
      }
      return {
        isSuccess: response?.status === 200,
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.error,
      };
    }
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return {
        isSuccess: false,
        statusCode: e?.response?.status,
        data: null,
        message: e?.response?.data?.error,
      };
    }
    return {
      isSuccess: false,
      statusCode: 500,
      data: null,
      message: 'Something went wrong, please try again later',
    };
  } finally {
  }
};

const patchService = async (url: string, data: unknown, params?: any) => {
  try {
    const response = await instance.patch(url, data, { params });
    if (response.status === 200) {
      return {
        isSuccess: response?.status === 200,
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.error,
      };
    } else {
      if (response instanceof AxiosError) {
        return {
          isSuccess: false,
          statusCode: response?.response?.status,
          data: null,
          message: response?.response?.data?.error,
        };
      }
      return {
        isSuccess: response?.status === 200,
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.error,
      };
    }
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return {
        isSuccess: false,
        statusCode: e?.response?.status,
        data: null,
        message: e?.response?.data?.error,
      };
    }
    return {
      isSuccess: false,
      statusCode: 500,
      data: null,
      message: 'Something went wrong, please try again later',
    };
  } finally {
  }
};

const deleteService = async (url: string) => {
  try {
    const response = await instance.delete(url, {
      withCredentials: true,
    });
    if (response.status.toString().startsWith('2')) {
      return {
        isSuccess: response.status.toString().startsWith('2'),
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.error,
      };
    } else {
      return {
        isSuccess: false,
        statusCode: response?.status,
        data: response?.data,
        message: response?.data?.error,
      };
    }
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return {
        isSuccess: false,
        statusCode: e?.response?.status,
        data: null,
        message: e?.response?.data?.error,
      };
    }
    return {
      isSuccess: false,
      statusCode: 500,
      data: null,
      message: 'Something went wrong, please try again later',
    };
  } finally {
  }
};

export {
  getService,
  postService,
  deleteService,
  patchService,
};
