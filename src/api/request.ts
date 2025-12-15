import axios from "axios";
import { toast } from 'sonner'
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 10000,
});

export interface R<T> {
    code: number;
    msg: string;
    data: T
}

export function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
}

// 注入 token
request.interceptors.request.use(async config => {
    const token = import.meta.env.VITE_APP_TEST_JWT;
    if (token) {
        config.headers.Authorization = formatToken(token as string);
    }
    config.headers.ClientID = import.meta.env.VITE_GLOB_APP_CLIENT_ID;
    config.headers['Accept-Language'] = 'zh_CN';
    config.headers['Content-Language'] = 'zh_CN';
    config.headers['Content-Type'] = 'application/json'
    return config;
});

request.interceptors.response.use(response => {
    if (response.status !== 200) {
        toast.error("服务异常,请联系负责人或研发")
        return Promise.reject(response)
    }
    if(response.data.code !== 200) {
        toast.error(response.data.msg)
        return Promise.reject(response)
    }
    return response.data.data;

})

export default request;
