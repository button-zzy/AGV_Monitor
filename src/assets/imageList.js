// import {ref} from "vue";
//
// const imageList = ref({});
// const AGVContext = import.meta.glob('@/assets/AGV/*.{png,gif}');
// const imgContext = import.meta.glob('@/assets/img/*.{png,gif}');
//
// for (const path in AGVContext) {
//     const fileName = path.split('/').pop().split('.')[0]; // 获取文件名（不含扩展名）
//     AGVContext[path]().then((module) => {
//         imageList.value[fileName] = module.default;
//     });
// }
// for (const path in imgContext) {
//     const fileName = path.split('/').pop().split('.')[0]; // 获取文件名（不含扩展名）
//     imgContext[path]().then((module) => {
//         imageList.value[fileName] = module.default;
//     });
// }
//
// // for (let key in imageList.value) {
// //     console.log(`export const ${key} = '${imageList.value[key]}';`);
// // }
// Object.entries(imageList.value).forEach(([key, value]) => {
//     console.log(`export const ${key} = '${value}';`);
// });

export const alarm = '/src/assets/AGV/alarm.gif';
export const element_10 = '/src/assets/AGV/element_10.png'
;export const element_11 = '/src/assets/AGV/element_11.png';
export const element_13 = '/src/assets/AGV/element_13.png';
export const element_15 = '/src/assets/AGV/element_15.png';
export const element_16 = '/src/assets/AGV/element_16.png';
export const element_19 = '/src/assets/AGV/element_19.png';
export const element_21 = '/src/assets/AGV/element_21.png';
export const offline = '/src/assets/AGV/offline.png';
export const online = '/src/assets/AGV/online.png';
export const bgLoginLeft = '/src/assets/img/bg-login-left.png';
export const bgLoginRight = '/src/assets/img/bg-login-right.png';
export const logoDark =' /src/assets/img/logo-dark.png';
export const logoSmall = '/src/assets/img/logo-small.png';
export const logo = '/src/assets/img/logo.png'


