import axios from 'axios'
export const baseUrl = 'http://127.0.0.1:8000/'
const instance = axios.create({
    //网络请求的公共配置
    timeout: 50000,//50s
    // traditional:true,  //加上此项可以传数组
})

//拦截器
//发送之前
instance.interceptors.request.use(
    config => {
        //config包含网络请求所有信息
        return config
    },
    error => Promise.reject(error)
)

// 获取数据之前
instance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default instance;
