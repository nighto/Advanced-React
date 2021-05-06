import { KeystoneContext } from '@keystone-next/types';
import { CartItem } from '../schemas/CartItem';
import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('ADDING TO CART!!');
  // 1. Query the current user to see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. Query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    // findMany instead of findOne because fields are not unique
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity',
  });
  console.log({ productId, allCartItems });
  const [existingCartItem] = allCartItems;
  // 3. See if the current item is in their cart
  if (existingCartItem) {
    console.log(
      `There are already ${existingCartItem.quantity}, increment by 1!`
    );
    // 4. If it is, increment by one
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  //   5. If it isn't, create a new cart item!
  console.log("Cart item doesn't exist, going to create one");
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}
