<script setup>
import { ref} from 'vue'
import {imageUploadService} from '../services/ImageUploadService.js'

const uploadData = ref({
  file: null,
  previewURL: ''
})


async function selectFile(event){
  try {
    const file = event.target.files[0]
    console.log(file);
    uploadData.value.previewURL = URL.createObjectURL(file)
    uploadData.value.file = file
  } catch (error) {
    console.error(error)
  }
}

async function uploadFile(){
  try {
    console.log("uploading", uploadData.value.file);
    await imageUploadService.uploadImage(uploadData.value.file)
  } catch (error) {
    console.error(error)
  }
}


</script>

<template>
  <div class="home flex-grow-1 d-flex flex-column align-items-center justify-content-center">
  <div>
    AWS Image upload Demo
    <div class="blurry-img">
      <img  src="data:image/webp;base64,UklGRvgAAABXRUJQVlA4TOsAAAAvIkAGAD+gJgAShosA4Kxl/xK2URIADRsugcThkGvwQ0wtJEmQwEavxNmcP8alVzX/0Zi4Qz4JyrQR/3W5ALm23bgNnGktOMPa/MqwJr+jBoCTNMDsZ6YDq/8jE2whov8ToKoKoJDmH9vrTQKeNzX0dZPIkOKrPY58L++vZUBbOxaaRxLWZUT3pxeMXJyeNzW0HkDGvtcDysDXfy6ke6TdZMIsJlOZs3ntfTWRTNA9lvIcuxGZEmleOyoiMhXSvbcTkQeQ5rWjIp93KKR7T1VngLRAOmoCCs2vOu0x7zeM8O2c9fRzwZDqOV4BAA==" alt="">
    </div>
  </div>
      <form @submit.prevent="uploadFile">
        <div class="mb-3">
          <img class="preview-img" :src="uploadData.previewURL" alt="">
          <label for="">Image To Upload</label>
          <input @change="selectFile" name="files" type="file" multiple="false" accept="image/*" class="form-control">
          <button class="btn btn-primary">Upload</button>
        </div>
      </form>
  </div>
</template>

<style scoped lang="scss">

.blurry-img{
  overflow: hidden;
  width: 100%;
  img{
    width: 120%;
    filter: blur(20px);
    object-fit: cover;
  }
}
.preview-img{
  width: 200px;
}

.home {
  display: grid;
  height: 80vh;
  place-content: center;
  text-align: center;
  user-select: none;

  .home-card {
    width: clamp(500px, 50vw, 100%);

    >img {
      height: 200px;
      max-width: 200px;
      width: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}
</style>
