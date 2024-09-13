import { ProjectItem } from '../../../types/project'
import { get, post, patch } from '../../request'

export default {
  getProjectList(params) {
    return get<ProjectItem[]>('/project/getList',params)
  },
  addProject(params: { name: string }) {
    return post('/project/create', params)
  },
  getProject(id: number) {
    return get<ProjectItem[]>(`/project/${id}`)
  },
  updateProject(id: number, params: Partial<ProjectItem>) {
    return patch(`/project/${id}`, params)
  }
}
