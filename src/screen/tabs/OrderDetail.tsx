import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ProductOrder } from "../../types/OrderInterface";
import { useOrderContext } from "../../context/OrderContext";

type RootStackParamList = {
  OrderDetail: { order: ProductOrder };
};

export default function OrderDetail() {
  const route = useRoute<RouteProp<RootStackParamList, "OrderDetail">>();
  const { order } = route.params;
  const { getDeliveryGuyByOrderId, getOrdersByDeliveryGuy } = useOrderContext();

  useEffect(() => {
    const fetchDeliveryGuy = async () => {
      if (order.id) {
        const deliveryGuyInfo = await getDeliveryGuyByOrderId(
          order.id
        );
        if (deliveryGuyInfo) {
          console.log("Delivery Guy Info:", deliveryGuyInfo);
        } else {
          console.log("No delivery guy found for this order.");
        }
      }
    };

    fetchDeliveryGuy();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: order.image }} style={styles.image} />

      <Text style={styles.title}>{order.product_name}</Text>
      <Text style={styles.amount}>₹{order.amount}</Text>
      <Text style={styles.category}>{order.category}</Text>
      <Text style={styles.description}>{order.product_description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text>{order.address.street}</Text>
        <Text>
          {order.address.city}, {order.address.state} - {order.address.pincode}
        </Text>
        <Text style={styles.coords}>
          ({order.address.coordinates.latitude},{" "}
          {order.address.coordinates.longitude})
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Info</Text>
        <Text>Order Date: {order.order_date}</Text>
        <Text>Delivery Date: {order.delivery_date}</Text>
        <Text>Delivery Boy ID: {order.delivery_boy_id}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
  },
  amount: {
    fontSize: 18,
    color: "#10b981",
    marginVertical: 4,
  },
  category: {
    fontSize: 14,
    color: "#64748b",
  },
  description: {
    fontSize: 15,
    color: "#334155",
    marginVertical: 12,
  },
  section: {
    marginVertical: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  coords: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
});
