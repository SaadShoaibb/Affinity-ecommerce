import { order, orderItem, shippingAddress } from './schemas/order'
import { product } from './schemas/product'
import { productCategory } from './schemas/product-category'
import { promotionCampaign } from './schemas/promotion-campaign'
import { promotionCode } from './schemas/promotion-codes'
import { type SchemaTypeDefinition } from 'sanity'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    promotionCode,
    promotionCampaign,

    
    productCategory,
    product,
    
    shippingAddress,
    orderItem,
    order,
  ],
}