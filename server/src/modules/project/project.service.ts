import { Injectable } from '@nestjs/common'
import { ProjectDto } from './dto/project.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Project } from './entities/project.entity'
import { Repository } from 'typeorm'
import { User } from '../user/entities/user.entity'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(projectDto: ProjectDto) {
    const { name } = projectDto
    const existProject = await this.projectRepository.findOne({
      where: {
        name,
      },
    })
    if (existProject) {
      return {
        code: 500,
        msg: '项目已存在',
      }
    }
    const project = await this.projectRepository.save({ name })
    if (project) {
      return {
        code: 200,
        msg: '创建成功',
        data: project,
      }
    } else {
      return {
        code: 500,
        msg: '创建失败',
      }
    }
  }

  async findAll(opts:string) {
    opts = opts || "0,1,2"
    console.log('opts',opts);
    const data = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .leftJoinAndSelect('project.users', 'userList')
      .leftJoinAndSelect('tasks.users', 'users')
      .andWhere(`tasks.status in (${opts})`)
      .getMany()
    return {
      code: 200,
      msg: '获取成功',
      data,
    }
  }

  async findOne(id: number) {
    const data = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .leftJoinAndSelect('project.users', 'userList')
      .leftJoinAndSelect('tasks.users', 'users')
      .where('project.id = :id', { id })
      .getMany()
    if (data) {
      return {
        code: 200,
        msg: '获取成功',
        data,
      }
    } else {
      return {
        code: 500,
        msg: '获取失败',
      }
    }
  }

  async update(id: number, updateProjectDto) {
    const data = await this.projectRepository.findOne({
      where: {
        id,
      },
    })
    const newData = Object.assign(data, { ...updateProjectDto })
    if (updateProjectDto.users && updateProjectDto.users.length) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .whereInIds(updateProjectDto.users)
        .getMany()
      newData.users = users
    }
    const res = await this.projectRepository.save(newData)
    if (res) {
      return {
        code: 200,
        msg: '修改成功',
      }
    } else {
      return {
        code: 500,
        msg: '修改失败',
      }
    }
  }

  async remove(id: number) {
    const data = await this.projectRepository.findOne({
      where: {
        id,
      },
    })
    const res = await this.projectRepository.remove(data)
    if (res) {
      return {
        code: 200,
        msg: '删除成功',
      }
    } else {
      return {
        code: 500,
        msg: '删除失败',
      }
    }
  }
}
