import { IsNotEmpty, Matches } from "class-validator";
import { regPositiveOrEmpty } from "../utils/regex.util";

export class IdDTO {

  /**
   * 主键 id
   */
  @IsNotEmpty({ message: 'id 不能为空' })
  @Matches(regPositiveOrEmpty, { message: '请输入有效 id' })
  readonly id: number
}