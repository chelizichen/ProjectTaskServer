import { FileItem } from '../../../types/file'
import { post, postFormData } from '../../request'

export default {
  getFileList(params?: { user_id?: string; name?: string; dirId?: number | null }) {
    return post<FileItem[]>('/file', params)
  },
  upload(params: { file: File; dirId: number | null }) {
    return postFormData('/file/upload', params)
  },
  createDir(params: { name: string }) {
    return post<FileItem[]>('/file/createDir', params)
  },
  patchDelete(params: { ids: number[] }) {
    return post('/file/patchDelete', params)
  }
}