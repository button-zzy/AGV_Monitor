<script setup>
import {zhCN, dateZhCN} from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <router-view/>
  </n-config-provider>
</template>

<style>
#app {
  display: block;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.n-config-provider {
  width: 100%;
  height: 100%;
}
</style>
