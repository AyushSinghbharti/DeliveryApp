import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../providers/firebase";
import { ProductOrder } from "../types/OrderInterface";
import DeliveryGuy from "../types/DeliveryGuyInterface";


interface OrderContextProps {
  orders: ProductOrder[];
  getDeliveryGuyByOrderId: (orderId: number) => Promise<DeliveryGuy | null>;
  getOrdersByDeliveryGuy: (deliveryGuyId: number) => Promise<ProductOrder[]>;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);


export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<ProductOrder[]>([]);

  // Fetch all orders on initial load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const ordersList: ProductOrder[] = ordersSnapshot.docs.map((doc) => ({
          ...(doc.data() as ProductOrder),
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const getDeliveryGuyByOrderId = async (
    orderId: number
  ): Promise<DeliveryGuy | null> => {
    try {
      const deliveryGuyQuery = query(
        collection(db, "deliveryGuys"),
        where("orders_assigned", "array-contains", orderId)
      );

      const snapshot = await getDocs(deliveryGuyQuery);
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as DeliveryGuy;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching delivery guy by orderId:", error);
      return null;
    }
  };

  const getOrdersByDeliveryGuy = async (
    deliveryGuyId: number
  ): Promise<ProductOrder[]> => {
    try {
      const deliveryGuyRef = doc(db, "deliveryGuys", `deliveryGuy-${deliveryGuyId}`);
      const guySnap = await getDoc(deliveryGuyRef);

      if (guySnap.exists()) {
        const deliveryGuy = guySnap.data() as DeliveryGuy;
        const assignedOrderIds = deliveryGuy.orders_assigned;

        if (!assignedOrderIds.length) return [];

        const ordersCollection = collection(db, "orders");
        const ordersQuery = query(
          ordersCollection,
          where("id", "in", assignedOrderIds)
        );

        const ordersSnapshot = await getDocs(ordersQuery);
        return ordersSnapshot.docs.map((doc) => doc.data() as ProductOrder);
      } else {
        console.warn("Delivery guy not found");
        return [];
      }
    } catch (error) {
      console.error("Error fetching orders by delivery guy:", error);
      return [];
    }
  };

  return (
    <OrderContext.Provider
      value={{ orders, getDeliveryGuyByOrderId, getOrdersByDeliveryGuy }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
