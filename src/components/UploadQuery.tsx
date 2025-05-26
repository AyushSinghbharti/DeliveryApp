import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { db } from "../providers/firebase";
import { collection, setDoc, doc } from "firebase/firestore";
// import DummyOrderData from "../dummyData/DummyOrderData.json";
import DummyDeliveryData from "../dummyData/DummyDeliveryGuy.json";
import { ProductOrder } from "../types/OrderInterface"; // adjust path as needed
import  DeliveryGuy  from "../types/DeliveryGuyInterface"; // adjust path as needed

// const QueryRunningPage = () => {
//   let index = 0;

//   const handleUpload = () => {
//     DummyOrderData.map(async (order: ProductOrder) => {
//       try {
//         const orderDocRef = doc(db, "orders", `order-${order.id}`);
//         await setDoc(orderDocRef, {
//           id: order.id,
//           order_date: order.order_date,
//           delivery_date: order.delivery_date,
//           product_name: order.product_name,
//           product_description: order.product_description,
//           category: order.category,
//           amount: order.amount,
//           user_id: order.user_id,
//           delivery_boy_id: order.delivery_boy_id,
//           image: order.image,
//           address: {
//             street: order.address.street,
//             city: order.address.city,
//             state: order.address.state,
//             pincode: order.address.pincode,
//             coordinates: {
//               latitude: order.address.coordinates.latitude,
//               longitude: order.address.coordinates.longitude,
//             },
//           },
//           index: index++,
//         });
//         console.log("Order uploaded with ID: ", orderDocRef.id, index);
//       } catch (e) {
//         console.error("Error uploading order: ", e);
//       }
//     });

//     alert("Order data uploaded successfully");
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Upload Order Data" onPress={handleUpload} />
//     </View>
//   );
// };

const QueryRunningPage = () => {
  let index = 0;

  const handleUpload = () => {
    DummyDeliveryData.map(async (guy: DeliveryGuy) => {
      try {
        const deliveryGuyRef = doc(db, "deliveryGuys", `deliveryGuy-${guy.id}`);
        await setDoc(deliveryGuyRef, {
          id: guy.id,
          name: guy.name,
          phone_number: guy.phone_number,
          gender: guy.gender,
          profile_image: guy.profile_image,
          orders_assigned: guy.orders_assigned,
          index: index++, // Optional: for ordering/debugging
        });
        console.log("Delivery guy uploaded:", deliveryGuyRef.id, index);
      } catch (e) {
        console.error("Error uploading delivery guy:", e);
      }
    });

    alert("Delivery guy data uploaded successfully");
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Delivery Guy Data" onPress={handleUpload} />
    </View>
  );
};

export default QueryRunningPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
