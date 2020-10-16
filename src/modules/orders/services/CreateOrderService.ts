import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // TODO
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer is not found');
    }

    const productsExists = await this.productsRepository.findAllById(products);

    if (!productsExists.length) {
      throw new AppError('Not exists products.');
    }

    const productsIdsExists = productsExists.map(product => product.id);

    const checkProductsinexsistent = products.filter(
      product => !productsIdsExists.includes(product.id),
    );

    if (checkProductsinexsistent.length) {
      throw new AppError(
        `Could not find product ${checkProductsinexsistent[0].id}`,
      );
    }

    const productsWithNoQuantityAvailable = products.filter(
      product =>
        productsExists.filter(p => product.id === p.id)[0].quantity <
        product.quantity,
    );

    if (productsWithNoQuantityAvailable.length) {
      throw new AppError(
        `The quantity ${productsWithNoQuantityAvailable[0].quantity} is not available for ${productsWithNoQuantityAvailable[0].id}`,
      );
    }

    const orderProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: productsExists.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: orderProducts,
    });

    const { order_products } = order;

    const updateOrderProductsQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        productsExists.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateQuantity(updateOrderProductsQuantity);

    return order;
  }
}

export default CreateOrderService;
