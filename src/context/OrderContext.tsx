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
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

interface OrderContextProps {
  currentLocation: Location.LocationObjectCoords | undefined;
  orders: ProductOrder[];
  deliveryGuys: DeliveryGuy[];
  getDeliveryGuyByOrderId: (orderId: number) => Promise<DeliveryGuy | null>;
  getOrdersByDeliveryGuy: (deliveryGuyId: number) => Promise<ProductOrder[]>;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [deliveryGuys, setDileveryGuys] = useState<DeliveryGuy[]>([]);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObjectCoords>();

  //Fetch Location:
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("permission is not granted");
        console.log("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation(loc.coords);
    })();
  }, []);

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

    const getDeliveryGuys = async (): Promise<DeliveryGuy[]> => {
      try {
        const deliveryGuysSnapshot = await getDocs(
          collection(db, "deliveryGuys")
        );
        const deliveryGuysList: DeliveryGuy[] = deliveryGuysSnapshot.docs.map(
          (doc) => ({
            ...(doc.data() as DeliveryGuy),
          })
        );
        setDileveryGuys(deliveryGuysList);
        return deliveryGuysList;
      } catch (error) {
        console.error("Error fetching delivery guys:", error);
        return [];
      }
    };

    getDeliveryGuys();
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
      const deliveryGuyRef = doc(
        db,
        "deliveryGuys",
        `deliveryGuy-${deliveryGuyId}`
      );
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
      value={{
        currentLocation,
        orders,
        deliveryGuys,
        getDeliveryGuyByOrderId,
        getOrdersByDeliveryGuy,
      }}
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
