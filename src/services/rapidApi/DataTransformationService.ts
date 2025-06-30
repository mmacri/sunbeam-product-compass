
import { 
  RapidApiProduct, 
  RapidApiProductDetails, 
  RapidApiReviewsResponse, 
  RapidApiOffersResponse, 
  ProductData 
} from '../../types/rapidApi';
import { ProductDataTransformer } from './transformers/ProductDataTransformer';
import { BasicProductTransformer } from './transformers/BasicProductTransformer';

export class DataTransformationService {
  static transformProductData(
    details: RapidApiProductDetails, 
    reviewsData: RapidApiReviewsResponse | null, 
    offersData: RapidApiOffersResponse | null
  ): ProductData {
    return ProductDataTransformer.transformProductData(details, reviewsData, offersData);
  }

  static transformBasicProductData(product: RapidApiProduct): ProductData {
    return BasicProductTransformer.transformBasicProductData(product);
  }
}
