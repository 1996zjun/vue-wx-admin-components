<template>
  <div>
    <el-upload
      :disabled="readonly"
      :headers="options.headers"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :action="options.action"
      :file-list="files"
      :size="size"
      :accept="acceptTypes"
      :class="readonly?'isLook': ''"
      list-type="picture-card"
      multiple
    >
      <i slot="default" class="el-icon-plus"/>
      <div v-if="tips" slot="tip" class="el-upload__tip" style="text-align:center; margin-top: 5px; font-size: 13px;">{{
      tips }}
      </div>
      <div slot="file" slot-scope="{file}" style="width: 100%; height: 100%">
        <img v-if="getFileHTMLType(file.mediaUrl) ==='img'" :src="file.mediaUrl" :style="styleObject" class="preview">
        <video
          v-else-if="getFileHTMLType(file.mediaUrl) ==='video'"
          :src="file.mediaUrl"
          :style="styleObject"
          controls="controls"
          style="width: 100%; height: 50%"
          class="preview1"/>
        <audio
          v-else-if="getFileHTMLType(file.mediaUrl) ==='audio'"
          :src="file.mediaUrl"
          :style="styleObject"
          controls="controls"
          class="preview"/>

        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"/>
          </span>
          <!-- v-if="!disabled" -->
          <span
            v-if="!readonly"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"/>
          </span>
        </span>

      </div>

    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <div style="text-align: center">
        <img v-if="fileType==='img'" :src="previewFileUrl" style="width: 100%; height: 100%">
        <video v-else-if="fileType ==='video'" ref="video" :src="previewFileUrl" controls="controls" width="100%"/>
        <audio v-else-if="fileType ==='audio'" ref="audio" :src="previewFileUrl" controls="controls" width="100%"/>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'MultipleMediaUpload',
  props: {
    size: {
      type: String,
      required: false,
      default: 'mini'
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    files: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    maxFileSize: {
      type: Number,
      required: false,
      default: 1024
    },
    styleObject: {
      type: Object,
      required: false,
      default() {
        return {
          width: '146px',
          height: '146px',
          overflow: 'hidden'

        }
      }
    },
    tips: {
      type: String,
      required: false,
      default: ''
    },
    accept: {
      type: String,
      required: false,
      default: ''
    },
    uploadType: {
      type: [String, Array],
      required: false,
      default: 'img',
      validator(val) {
        const arr = []

        if (Object.prototype.toString.call(val) !== '[object Array]') {
          arr.push(val)
        }

        return arr.every(() => ['img', 'video', 'audio'].indexOf(val) !== -1)
      }
    },
    options: {
      type: Object
    }
  },

  data() {
    return {
      headers: {
        'token': ''
      },
      previewFileUrl: '',
      dialogVisible: false,
      disabled: false,
      fileType: '',
      uploadFileApi: process.env.BASE_API + '/adminapi/sys/upload/upload'
    }
  },

  computed: {
    acceptTypes() {
      if (!this.accept) {
        let uploadTypeArr = []
        const uploadIMMETypeArr = []

        if (Object.prototype.toString.call(this.uploadType) !== '[object Array]') {
          uploadTypeArr.push(this.uploadType)
        } else {
          uploadTypeArr = this.uploadType
        }

        uploadTypeArr.forEach(item => {
          if (item === 'img') {
            uploadIMMETypeArr.push('image/*')
          } else if (item === 'video') {
            uploadIMMETypeArr.push('video/*')
          } else if (item === 'audio') {
            uploadIMMETypeArr.push('audio/*')
          }
        })

        return uploadIMMETypeArr.join(',')
      }

      return this.accept
    }

  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) {
        if (this.$refs.video) {
          this.$refs.video.pause()
        }

        if (this.$refs.audio) {
          this.$refs.audio.pause()
        }
      }
    }
  },
  methods: {
    /**
     * 上传前
     *
     * @param file
     */
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024

      if (fileSize > this.maxFileSize) {
        this.$myErrorNotify(`文件大小不能超过${this.maxFileSize}MB`)
        return false
      }
      // this.fileType = this.$myUtils.getFileUploadHTMLTypeByMIME(file.type)
    },

    /**
     * 图片上传成功
     *
     * @param response
     * @param file
     * @param fileList
     */
    handleSuccess(response, file, fileList) {
      // debugger
      if (response && response.code === 200) {
        // this.files.push({ name: file.name, url: response.data.url, uid: response.data })
        this.files.push({ name: file.name, mediaType: file.raw.type, mediaUrl: response.data.url, uid: file.uid })
      } else {
        console.error('上传失败', response)
        this.$myErrorNotify('上传失败')
      }
    },

    /**
     * 上传失败
     *
     * @param e
     * @param file
     */
    handleError(e, file) {
      this.$myErrorNotify(JSON.parse(e.message))
      this.loading = false
    },

    /**
     * 删除
     * @param file
     */
    handleRemove(file) {
      // debugger
      this.files.splice(this.files.findIndex(item => item.uid === file.uid), 1)
    },

    /**
     * 预览
     * @param file
     */
    handlePreview(file) {
      this.previewFileUrl = file.mediaUrl

      this.fileType = this.$myUtils.getFileUploadHTMLTypeByExtension(this.previewFileUrl.substring(this.previewFileUrl.lastIndexOf('.') + 1))
      this.dialogVisible = true
    },

    /**
     * 获取文件HTML类型(img, video, audio)
     * @param fileUrl
     * @returns {string}
     */
    getFileHTMLType(fileUrl) {
      if (!fileUrl) return ''
      return this.$myUtils.getFileUploadHTMLTypeByExtension(fileUrl.substring(fileUrl.lastIndexOf('.') + 1))
    }

  }
}
</script>
<style>
.preview {
  height: 100% !important;
  width: 100% !important;
}
.preview1 {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}
.isLook .el-upload--picture-card {
  display: none !important;
}
</style>
