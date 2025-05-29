import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { ProductOrder } from "../../types/OrderInterface";
import { useOrderContext } from "../../context/OrderContext";
import colours from "../../components/colours";
import DeliveryGuy from "../../types/DeliveryGuyInterface";
import MapView, {
  Marker,
  Polyline,
  UrlTile,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

type RootStackParamList = {
  OrderDetail: { order: ProductOrder };
};

const OrderDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "OrderDetail">>();
  const { order } = route.params;
  const [deliveryGuy, setDeliveryGuy] = useState<DeliveryGuy | null>();
  const { currentLocation, getDeliveryGuyByOrderId } = useOrderContext();
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState<Number>(0);
  const navigation = useNavigation();

  const YOUR_API_KEY =
    "5b3ce3597851110001cf62483ed3f8c022254b2d92e9cf43da3de4de";
  const origin = currentLocation;
  const destination = {
    latitude: order.address.coordinates.latitude,
    longitude: order.address.coordinates.longitude,
  };

  useEffect(() => {
    const fetchRoute = async () => {
      const apiKey = "5b3ce3597851110001cf62483ed3f8c022254b2d92e9cf43da3de4de";
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${origin.longitude},${origin.latitude}&end=${destination.longitude},${destination.latitude}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        setDistance(
          Number(
            (data.features[0].properties.summary.distance / 1000).toFixed(2)
          )
        );
        const coords = data.features[0].geometry.coordinates.map(
          ([lon, lat]) => ({
            latitude: lat,
            longitude: lon,
          })
        );
        setRouteCoords(coords);
      } catch (err) {
        console.error("Failed to fetch route:", err);
      }
    };

    fetchRoute();
  }, []);

  useEffect(() => {
    const fetchDeliveryGuy = async () => {
      if (order.id) {
        const deliveryGuyInfo = await getDeliveryGuyByOrderId(order.id);
        setDeliveryGuy(deliveryGuyInfo);
      }
    };

    fetchDeliveryGuy();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const formatAddress = (address: ProductOrder["address"]) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.pincode}`;
  };

  const generateOrderNumber = (id: number) => {
    return `ORD${id.toString().padStart(6, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcfaf8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1b130d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{order.product_name} Order</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                order.image ||
                "https://cdn.usegalileo.ai/sdxl10/984e6ed0-e33f-48f3-ad68-066fe4783309.png",
            }}
            style={styles.productImage}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.productTitle}>{order.product_name}</Text>
          </View>
        </View>

        {/* Product Order Section */}
        <Text style={styles.sectionTitle}>Product Order</Text>

        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Status</Text>
          <Text style={styles.orderValue}>Out for delivery</Text>
        </View>

        {/* Product Description */}
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Description</Text>
          <Text style={styles.orderValue}>{order.product_description}</Text>
        </View>

        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Category</Text>
          <Text style={styles.orderValue}>{order.category}</Text>
        </View>

        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Amount</Text>
          <Text style={styles.orderValue}>₹{order.amount.toFixed(2)}</Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.deliveryAddress}>
          <View style={styles.addressRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={24} color="#1b130d" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressText}>
                {formatAddress(order.address)}
              </Text>
            </View>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order number</Text>
            <Text style={styles.orderValue}>
              {generateOrderNumber(order.id)}
            </Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order Date</Text>
            <Text style={styles.orderValue}>
              {formatDate(order.order_date)}
            </Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Delivery Date</Text>
            <Text style={styles.orderValue}>
              {formatDate(order.delivery_date)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Current Location</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.mapImage}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: origin?.latitude ?? 0,
              longitude: origin?.longitude ?? 0,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <UrlTile
              urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />

            {origin && (
              <Marker
                coordinate={origin}
                title={`${distance.toString()} km Away`}
              >
                <Image
                  source={{ uri: deliveryGuy?.profile_image }}
                  style={{ height: 35, width: 35, borderWidth: 1 }}
                />
                <View
                  style={{
                    backgroundColor: "white",
                    width: "75%",
                    height: "auto",
                    borderRadius: 5,
                    elevation: 5,
                    borderWidth: 1,
                    borderBottomWidth: 2.5,
                    borderRightWidth: 2.5,
                    borderColor: "black",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    {distance.toString()} km Away
                  </Text>
                </View>
              </Marker>
            )}
            <Marker coordinate={destination} title="Order Location" />

            {routeCoords.length > 0 && (
              <Polyline
                coordinates={routeCoords}
                strokeColor="blue"
                strokeWidth={4}
              />
            )}
          </MapView>
        </View>

        {/* Deliveryman Section */}
        <Text style={styles.sectionTitle}>Deliveryman Info</Text>
        <View style={styles.deliverymanRow}>
          <View style={styles.deliverymanInfo}>
            <View style={styles.deliverymanImageContainer}>
              <Image
                source={{
                  uri:
                    deliveryGuy?.profile_image ||
                    "https://i.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=1280&format=png&auto=webp&s=7177756d1f393b6e093596d06e1ba539f723264b",
                }}
                style={styles.deliverymanImage}
              />
            </View>
            <View style={styles.deliverymanDetails}>
              <Text style={styles.deliverymanName}>
                {deliveryGuy?.name} #{order.delivery_boy_id}
              </Text>
              <Text style={styles.deliverymanRating}>
                Mob no: {deliveryGuy?.phone_number}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Call Deliveryman Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="call" size={24} color="#1b130d" />
            <Text style={styles.primaryButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const elevatedBorder = {
  elevation: 3,
  borderWidth: 1,
  borderBottomWidth: 2.5,
  borderRightWidth: 2.5,
  shadowColor: "#000",
  borderColor: "black",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.userTheme.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 24,
    backgroundColor: colours.userTheme.background,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colours.userTheme.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 15,
    overflow: "hidden",
    minHeight: 320,
    position: "relative",
    ...elevatedBorder,
  },
  productImage: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 16,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colours.userTheme.textPrimary,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 20,
  },
  deliveryAddress: {
    // backgroundColor: colours.userTheme.secondary,
    backgroundColor: colours.userTheme.highlight,
    borderRadius: 12,
    margin: 12,
    ...elevatedBorder,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 56,
  },
  orderLabel: {
    fontSize: 16,
    color: colours.userTheme.textPrimary,
    flex: 1,
  },
  orderValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colours.userTheme.textPrimary,
    flex: 2,
    textAlign: "right",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    minHeight: 72,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colours.userTheme.textPrimary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: colours.userTheme.textSecondary,
    lineHeight: 18,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: "hidden",
    ...elevatedBorder,
  },
  mapImage: {
    overflow: "hidden",
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 24,
  },
  deliverymanRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 72,
    backgroundColor: colours.userTheme.background,
  },
  deliverymanInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deliverymanImageContainer: {
    borderRadius: 50,
    marginRight: 12,
    ...elevatedBorder,
  },
  deliverymanImage: {
    width: 56,
    height: 56,
    borderRadius: 50,
  },
  deliverymanDetails: {
    flex: 1,
  },
  deliverymanName: {
    fontSize: 16,
    fontWeight: "500",
    color: colours.userTheme.textPrimary,
    marginBottom: 2,
  },
  deliverymanRating: {
    fontSize: 14,
    color: colours.userTheme.textSecondary,
    lineHeight: 18,
  },
  callButton: {
    backgroundColor: colours.userTheme.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 84,
    alignItems: "center",
    ...elevatedBorder,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colours.userTheme.textPrimary,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButton: {
    backgroundColor: colours.userTheme.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    minHeight: 48,
    ...elevatedBorder,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colours.userTheme.textPrimary,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 35,
  },
});

export default OrderDetailsScreen;
