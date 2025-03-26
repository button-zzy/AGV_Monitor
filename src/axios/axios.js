// 对axios进行二次封装
import axios from 'axios'
import {mapInfoStore} from "@/store/Store.js";
// 1.利用axios对象的方法create，去创建一个axios实例
// 2.request就是axios，只不过稍微配置一下
const requests = axios.create({
    //配置对象
    baseURL: '',
    async: true,
    timeout: 5000,
});
// 请求拦截器：在发请求之前请求拦截器可以检测到，并在请求发送出去之前做一些事情
requests.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

requests.interceptors.request.use((config) => {
    // config：配置对象，对象里面有一个属性比较重要，header请求头
    return config
});
// 响应拦截器
requests.interceptors.response.use((res) => {
    const data = res.data
    const isJson = (res.headers['content-type'] || '').includes('json')
    // 返回值是JSON格式
    if (isJson) {
        if (data.status === 200) {
            return Promise.resolve(data)
        } else {
            mapInfoStore().logLoading = false
            return Promise.reject(data)
        }
    } else {
        mapInfoStore().logLoading = false
        return Promise.reject(data)
    }
}, err => {
    mapInfoStore().logLoading = false
    // 没得到回应
    return Promise.reject(err)
});



export default requests


// // 封装请求方法
// export const getRequest = async (url, params = {}, config = {}) => {
//     try {
//         return await requests.get(url, {params, ...config});
//     } catch (error) {
//         throw error;
//     }
// };
//
// export const postRequest = async (url, data = {}, config = {}) => {
//     try {
//         return await requests.post(url, data, {...config});
//     } catch (error) {
//         throw error;
//     }
// };
// import {getRequest} from "@/axios/axios";
// const queryMapList = async () => {
//     const data1 = await getRequest('http://localhost:8000/api/map/queryMapList');
//     console.log('Data from endpoint1:', data1);
//
//     const data2 = await getRequest('http://localhost:8000/api/map/getMapData', { fileName: 'map2.xml' });
//     console.log('Data from endpoint2:', data2);
// };
// queryMapList()