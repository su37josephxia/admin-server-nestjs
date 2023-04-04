import { Injectable, Inject } from '@nestjs/common';
import { In, Like, Raw, MongoRepository, ObjectID } from 'typeorm';
import { Menu } from '../entities/menu.mongo.entity'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'
import { CreateMenuDto, UpdateMenuDto } from '../dtos/menu.dto';
import * as fs from 'fs'
import { ArticleService } from './article.service';
import * as path from 'path'
import { UploadService } from '../../shared/upload/upload.service';
@Injectable()
export class MenuService {
  constructor(
    @Inject('MENU_REPOSITORY')
    private MenuRepository: MongoRepository<Menu>,

    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: MongoRepository<Menu>,

    private articleService: ArticleService,

    private uploadService: UploadService

  ) { }



  async find(): Promise<{ data: object }> {

    const data = await this.MenuRepository.findOneBy({})

    data && delete data._id
    return {
      data: data ? data : { menus: {} }
    }
  }


  async update(data: UpdateMenuDto) {
    // 去除时间戳和id
    ['_id', 'createdAt', 'updatedAt'].forEach(
      k => delete data[k]
    )
    return await this.MenuRepository.updateOne({}, { $set: data }, { upsert: true })
  }


}
