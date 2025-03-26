import { defineStore } from 'pinia';
import { ref } from 'vue';
import {Login, queryMapData, queryMapList} from "@/axios/api.js";
import router from "@/router/router.js";
// import { ipcRenderer } from 'electron';

// 持久化配置单独定义，便于管理和扩展
// const persistConfig = {
//     enabled: true,
//     key: 'user',
//     storage: sessionStorage,
// };

export const useUserInfoStore = defineStore('userInfo', () => {
    // 定义状态
    let account = ref('');
    let auth = ref('');
    let data = ref({});
    let loginMsg = ref('');
    let loginTime = ref(0);

    // 定义登录方法
    function login(userData) {
        Login(userData).then((res)=>{
            account.value = res.data.account;
            loginTime.value = new Date().getTime()
            // 获取地图列表
            queryMapList().then((res)=>{
                mapInfoStore().mapList = res.data
                // 登录成功后获取地图数据
                queryMapData({fileName: mapInfoStore().mapList[1]}).then((res)=>{
                    mapInfoStore().mapData = res.data['PointInfo']
                    router.push('/home').then(()=>{
                        window.electronAPI.loginSuccess();
                    })
                    mapInfoStore().logLoading = false
                });
            })
        }).catch((err)=>{
            // 登录失败
            loginMsg.value = err['msg']
        })
    }

    // 定义登出方法
    function logout() {
        account.value = '';
        auth.value = '';
        data.value = {};
        loginTime.value = 0;
        router.push('/login').then(()=>{
            window.electronAPI.signOut()
        });
    }

    // 返回状态和方法
    return {
        account,
        auth,
        data,
        loginMsg,
        loginTime,
        login,
        logout,
    };
}, {
    // 使用持久化配置
    persist: true,
});

export const mapInfoStore = defineStore('mapInfoStore', () => {
    const logLoading = ref(false);      // 登录加载状态
    const mapData = ref([]);
    const mapList = ref([]);
    return {
        logLoading,
        mapData,
        mapList
    };
}, {
    // 使用持久化配置
    persist: true,
});

export const screenInfoStore = defineStore('ScreenInfoStore', () => {
    const width = ref(480);
    const height = ref(480);
    const minWidth = ref(1050);
    const minHeight = ref(770);
    const fullScreen = ref(false);
    return{
        width,height,minHeight,minWidth,fullScreen
    }
})
