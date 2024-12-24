import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, retry } from 'rxjs';
import { RolesGuard } from './services/guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './common/enums/role.enums';
import { IProduct } from './interfaces/common/create-product.interface';
import { IServiceProductResponse } from './interfaces/user/dto/service-create-product-response.interface';
import { IPurchaseProduct } from './interfaces/common/purchase-product.interface';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productServiceClient: ClientProxy,
  ) { }

  @UseGuards(RolesGuard)
  @Post('productCreate')
  @Roles(Role.Admin)
  public async createProduct(
    @Body() product: IProduct
  ): Promise<IServiceProductResponse> {
    console.log('productproductproductproductproductproduct', product);

    const createProductResponse: IServiceProductResponse = await firstValueFrom(
      this.productServiceClient.send('product_create', product),
    );
    console.log('createUserResponse????', createProductResponse);

    if (createProductResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createProductResponse.message,
          data: null,
          errors: createProductResponse.errors,
        },
        createProductResponse.status,
      );
    }


    return {
      status: 201,
      message: createProductResponse.message,
      product: createProductResponse.product,
      errors: null,
    };
  }

  @UseGuards(RolesGuard)
  @Post('productPurchase')
  @Roles(Role.Admin)
  public async purchaseProduct(
    @Body() product: IPurchaseProduct
  ): Promise<IServiceProductResponse> {
    console.log('Purchase Product', this.productServiceClient);

    const purchaseProductResponse: IServiceProductResponse = await firstValueFrom(
      this.productServiceClient.send('product_purchase', product),
    );
    console.log('What is the purchased product', purchaseProductResponse);

    return purchaseProductResponse;
  }


}
