import { Injectable } from '@nestjs/common'
import * as OSS from 'ali-oss'
import { Readable } from 'node:stream'
import client from '../../config/oss'
import { InjectRepository } from '@nestjs/typeorm'
import { File } from './entities/file.entity'
import { Like, Repository } from 'typeorm'
import { UploadFile } from './dto/file.dto'

@Injectable()
export class FileService {
  public client
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {
    this.client = new OSS(client)
  }

  async upload(
    name: string,
    stream: Readable,
    file: UploadFile,
    user_id: string,
    dirId: number,
  ) {
    const size = file.size
    const ext = file.mimetype.split('/')[1]
    const filename = decodeURIComponent(name)
    const url = await this.uploadFile(filename, stream)
    const res = await this.fileRepository.save({
      name: filename,
      size,
      ext,
      url,
      user_id,
      dirId,
    })
    if (res) {
      return {
        code: 200,
        msg: '上传成功',
        data: res,
      }
    } else {
      return {
        code: 500,
        msg: '上传失败',
      }
    }
  }

  async uploadFile(name: string, stream: Readable) {
    let res
    try {
      res = await this.client.putStream(name, stream)
      // 将文件设置为公共可读
      await this.client.putACL(name, 'public-read')
    } catch (error) {
      console.log(error)
    }
    return res.url
  }

  async createDir(name: string, user_id: string) {
    const existDir = await this.fileRepository.findOne({
      where: {
        name,
        isDir: true,
        user_id,
      },
    })
    if (existDir) {
      return {
        code: 500,
        msg: '文件夹已存在',
      }
    }
    const data = await this.fileRepository.save({
      name,
      isDir: true,
      user_id,
    })
    if (data) {
      return {
        code: 200,
        msg: '创建成功',
        data,
      }
    } else {
      return {
        code: 500,
        msg: '创建失败',
      }
    }
  }

  async findAll(user_id: string, name = '', dirId: number) {
    const data = await this.fileRepository.find({
      where: {
        name: Like(`%${name}%`),
        user_id,
        dirId,
      },
      order: {
        isDir: 'DESC',
      },
    })
    return {
      code: 200,
      msg: '查询成功',
      data,
    }
  }
}
