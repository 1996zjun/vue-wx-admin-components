<template>

  <div>
    <el-upload
      :on-preview="handlePictureCardPreview"
      :headers="options.headers"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-error="handleError"
      :action="options.action"
      :file-list="imgs"
      :accept="accept"
      :size="size"
      :class="readonly?'isLook': ''"
      list-type="picture-card">
      <div v-if="tips" slot="tip" class="el-upload__tip" style="text-align:center; margin-top: 5px; font-size: 13px;">{{
      tips }}
      </div>
      <i class="el-icon-plus"/>
      <div slot="file" slot-scope="{file}" style="width: 100%; height: 100%">
        <img :src="file.mediaUrl" class="preview">
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
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
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" width="500px" size="mini">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'MultipleImageUpload',
  props: {
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    imgs: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    accept: {
      type: String,
      required: false,
      default: 'image/gif,image/jpeg,image/jpg,image/bmp,image/png'
    },
    size: {
      type: String,
      required: false,
      default: 'mini'
    },
    tips: {
      type: String,
      required: false,
      default: ''
    },
    options: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false, dialogImageUrl: '',
      headers: {
        'token': ''
      },
      imagesUploadApi: process.env.BASE_API + '/adminapi/sys/upload/upload'
    }
  },
  methods: {
    /**
     * 删除图片
     *
     * @param file
     * @param fileList
     */
    handleRemove(file, fileList) {
      this.imgs.splice(this.imgs.findIndex(item => item.uid === file.uid), 1)
    },
    /**
     * 显示图片大图
     *
     * @param file
     */
    handlePictureCardPreview(file) {
      console.log('file: ', file)
      this.dialogImageUrl = file.mediaUrl
      this.dialogVisible = true
    },

    /**
     * 图片上传成功
     *
     * @param response
     * @param file
     * @param fileList
     */
    handleSuccess(response, file, fileList) {
      if (response && response.code === 200) {
        this.imgs.push({ name: file.name, mediaType: file.raw.type, mediaUrl: response.data.url })
        // console.log(this.imgs)
        this.$emit('update:imgs', this.imgs)
      } else {
        console.error('上传失败', response.data)
        this.$myErrorNotify('上传失败')
      }
    },

    /**
     * 图片上传失败
     *
     * @param e
     * @param file
     */
    handleError(e, file) {
      this.$myErrorNotify(JSON.parse(e.message))
    }
  }
}
</script>

<style>
.isLook .el-upload--picture-card {
  display: none !important;
}
</style>
