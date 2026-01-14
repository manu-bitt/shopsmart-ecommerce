import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrder = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'No items in cart' });
      return;
    }

    const { items } = cart;
    const total = items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
            include: { product: true }
        }
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
            include: { product: true }
        },
      },
    });

    if (order) {
      if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
          res.status(401).json({ message: 'Not authorized' });
          return;
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addOrder, getMyOrders, getOrderById };
