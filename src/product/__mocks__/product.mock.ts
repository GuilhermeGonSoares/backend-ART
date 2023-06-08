import { ProductType } from '../../enums/product.enum';
import { ProductEntity } from '../entities/product.entity';

export const ProductMock: ProductEntity = {
  id: 4,
  name: 'Desenvolvimento de Logotipo',
  description:
    'Desenvolvimento de logotipo para a empresa + elaboração de papelaria básica. (5 peças)',
  price: 749,
  type: ProductType.Unique,
  numberOfPosts: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
