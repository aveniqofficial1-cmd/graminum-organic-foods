import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderStatus, PaymentStatus, DeliveryMethod, PaymentMethod, Address, CartItem } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { useToast } from './ToastContext';

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    grandTotal: number;
    deliveryMethod: DeliveryMethod;
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
    paymentScreenshot?: string;
    paymentUtr?: string;
  }) => Order;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, adminNote?: string) => void;
  verifyPayment: (orderId: string, isVerified: boolean | 'Verified' | 'Failed', note?: string) => void;
  uploadPaymentReceipt: (orderId: string, screenshotUrl: string, utrNumber?: string) => void;
  addInternalAdminNote: (orderId: string, note: string) => void;
  addOrderNote: (orderId: string, note: string) => void;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    pendingFulfillment: number;
    readyForPickup: number;
    outForDelivery: number;
    pickedUpOrders: number;
    deliveredOrders: number;
    pendingPaymentVerification: number;
  };
  getDashboardStats: () => {
    totalProducts: number;
    totalOrders: number;
    newOrders: number;
    pendingOrders: number;
    acceptedOrders: number;
    preparingOrders: number;
    readyForPickupOrders: number;
    outForDeliveryOrders: number;
    pickedUpOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalCustomers: number;
    paymentVerificationPending: number;
    outOfStockProducts: number;
    totalRevenue: number;
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'graminum_orders_v2';

// Initial realistic demo orders - Direct Store Pickup at Kashibugga, Warangal
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'GRM-89241',
    customerName: 'Sravani Varma',
    customerEmail: 'sravani.varma@example.com',
    customerPhone: '+91 98490 12345',
    items: [
      {
        productId: INITIAL_PRODUCTS[0].id,
        product: INITIAL_PRODUCTS[0],
        selectedPackSize: '500g',
        unitPrice: 349,
        quantity: 2,
      },
      {
        productId: INITIAL_PRODUCTS[1].id,
        product: INITIAL_PRODUCTS[1],
        selectedPackSize: '1 Litre',
        unitPrice: 420,
        quantity: 1,
      },
      {
        productId: INITIAL_PRODUCTS[3].id,
        product: INITIAL_PRODUCTS[3],
        selectedPackSize: '500g',
        unitPrice: 280,
        quantity: 1,
      },
    ],
    subtotal: 1398,
    deliveryFee: 0,
    discount: 50,
    grandTotal: 1348,
    deliveryMethod: 'Store Pickup',
    shippingAddress: {
      id: 'addr-101',
      fullName: 'Sravani Varma',
      email: 'sravani.varma@example.com',
      phone: '+91 98490 12345',
      addressLine: 'Graminum Store Pickup: 11-18-356/3/A, Opp Sai Baba Temple, Beside Assisi School, O City, Kashibugga',
      city: 'Warangal',
      state: 'Telangana',
      pincode: '506002',
      isDefault: true,
      type: 'Home',
    },
    paymentMethod: 'UPI / QR Code',
    paymentStatus: 'Verified',
    paymentUtr: 'UPI-89241-77821034',
    orderStatus: 'Preparing at Store',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2026-03-01 10:15 AM',
        description: 'Order placed & payment verified via phone',
        completed: true,
      },
      {
        status: 'Accepted',
        timestamp: '2026-03-01 10:30 AM',
        description: 'Order confirmed by Graminum Kashibugga store team',
        completed: true,
      },
      {
        status: 'Preparing at Store',
        timestamp: '2026-03-01 11:45 AM',
        description: 'Fresh organic items packed and assembled at Kashibugga store',
        completed: true,
      },
      {
        status: 'Ready for Pickup',
        timestamp: 'Estimated Today by 04:00 PM',
        description: 'Order packed & ready for collection at Kashibugga store counter',
        completed: false,
      },
      {
        status: 'Picked Up',
        timestamp: 'Pending Collection',
        description: 'Order handover to customer with Order ID at store counter',
        completed: false,
      },
    ],
    internalAdminNotes: ['Customer will collect at 4:30 PM. Packed in eco-paper bag.'],
    notes: 'Kashibugga Warangal Counter Pickup',
    createdAt: '2026-03-01T10:15:00Z',
    updatedAt: '2026-03-01T11:45:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'GRM-89215',
    customerName: 'Kalyan Chakravarthy',
    customerEmail: 'kalyan.c@example.com',
    customerPhone: '+91 98850 44332',
    items: [
      {
        productId: INITIAL_PRODUCTS[1].id,
        product: INITIAL_PRODUCTS[1],
        selectedPackSize: '5 Litres (Tin)',
        unitPrice: 1950,
        quantity: 1,
      },
      {
        productId: INITIAL_PRODUCTS[6].id,
        product: INITIAL_PRODUCTS[6],
        selectedPackSize: '1kg',
        unitPrice: 180,
        quantity: 2,
      },
    ],
    subtotal: 2310,
    deliveryFee: 0,
    discount: 0,
    grandTotal: 2310,
    deliveryMethod: 'Store Pickup',
    shippingAddress: {
      id: 'addr-102',
      fullName: 'Kalyan Chakravarthy',
      email: 'kalyan.c@example.com',
      phone: '+91 98850 44332',
      addressLine: 'Graminum Store Pickup: 11-18-356/3/A, Opp Sai Baba Temple, Beside Assisi School, O City, Kashibugga',
      city: 'Warangal',
      state: 'Telangana',
      pincode: '506002',
      isDefault: true,
      type: 'Home',
    },
    paymentMethod: 'Manual Transfer (Screenshot)',
    paymentStatus: 'Pending',
    paymentUtr: 'AXIS-559021884102',
    paymentScreenshot: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    orderStatus: 'Order Placed',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2026-03-01 09:30 AM',
        description: 'Customer sent payment to 9396723139 and uploaded receipt',
        completed: true,
      },
      {
        status: 'Accepted',
        timestamp: 'Awaiting Admin Verification',
        description: 'Store verification of uploaded payment receipt in progress',
        completed: false,
      },
      {
        status: 'Preparing at Store',
        timestamp: 'Pending Verification',
        description: 'Item packaging starts after payment approval',
        completed: false,
      },
      {
        status: 'Ready for Pickup',
        timestamp: 'Pending',
        description: 'Order ready notification for customer collection',
        completed: false,
      },
      {
        status: 'Picked Up',
        timestamp: 'Pending',
        description: 'Order handover at Kashibugga store counter',
        completed: false,
      },
    ],
    internalAdminNotes: ['Screenshot shows transfer of ₹2310 to 9396723139. Check statement for UTR AXIS-559021884102.'],
    notes: 'Verify UTR AXIS-559021884102',
    createdAt: '2026-03-01T09:30:00Z',
    updatedAt: '2026-03-01T09:30:00Z',
  },
  {
    id: 'ord-103',
    orderNumber: 'GRM-89190',
    customerName: 'Ananya Reddy',
    customerEmail: 'ananya.reddy@example.com',
    customerPhone: '+91 97000 88990',
    items: [
      {
        productId: INITIAL_PRODUCTS[2].id,
        product: INITIAL_PRODUCTS[2],
        selectedPackSize: '1kg',
        unitPrice: 190,
        quantity: 2,
      },
      {
        productId: INITIAL_PRODUCTS[7].id,
        product: INITIAL_PRODUCTS[7],
        selectedPackSize: '500g',
        unitPrice: 220,
        quantity: 1,
      },
    ],
    subtotal: 600,
    deliveryFee: 0,
    discount: 60,
    grandTotal: 540,
    deliveryMethod: 'Store Pickup',
    shippingAddress: {
      id: 'addr-103',
      fullName: 'Ananya Reddy',
      email: 'ananya.reddy@example.com',
      phone: '+91 97000 88990',
      addressLine: 'Graminum Store Pickup: 11-18-356/3/A, Opp Sai Baba Temple, Beside Assisi School, O City, Kashibugga',
      city: 'Warangal',
      state: 'Telangana',
      pincode: '506002',
      isDefault: false,
      type: 'Other',
    },
    paymentMethod: 'Credit / Debit Card',
    paymentStatus: 'Verified',
    paymentUtr: 'HDFC-TXN-99881023',
    orderStatus: 'Ready for Pickup',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2026-02-28 04:10 PM',
        description: 'Order placed and paid online',
        completed: true,
      },
      {
        status: 'Accepted',
        timestamp: '2026-02-28 04:30 PM',
        description: 'Order approved for store preparation',
        completed: true,
      },
      {
        status: 'Preparing at Store',
        timestamp: '2026-02-28 05:40 PM',
        description: 'Packed and tagged for customer pickup',
        completed: true,
      },
      {
        status: 'Ready for Pickup',
        timestamp: '2026-03-01 08:00 AM',
        description: 'Ready for collection at Kashibugga Warangal Store counter',
        completed: true,
      },
      {
        status: 'Picked Up',
        timestamp: 'Pending Collection',
        description: 'Awaiting customer arrival at counter with Order ID #GRM-89190',
        completed: false,
      },
    ],
    internalAdminNotes: ['Store counter shelf B-2 tagged for pickup.'],
    createdAt: '2026-02-28T16:10:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'ord-104',
    orderNumber: 'GRM-89044',
    customerName: 'Venkat Raman',
    customerEmail: 'venkat.raman@example.com',
    customerPhone: '+91 94400 11223',
    items: [
      {
        productId: INITIAL_PRODUCTS[4].id,
        product: INITIAL_PRODUCTS[4],
        selectedPackSize: '1kg',
        unitPrice: 195,
        quantity: 3,
      },
      {
        productId: INITIAL_PRODUCTS[5].id,
        product: INITIAL_PRODUCTS[5],
        selectedPackSize: '500g',
        unitPrice: 499,
        quantity: 1,
      },
    ],
    subtotal: 1084,
    deliveryFee: 0,
    discount: 50,
    grandTotal: 1034,
    deliveryMethod: 'Store Pickup',
    shippingAddress: {
      id: 'addr-104',
      fullName: 'Venkat Raman',
      email: 'venkat.raman@example.com',
      phone: '+91 94400 11223',
      addressLine: 'Graminum Store Pickup: 11-18-356/3/A, Opp Sai Baba Temple, Beside Assisi School, O City, Kashibugga',
      city: 'Warangal',
      state: 'Telangana',
      pincode: '506002',
      isDefault: true,
      type: 'Home',
    },
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Verified',
    orderStatus: 'Picked Up',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2026-02-25 11:00 AM',
        description: 'Order placed for store collection',
        completed: true,
      },
      {
        status: 'Accepted',
        timestamp: '2026-02-25 11:30 AM',
        description: 'Order accepted & inventory reserved',
        completed: true,
      },
      {
        status: 'Preparing at Store',
        timestamp: '2026-02-25 02:00 PM',
        description: 'Fresh packaging completed at store',
        completed: true,
      },
      {
        status: 'Ready for Pickup',
        timestamp: '2026-02-26 09:30 AM',
        description: 'Order ready at Kashibugga store counter',
        completed: true,
      },
      {
        status: 'Picked Up',
        timestamp: '2026-02-26 01:15 PM',
        description: 'Package handed over to customer at Kashibugga store counter. Cash received.',
        completed: true,
      },
    ],
    internalAdminNotes: ['Store counter collection completed. Cash ₹1034 settled.'],
    createdAt: '2026-02-25T11:00:00Z',
    updatedAt: '2026-02-26T13:15:00Z',
  },
];

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const generateOrderNumber = (): string => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `GRM-${randomNum}`;
  };

  const createOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    grandTotal: number;
    deliveryMethod: DeliveryMethod;
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
    paymentScreenshot?: string;
    paymentUtr?: string;
  }): Order => {
    const orderNumber = generateOrderNumber();
    const id = `ord-${Date.now()}`;
    const now = new Date();
    const formattedDate = now.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const isManualPayment =
      orderData.paymentMethod === 'Manual Transfer (Screenshot)' ||
      orderData.paymentMethod === ('Manual Bank / UPI Transfer' as any);

    const initialPaymentStatus: PaymentStatus =
      orderData.paymentMethod === 'Cash on Delivery'
        ? 'Pending'
        : isManualPayment
        ? 'Pending'
        : 'Verified';

    const initialOrderStatus: OrderStatus = 'Order Placed';

    const timeline: Order['timeline'] = [
      {
        status: 'Order Placed',
        timestamp: formattedDate,
        description: isManualPayment
          ? 'Order registered; store payment verification pending'
          : 'Order placed successfully and confirmed in store system',
        completed: true,
      },
      {
        status: 'Accepted',
        timestamp: isManualPayment ? 'Awaiting verification' : 'In queue',
        description: 'Store verification & item allocation',
        completed: false,
      },
      {
        status: 'Preparing at Store',
        timestamp: 'Estimated within 1-2 hours',
        description: 'Fresh organic packaging & assembling at Kashibugga store',
        completed: false,
      },
      {
        status: 'Ready for Pickup',
        timestamp: 'Same Day Store Ready',
        description: 'Order packed & ready for collection at Kashibugga Warangal Store counter',
        completed: false,
      },
      {
        status: 'Picked Up',
        timestamp: 'Pending Collection',
        description: 'Customer order handover with Order ID at store counter',
        completed: false,
      },
    ];

    const newOrder: Order = {
      id,
      orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: 0,
      discount: orderData.discount,
      grandTotal: orderData.grandTotal,
      deliveryMethod: 'Store Pickup',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: initialPaymentStatus,
      paymentScreenshot: orderData.paymentScreenshot,
      paymentUtr: orderData.paymentUtr,
      orderStatus: initialOrderStatus,
      timeline,
      internalAdminNotes: isManualPayment
        ? ['Manual payment receipt submitted at checkout. Awaiting verification.']
        : undefined,
      notes: 'Direct Store Pickup - Kashibugga Warangal',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    return newOrder;
  };

  const getOrderById = (orderIdOrNumber: string): Order | undefined => {
    const clean = orderIdOrNumber.trim().replace('#', '').toLowerCase();
    return orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.orderNumber.toLowerCase() === clean ||
        o.orderNumber.toLowerCase() === `grm-${clean}`
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, adminNote?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const nowStr = new Date().toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          const statusOrderSequence: OrderStatus[] = [
            'Order Placed',
            'Accepted',
            'Preparing at Store',
            'Ready for Pickup',
            'Picked Up',
          ];

          const targetIndex = statusOrderSequence.indexOf(newStatus);

          const updatedTimeline = order.timeline.map((event) => {
            const eventIndex = statusOrderSequence.indexOf(event.status);

            if (newStatus === 'Cancelled') {
              return event;
            }

            if (event.status === newStatus) {
              return {
                ...event,
                timestamp: nowStr,
                completed: true,
              };
            }

            if (targetIndex !== -1 && eventIndex !== -1 && eventIndex < targetIndex) {
              return {
                ...event,
                completed: true,
              };
            }

            return event;
          });

          const notes = adminNote
            ? [...(order.internalAdminNotes || []), `[${nowStr}] ${adminNote}`]
            : order.internalAdminNotes;

          return {
            ...order,
            orderStatus: newStatus,
            timeline: updatedTimeline,
            internalAdminNotes: notes,
            notes: adminNote || order.notes,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    showToast(`Order status updated to "${newStatus}"`, 'success');
  };

  const verifyPayment = (
    orderId: string,
    isVerified: boolean | 'Verified' | 'Failed',
    note?: string
  ) => {
    const verifiedBool = isVerified === true || isVerified === 'Verified';

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const nowStr = new Date().toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          const paymentStatus: PaymentStatus = verifiedBool ? 'Verified' : 'Failed';
          const orderStatus: OrderStatus = verifiedBool ? 'Accepted' : 'Order Placed';

          const notes = [
            ...(order.internalAdminNotes || []),
            `[${nowStr}] Payment ${verifiedBool ? 'VERIFIED' : 'REJECTED'}${note ? `: ${note}` : ''}`,
          ];

          const updatedTimeline = order.timeline.map((event) => {
            if (event.status === 'Accepted' && verifiedBool) {
              return {
                ...event,
                timestamp: nowStr,
                description: 'Payment verified and order accepted',
                completed: true,
              };
            }
            return event;
          });

          return {
            ...order,
            paymentStatus,
            orderStatus,
            timeline: updatedTimeline,
            internalAdminNotes: notes,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    showToast(
      verifiedBool ? 'Payment verified successfully!' : 'Payment verification marked as rejected.',
      verifiedBool ? 'success' : 'warning'
    );
  };

  const uploadPaymentReceipt = (orderId: string, screenshotUrl: string, utrNumber?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            paymentScreenshot: screenshotUrl,
            paymentUtr: utrNumber || order.paymentUtr,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
    showToast('Payment receipt uploaded successfully!', 'success');
  };

  const addInternalAdminNote = (orderId: string, note: string) => {
    const nowStr = new Date().toLocaleString('en-IN');
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            internalAdminNotes: [...(order.internalAdminNotes || []), `[${nowStr}] ${note}`],
            notes: note,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
    showToast('Internal note saved', 'info');
  };

  const addOrderNote = addInternalAdminNote;

  const getDashboardStats = () => {
    const totalProducts = INITIAL_PRODUCTS.length;
    const totalOrders = orders.length;
    const newOrders = orders.filter((o) => o.orderStatus === 'Order Placed').length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Order Placed').length;
    const acceptedOrders = orders.filter((o) => o.orderStatus === 'Accepted').length;
    const preparingOrders = orders.filter(
      (o) => o.orderStatus === 'Preparing at Store' || o.orderStatus === 'Preparing'
    ).length;
    const readyForPickupOrders = orders.filter(
      (o) => o.orderStatus === 'Ready for Pickup' || o.orderStatus === 'Out for Delivery'
    ).length;
    const outForDeliveryOrders = readyForPickupOrders;
    const pickedUpOrders = orders.filter(
      (o) => o.orderStatus === 'Picked Up' || o.orderStatus === 'Delivered'
    ).length;
    const deliveredOrders = pickedUpOrders;
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled').length;

    const uniqueCustomers = new Set(orders.map((o) => o.customerEmail.toLowerCase())).size;

    const paymentVerificationPending = orders.filter(
      (o) =>
        (o.paymentMethod === 'Manual Transfer (Screenshot)' ||
          o.paymentMethod === ('Manual Bank / UPI Transfer' as any) ||
          o.paymentMethod === 'UPI / QR Code') &&
        o.paymentStatus === 'Pending'
    ).length;

    const outOfStockProducts = INITIAL_PRODUCTS.filter((p) => p.stock <= 0).length;

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'Verified' && o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.grandTotal, 0);

    return {
      totalProducts,
      totalOrders,
      newOrders,
      pendingOrders,
      acceptedOrders,
      preparingOrders,
      readyForPickupOrders,
      outForDeliveryOrders,
      pickedUpOrders,
      deliveredOrders,
      cancelledOrders,
      totalCustomers: uniqueCustomers || 4,
      paymentVerificationPending,
      outOfStockProducts,
      totalRevenue,
    };
  };

  const computedStats = {
    totalRevenue: orders
      .filter((o) => o.paymentStatus === 'Verified' && o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.grandTotal, 0),
    totalOrders: orders.length,
    pendingFulfillment: orders.filter(
      (o) =>
        o.orderStatus === 'Order Placed' ||
        o.orderStatus === 'Accepted' ||
        o.orderStatus === 'Preparing at Store' ||
        o.orderStatus === 'Preparing'
    ).length,
    readyForPickup: orders.filter(
      (o) => o.orderStatus === 'Ready for Pickup' || o.orderStatus === 'Out for Delivery'
    ).length,
    outForDelivery: orders.filter(
      (o) => o.orderStatus === 'Ready for Pickup' || o.orderStatus === 'Out for Delivery'
    ).length,
    pickedUpOrders: orders.filter(
      (o) => o.orderStatus === 'Picked Up' || o.orderStatus === 'Delivered'
    ).length,
    deliveredOrders: orders.filter(
      (o) => o.orderStatus === 'Picked Up' || o.orderStatus === 'Delivered'
    ).length,
    pendingPaymentVerification: orders.filter((o) => o.paymentStatus === 'Pending').length,
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        verifyPayment,
        uploadPaymentReceipt,
        addInternalAdminNote,
        addOrderNote,
        stats: computedStats,
        getDashboardStats,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
