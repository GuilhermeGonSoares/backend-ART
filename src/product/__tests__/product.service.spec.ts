import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductMock } from '../__mocks__/product.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from '../dtos/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockReturnValue([ProductMock]),
            findOne: jest.fn().mockReturnValue(ProductMock),
            save: jest.fn().mockReturnValue(ProductMock),
            remove: jest.fn().mockReturnValue(ProductMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await service.list();

    expect(products).toEqual([ProductMock]);
  });

  it('should return product by id', async () => {
    const findOneSpy = jest.spyOn(repository, 'findOne');
    const product = await service.findProductBy('id', ProductMock.id);

    expect(product).toEqual(ProductMock);
    expect(findOneSpy).toBeCalledWith({ where: { id: ProductMock.id } });
  });

  it('should return erro with not exist product with id', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

    await expect(
      service.findProductBy('id', ProductMock.id),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return update product', async () => {
    const saveSpy = jest.spyOn(repository, 'save');
    const updateProduct: UpdateProductDto = {
      numberOfPosts: 1,
    };

    const product = await service.update(ProductMock.id, updateProduct);
    expect(product).toEqual(ProductMock);
    expect(saveSpy).toBeCalledWith({ ...product, ...updateProduct });
  });

  it('should return erro with already exist product name', async () => {
    const updateProduct: UpdateProductDto = {
      name: 'testando',
    };

    await expect(
      service.update(ProductMock.id, updateProduct),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should be remove product by id', async () => {
    const removeSpy = jest.spyOn(repository, 'remove');
    const product = await service.delete(ProductMock.id);

    expect(product).toEqual(ProductMock);
    expect(removeSpy).toBeCalledWith(ProductMock);
  });
});
