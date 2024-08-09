
import { api } from './AxiosService.js'


class ImageUploadService {
  async uploadImage(file) {
    const payload = new FormData()
    payload.append('image', file)
    const response = await api.post('api/upload', payload)
    console.log('Image uploaded', response.data);
    return response.data.url

  }
}

export const imageUploadService = new ImageUploadService()
