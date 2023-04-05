import { Injectable, Inject } from '@nestjs/common';
import { In, Like, Raw, MongoRepository, ObjectID } from 'typeorm';
import { Menu } from '../entities/menu.mongo.entity'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'
import { CreateMenuDto, UpdateMenuDto } from '../dtos/menu.dto';
import * as fs from 'fs'
import { ArticleService } from './article.service';
import * as path from 'path'
import { UploadService } from '../../shared/upload/upload.service';
import * as compressing from 'compressing';
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

  /**
   * 文章批量上传
   * @param file 
   */
  async import(file) {
    const uploadFile = await this.uploadService.upload(file)

    // 解压缩
    // const root
    // uplaod/abc.zip => uplaod/abc
    const root = uploadFile.path.replace(path.extname(uploadFile.path), '')

    await compressing.zip.uncompress(uploadFile.path, root)

    this.articleRepository.deleteMany({})

    const list = fs.readdirSync(root)
      .filter(menu => menu !== 'image')
      .filter(menu => fs.statSync(root + '/' + menu).isDirectory())
    const menus = []
    for (const menu of list) {
      menus.push(await this.importCategory(menu, root + '/' + menu))
    }

    console.log('list', JSON.stringify(menus))
    await this.update({ menus })

    await fs.rmSync(uploadFile.path)
    await fs.rmdirSync(root, { recursive: true })
  }

  async importCategory(name, category) {
    const list = fs.readdirSync(category)
      .filter(v => fs.statSync(category + '/' + v).isDirectory())
    const children = []
    for (let article of list) {
      children.push(await this.importArticle(article, category + '/' + article))
    }

    return {
      key: Date.now().toString(),
      title: name.slice(3),
      type: 'category',
      children
    }

  }

  async importArticle(title, dir) {
    const list = fs.readdirSync(dir).filter(v => v !== 'image')
    if (!list[0]) return
    let artitle = (dir + '/' + list[0])
    const content = fs.readFileSync(artitle).toString()
    title = title.replace('.md', '')
    const { _id } = await this.articleService.create({ title, content })
    return {
      key: _id,
      title,
      type: 'article'
    }
  }


}
