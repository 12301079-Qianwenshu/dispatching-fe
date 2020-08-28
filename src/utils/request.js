import axios from "axios"
import { convertQueryString } from './tools'
import loading from "./loading"

let loadingLayer = loading()

let request = {
    count: 0,
    timer: null,
    isOpen: true,
    width: 0, // 顶部加载进度条宽度

    // 上传数据
    post: function (uri, params, isLoading) {
        return this.send(uri, params, "post", isLoading)
    },
    // 删除数据
    delete: function (uri, isLoading) {
        return this.send(uri, null, "delete", isLoading)
    },

    // 更新数据
    put: function (uri, params, isLoading) {
        return this.send(uri, params, "put", isLoading)
    },

    // 更新数据
    patch: function (uri, params, isLoading) {
        return this.send(uri, params, "patch", isLoading)
    },

    // 获取数据
    get: function (uri, params, isLoading) {
        return this.send(uri, params, "get", isLoading)
    },

    send: function (uri, params, method, isLoading) {
        if (!(isLoading === false) && ++this.count === 1) {
            clearInterval(this.timer)
            if (this.width < 80) {
                this.timer = setInterval(() => {
                    this.width += 1
                    loadingLayer.style.width = this.width + "%"
                    if (this.width >= 80) {
                        clearInterval(this.timer)
                    }
                }, 30)
            }
        }
        switch (method) {
            case "post":
                return axios.post(uri, params).then(res => {
                    this.isStop(isLoading)
                    return res.data
                }, res => new Promise((resolve, reject) => {
                    reject(res.response.data);
                }))
            case "delete":
                return axios.delete(uri).then(res => {
                    this.isStop(isLoading)
                    return res.data
                }, res => new Promise((resolve, reject) => {
                    reject(res.response.data);
                }))
            case "put":
                return axios.put(uri, params).then(res => {
                    this.isStop(isLoading)
                    return res.data
                }, res => new Promise((resolve, reject) => {
                    reject(res.response.data);
                }))
            case "patch":
                return axios.patch(uri, params).then(res => {
                    this.isStop(isLoading)
                    return res.data
                }, res => new Promise((resolve, reject) => {
                    reject(res.response.data);
                }))
            case "get":
                return axios.get(`${uri}${convertQueryString(params)}`).then(res => {
                    this.isStop(isLoading)
                    return res.data
                }, res => new Promise((resolve, reject) => {
                    reject(res.response.data);
                }))
        }
    },

    isStop: function (isLoading) {
        if (!(isLoading === false) && --this.count === 0) {
            clearInterval(this.timer)
            this.timer = setInterval(() => {
                this.width += 5
                loadingLayer.style.width = this.width + "%"
                if (this.width >= 110) {
                    clearInterval(this.timer)
                    this.width = 0
                    loadingLayer.style.width = 0
                }
            }, 20)
        }
    }
}

// 添加请求拦截器
axios.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        config.headers['AUTHORIZATION'] = `Bearer ${window.sessionStorage.getItem("token")}`
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response;
    }, (error) => {
        // 对响应错误做点什么
        if (error.response.status == "403") {
            window.location.hash = "/login"
        }
        if (request.timer) {
            request.isStop(true)
        }
        return Promise.reject(error);
    }
);

export default request
