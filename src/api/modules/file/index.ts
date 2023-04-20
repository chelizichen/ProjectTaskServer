import { FileItem } from '../../../types/file'
import { post, postFormData } from '../../request'

export default {
  getFileList(params?: { user_id: string; name: string }) {
    return post<FileItem[]>('/file', params)
  },
  upload(params: { file: File }) {
    return postFormData('/file/upload', params)
  }
}
