import { Body, Controller, HttpException, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './common/enums/role.enums';
import { IProduct } from './interfaces/common/create-product.interface';
import { IServiceProductResponse } from './interfaces/user/service-create-product-response.interface';
import { IPurchaseProduct } from './interfaces/common/purchase-product.interface';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productServiceClient: ClientProxy,
  ) { }

  @UseGuards(RolesGuard) // Protect the endpoint with the RolesGuard to ensure only authorized users (Admins) can access it
  @Post('productCreate') // POST endpoint to create a new product
  @Roles(Role.Admin) // Only users with the 'Admin' role are allowed to access this endpoint
  public async createProduct(
    @Body() product: IProduct // The product data from the request body
  ): Promise<IServiceProductResponse> {
    try {
      // Call the product service to create the product
      const createProductResponse: IServiceProductResponse = await firstValueFrom(
        this.productServiceClient.send('product_create', product), // Send the product data to the product creation service
      );

      // Check if the product creation was successful (status CREATED)
      if (createProductResponse.status !== HttpStatus.CREATED) {
        throw new HttpException(
          {
            message: createProductResponse.message, // Error message from the product creation service
            data: null,
            errors: createProductResponse.errors, // Any validation errors or issues
          },
          createProductResponse.status, // Use the status returned by the product service
        );
      }

      // Return a successful response with the created product details
      return {
        status: HttpStatus.CREATED,
        message: createProductResponse.message,
        product: createProductResponse.product,
        errors: null,
      };
    } catch (error) {
      // Handle any errors that occur during the process
      throw new HttpException(
        {
          message: 'An unexpected error occurred while creating the product.',
          data: null,
          errors: error instanceof Error ? error.message : error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR, // Set HTTP status to 500 (Internal Server Error)
      );
    }
  }

  @UseGuards(RolesGuard) // Protect the endpoint with the RolesGuard to ensure only authorized users (Admins) can access it
  @Post('productPurchase') // POST endpoint to handle product purchase
  @Roles(Role.Admin) // Only users with the 'Admin' role are allowed to access this endpoint
  public async purchaseProduct(
    @Body() product: IPurchaseProduct // The product purchase data from the request body
  ): Promise<IServiceProductResponse> {
    try {
      // Call the product service to process the product purchase
      const purchaseProductResponse: IServiceProductResponse = await firstValueFrom(
        this.productServiceClient.send('product_purchase', product), // Send the purchase data to the product purchase service
      );

      // Return the response from the product purchase service
      return purchaseProductResponse;
    } catch (error) {
      // Handle any errors that occur during the product purchase process
      throw new HttpException(
        {
          message: 'An unexpected error occurred while purchasing the product.', // General error message
          data: null,
          errors: error instanceof Error ? error.message : error, // Include the error message if it's an instance of Error
        },
        HttpStatus.INTERNAL_SERVER_ERROR, // Set HTTP status to 500 (Internal Server Error)
      );
    }
  }


}
