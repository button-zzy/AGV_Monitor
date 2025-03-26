import requests from "@/axios/axios";

let basUrl = 'http://39.100.181.26:7000'
// let basUrl = 'http://localhost:8000'
export const Login = (data) => {
    let url = basUrl +  '/api/user/signIn'
    return requests({url: url, params: data, method: 'get'})
}
export const Register = (data)=>{
    let url = basUrl + '/api/user/register'
    return requests({url: url, params: data, method: 'post'})
}

export const queryMapData = (data)=>{
    let url = basUrl + '/api/map/getMapData'
    return requests({url: url, params: data, method: 'get'})
}

export const queryMapList = (data)=>{
    let url = basUrl + '/api/map/queryMapList'
    return requests({url: url, params: data, method: 'get'})
}
