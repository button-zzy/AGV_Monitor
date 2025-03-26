<script setup>
import logo from '@/assets/img/logo.png';
import {onMounted, ref, watch} from "vue";
import {PersonOutline, LockClosedOutline, Close} from '@vicons/ionicons5'
import {mapInfoStore, useUserInfoStore} from "@/store/Store.js";
import bgLoginLeft from '@/assets/img/bg-login-left.png';
import bgLoginRight from '@/assets/img/bg-login-right.png';


onMounted(()=>{
  useUserInfoStore().loginMsg = ''
})

const formRef = ref(null);
const loginForm = ref({account: "admin", password: "admin"})
const rules = ref({
  account: {
    required: true,
    message: "请输入用户名",
    trigger: "blur"
  },
  password: {
    required: true,
    message: "请输入密码",
    trigger: "blur"
  }
})

// 点击登录
function SignIn(e) {
  useUserInfoStore().loginMsg = ''
  if (mapInfoStore().logLoading) return
  e.preventDefault()
  formRef.value?.validate(async (err) => {
    if (!err) {
      mapInfoStore().logLoading = true;
      useUserInfoStore().login(loginForm.value)
    } else {
      console.log(formRef.value?.validate);
    }
  })
}

watch(()=>loginForm.value.account, ()=>{
  useUserInfoStore().loginMsg = ''
})

watch(()=>loginForm.value.password, ()=>{
  useUserInfoStore().loginMsg = ''
})

// function closeWindow() {
//   window.electronAPI.closeWindow();
// }
</script>

<template>
  <div class="container">
    <div class="login_wrapper"
         :style="{ '--bg-image-left': `url(${bgLoginLeft})`,'--bg-image-right': `url(${bgLoginRight})`}">
      <n-layout class="layout">
        <n-layout-header>
<!--          <n-icon class="layout_header_close_btn_button" :size="20" @click="closeWindow"-->
<!--                  style="cursor:pointer;-webkit-app-region: no-drag">-->
<!--            <Close/>-->
<!--          </n-icon>-->
        </n-layout-header>
        <n-layout-content>
          <div class="form_wrapper">
            <div class="logo_wrapper">
              <n-image class="logo" :src="logo"/>
            </div>
            <div class="logo_text">Admin Plus 企业级中后台前端解决方案</div>
            <div class="loginForm_wrapper">
              <n-form style="text-align: left;-webkit-app-region: no-drag" ref="formRef" label-placement="left" :model="loginForm" :rules="rules"
                      size="large" class="form">
                <n-form-item path="account" style="margin-top: 40px">
                  <n-input v-model:value="loginForm.account" placeholder="请输入用户名">
                    <template #prefix>
                      <n-icon>
                        <PersonOutline/>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <n-form-item path="password">
                  <n-input type="password" v-model:value="loginForm.password" show-password-on="mousedown"
                           placeholder="请输入密码">
                    <template #prefix>
                      <n-icon>
                        <LockClosedOutline/>
                      </n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                <span v-if="useUserInfoStore().loginMsg" style="color: #e70000">{{useUserInfoStore().loginMsg}}</span>
                <n-form-item>
                  <n-button type="info" style="width: 100%" @click="SignIn" :loading="mapInfoStore().logLoading">
                    登录
                  </n-button>
                </n-form-item>
              </n-form>
            </div>
          </div>
        </n-layout-content>
        <n-layout-footer>
          <div class="footer_wrapper">
            <!--            <div class="footer_link">-->
            <!--              <a class="item" href="https://www.iviewui.com" target="_blank" title="官网">&lt;!&ndash;&ndash;&gt; 官网</a>-->
            <!--              <a class="item" href="https://dev.iviewui.com" target="_blank" title="社区">&lt;!&ndash;&ndash;&gt; 社区</a>-->
            <!--              <a class="item" href="https://www.iviewui.com/admin-plus" target="_blank" title="Admin Plus">&lt;!&ndash;&ndash;&gt; Admin-->
            <!--                Plus</a>-->
            <!--            </div>-->
            <div class="footer_text">
              Copyright © 2024 View Design All Rights Reserved
            </div>
          </div>
        </n-layout-footer>
      </n-layout>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}

.login_wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  -webkit-app-region: drag; /* 使该区域可拖动 */
  user-select: none; /* 禁止选中文本 */
}

*, :after, :before {
  box-sizing: border-box;
}

.login_wrapper:after, .login_wrapper:before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: -1;
  background-position: bottom;
  background-size: cover;
  background-color: rgb(247, 247, 247);
}

.login_wrapper:after {
  left: 50%;
  right: 0;
  background-image: var(--bg-image-right);
}

.login_wrapper:before {
  left: 0;
  right: 50%;
  background-image: var(--bg-image-left);
}

.n-layout {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-color: transparent;
}

.n-layout-header {
  width: 100%;
  height: 60px;
  position: absolute;
  top: 0;
  z-index: 999;
  background-color: transparent;
}

.layout_header_close_btn_button{
  float: right;
  margin-top: 20px;
  margin-right: 20px;
}

.layout_header_close_btn_button:hover {
  border-radius: 50%;
  background-color: rgba(51, 61, 87, .5);
}

.n-layout-content {
  width: 100%;
  height: 100%;
  padding: 60px 20px 100px;
  box-sizing: border-box;
}

:deep(.n-layout-scroll-container) {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.form_wrapper {
  width: 480px;
}

.logo_wrapper {
  width: 100%;
  height: 81px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.logo {
  width: 300px;
}

.logo_text {
  width: 100%;
  height: 21px;
  font-size: 14px;
  color: #808695;;
}

.loginForm_wrapper {
  width: 80%;
  margin: 0 auto;
}

:deep(.n-input-wrapper) {
  padding: 0;
  position: relative;
}

:deep(.n-input__prefix) {
  position: absolute;
  left: 0;
  z-index: 999;
  width: 32px;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}

:deep(.n-input__suffix) {
  position: absolute;
  right: 0;
  z-index: 999;
  width: 32px;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}

:deep(.n-input__input-el) {
  width: 100%;
  box-sizing: border-box;
  padding-left: 32px;
}

:deep(.n-input__placeholder) {
  width: 100%;
  box-sizing: border-box;
  padding-left: 32px;
}

:deep(.n-input .n-input--resizable .n-input--stateful) {
  --n-color: rgb(232, 240, 254);
}


.n-layout-footer {
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: 0;
  background-color: transparent;
  z-index: 999;
  box-sizing: border-box;
}

.footer_wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.footer_link {
  width: 400px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.item {
  cursor: pointer;
  color: #808695;
  margin-right: 40px;
}

.footer_text {
  margin-top: 8px;
  color: #808695;
}
</style>
