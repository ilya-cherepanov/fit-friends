import {EatingRDO} from './eating.rdo';
import {Expose, Type} from 'class-transformer';


export class EatingsRDO {
  @Type(() => EatingRDO)
  @Expose()
  items: EatingRDO[]
}
