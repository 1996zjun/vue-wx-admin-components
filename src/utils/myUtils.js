/**
 *
 * 公共工具类, 每个vue组件都可以直接使用
 */

const myUtils = {
  // 测试方法
  myUtilsDemo() {
    alert('common myUtils')
  },

  /**
   * 关闭当前激活路由
   *
   * @param context 当前this
   * @param toPath 需要跳转到的路由，不填的话就返回上一个路由相当于回退
   */
  closeCurrentTabAndGoTo(context, toPath) {
    context.$store.dispatch('delView', { path: context.$route.path }).then(({ visitedViews }) => {
      if (toPath) {
        context.$router.push(toPath)
      } else {
        context.$router.go(-1)
      }
    })
  },

  /**
   * 删除children属性
   *
   * @param obj
   * @param key
   * @returns {*}
   */
  deleteNullChildren(obj) {
    if (!obj) {
      return obj
    }
    if (typeof obj !== 'object') {
      return obj
    }
    if (!obj.children || !obj.children.length) {
      // children 为null 或者为[]
      delete obj.children
    } else {
      obj.children.forEach(item => this.deleteNullChildren(item))
    }
    return obj
  },

  /**
   * 获取当前时间
   * @returns "yyyy-MM-dd HH:mm:ss"
   */
  nowCreated() {
    var aData = new Date()
    const nowDate = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate() + ' ' + (aData.getHours() + 1) + ':' + (aData.getMinutes() + 1) + ':' + (aData.getSeconds() + 1)
    return nowDate
  },

  /**
   * 根据文件MIME类型获取html标签类型
   * @param file
   * @returns {string}
   */
  getFileUploadHTMLTypeByMIME(fileType) {
    let uploadType = ''
    if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(fileType) > -1) {
      uploadType = 'video'
    } else if (['image/png', 'image/gif', 'image/jpg', 'image/jpeg'].indexOf(fileType) > -1) {
      uploadType = 'img'
    } else if (['audio/midi', 'audio/mp3'].indexOf(fileType) > -1) {
      uploadType = 'audio'
    }

    return uploadType
  },

  /**
   * 根据文件后缀获取html标签类型
   * @param file
   * @returns {string}
   */
  getFileUploadHTMLTypeByExtension(extension) {
    let uploadType = ''
    if (['mp4', 'ogg', 'flv', 'avi', 'wmv', 'rmvb', 'mov'].indexOf(extension) > -1) {
      uploadType = 'video'
    } else if (['png', 'PNG', 'gif', 'GIF', 'jpg', 'JPG', 'jpeg', 'JPEG'].indexOf(extension) > -1) {
      uploadType = 'img'
    } else if (['midi', 'mp3'].indexOf(extension) > -1) {
      uploadType = 'audio'
    }

    return uploadType
  }
}
export default myUtils
