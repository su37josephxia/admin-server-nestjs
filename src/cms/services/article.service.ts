import { Injectable, Inject } from '@nestjs/common';
import { In, Like, Raw, MongoRepository, ObjectID } from 'typeorm';
import { Article } from '../entities/article.mongo.entity'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'
import { CreateArticleDto, UpdateArticleDto } from '../dtos/article.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios'

@Injectable()
export class ArticleService {
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: MongoRepository<Article>,

    private configService: ConfigService
  ) { }


  async create(course: CreateArticleDto) {
    const ret = await this.articleRepository.save(course)
    // await this.sync('' + ret._id)
    return ret
  }

  async findAll({ pageSize, page }: PaginationParamsDto): Promise<{ data: Article[], count: number }> {

    const [data, count] = await this.articleRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: (pageSize * 1),
      cache: true
    })
    return {
      data, count
    }
  }

  async findOne(id: string) {
    return await this.articleRepository.findOneBy(id)
  }

  async update(id: string, course: UpdateArticleDto) {
    // 去除时间戳和id
    ['_id', 'createdAt', 'updatedAt'].forEach(
      k => delete course[k]
    )
    const ret = await this.articleRepository.update(id, course)

    // TODO 暂时使用同步刷新
    await this.sync(id)
    return ret
  }


  async remove(id: string): Promise<any> {
    return await this.articleRepository.delete(id)
  }

  /**
   * 同步
   */
  async sync(id: string) {
    const secret = this.configService.get<String>('cms.validateToken')
    const host = this.configService.get<String>('cms.host')
    const url = `/api/revalidate?secret=${secret}&id=${id}`
    try {
      console.log('同步URL', url)
      await axios.get(host + '/' + url)
    } catch (error) {
      console.log('同步NG')
      throw error
    }
    return
  }
}
