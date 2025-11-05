const { prisma } = require('../config/database');

const getCart = async (userId) => {
  const carts = await prisma.cart.findMany({
    where: { userId },
    include: {
      product: true,
      items: {
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  const total = carts.reduce((sum, cart) => {
    const cartTotal = cart.items.reduce((itemSum, item) => {
      return itemSum + (item.variant.product.price * item.quantity);
    }, 0);
    return sum + cartTotal;
  }, 0);

  return {
    items: carts,
    subtotal: total,
    total
  };
};

const addToCart = async (userId, productId, variantId, quantity = 1) => {
  console.log('🛒 Cart service addToCart:', { userId, productId, variantId, quantity });
  
  // Check if product and variant exist
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true }
  });

  if (!variant) {
    console.log('❌ Variant not found:', variantId);
    throw new Error('Product variant not found');
  }

  if (variant.product.id !== productId) {
    console.log('❌ Variant does not belong to product:', { variantProductId: variant.product.id, expectedProductId: productId });
    throw new Error('Variant does not belong to this product');
  }

  if (variant.stock < quantity) {
    console.log('❌ Insufficient stock:', { available: variant.stock, requested: quantity });
    throw new Error('Insufficient stock');
  }

  // Find or create cart for this user-product combination
  let cart = await prisma.cart.findFirst({
    where: { userId, productId },
    include: { 
      items: {
        include: {
          variant: true
        }
      }
    }
  });

  if (!cart) {
    console.log('✅ Creating new cart');
    cart = await prisma.cart.create({
      data: {
        userId,
        productId
      },
      include: { 
        items: {
          include: {
            variant: true
          }
        }
      }
    });
  }

  // Check if cart item already exists
  const existingItem = cart.items.find(item => item.variantId === variantId);

  if (existingItem) {
    // Update quantity
    console.log('✅ Updating existing cart item quantity');
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity
      }
    });
  } else {
    // Create new cart item
    console.log('✅ Creating new cart item');
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity
      }
    });
  }

  return getCart(userId);
};

const updateCartItem = async (userId, cartItemId, quantity) => {
  if (quantity <= 0) {
    await removeCartItem(userId, cartItemId);
    return getCart(userId);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true, variant: true }
  });

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  if (cartItem.cart.userId !== userId) {
    throw new Error('Unauthorized');
  }

  if (cartItem.variant.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity }
  });

  return getCart(userId);
};

const removeCartItem = async (userId, cartItemId) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true }
  });

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  if (cartItem.cart.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId }
  });

  // If this was the last item, delete the cart
  const remainingItems = await prisma.cartItem.count({
    where: { cartId: cartItem.cart.id }
  });

  if (remainingItems === 0) {
    await prisma.cart.delete({
      where: { id: cartItem.cart.id }
    });
  }
};

const clearCart = async (userId) => {
  await prisma.cart.deleteMany({
    where: { userId }
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};

