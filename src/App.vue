<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <multipleMediaUpload :files.sync="form" :options="{
      headers: {
        'token': ''
      },
      action: 'http://119.29.67.51:8084/statistics/adminapi/sys/upload/upload'
    }" :upload-type="['video', 'img']"/>
    <el-button @click="clickInfo">点击</el-button>
  </div>
</template>

<script>
// import multipleMediaUpload from '@/components/multipleMediaUpload/multipleMediaUpload'

export default {
  name: 'App',
  // components: {
  //   multipleMediaUpload
  // },
  data() {
    return {
      form: []
    }
  },
  watch: {
    form: {
      handler(n) {
        console.log(n)
      },
      deep: true
    }
  },
  methods: {
    clickInfo() {
      console.log("内容：", this.form)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
