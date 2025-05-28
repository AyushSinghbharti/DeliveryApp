import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import colours from "../../components/colours";

export default function Homepage() {
  const { userInfo, logout } = useContext(AuthContext);
  const { orders } = useOrderContext();
  const navigation = useNavigation<any>();

  const DetailList = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[styles.detailCard]}
        onPress={() => navigation.navigate("OrderDetail", { order: item })}
      >
        <Image source={{ uri: item.image }} style={[styles.detailImage]} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.jobTitle}>{item.product_name}</Text>
          <Text style={styles.companyName}>Type: {item.category}</Text>
          <Text style={styles.location}>
            Location: {item.address.city}, {item.address.state}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.salary}>Rs. {item.amount}</Text>
            <Text style={styles.postedTime}>4hr</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const RecentList = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        key={item.id}
        style={[
          styles.recentCard,
          {
            backgroundColor: index % 2 === 0 ? "#FFE5D0" : "#FFF2E2",
          },
        ]}
      >
        <View style={styles.recentRow}>
          <Image source={{ uri: item.image }} style={styles.recentImage} />
          <View style={styles.recentTextGroup}>
            <Text style={styles.recentTitle} numberOfLines={1}>
              {item.product_name}
            </Text>
            <Text style={styles.recentDescription} numberOfLines={2}>
              {item.product_description}
            </Text>
          </View>
        </View>
        <View style={styles.recentFooter}>
          <Text style={styles.recentAmount}>Rs. {item.amount}</Text>
          <Text style={styles.recentCategory}>Few Hours Ago</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: userInfo?.profileImage || "https://i.pravatar.cc/100",
              }}
              style={{ width: "100%", height: "100%", borderRadius: 25 }}
            />
          </View>
          <Text style={styles.greeting}>
            Hello,{"\n"}
            <Text style={styles.userName}>{userInfo?.name || "User"}</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <MaterialIcons name="logout" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={26}
            color="#FC350B"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search orders..."
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <MaterialIcons name="filter-list" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent order Filter */}
      <View style={styles.filterRow}>
        {["All", "Recent Products", "Returned"].map((category, index) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              {
                backgroundColor: "white",
              },
              index === 1 && styles.selectedCategoryButton,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                index === 1 && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* All Orders */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Orders ({2})</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryCards}
        >
          {orders.slice(0, 2).map((item, index) => (
            <View key={item.id}>{RecentList({ item, index })}</View>
          ))}
        </ScrollView>

        {/* All Orders */}
        <Text style={styles.sectionTitle}>All Orders ({orders.length})</Text>

        {orders.map((item, index) => (
          <React.Fragment key={item.id}>{DetailList({ item })}</React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

const elevatedBorder = {
  elevation: 3,
  borderWidth: 1,
  borderBottomWidth: 2,
  borderRightWidth: 2.5,
  shadowColor: "#000",
  borderColor: "black",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    paddingBottom: 0,
    backgroundColor: colours.userTheme.background,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: "100%",
    marginRight: 12,
    ...elevatedBorder,
  },
  greeting: {
    fontSize: 18,
    color: "#444",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 22,
    color: colours.userTheme.primary,
  },
  logoutButton: {
    backgroundColor: colours.userTheme.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    ...elevatedBorder,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    ...elevatedBorder,
  },
  searchInput: {
    flex: 1,
    color: "#333",
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: colours.userTheme.primary,
    padding: 10,
    marginLeft: 8,
    borderRadius: 10,
    height: "100%",
    ...elevatedBorder,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    ...elevatedBorder,
  },
  selectedCategoryButton: {
    backgroundColor: colours.userTheme.primary,
  },
  categoryText: {
    fontSize: 14,
    color: "#444",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 12,
    color: colours.userTheme.primary,
  },
  summaryCards: {
    gap: 12,
  },

  recentCard: {
    // width: "100%",
    width: 230,
    padding: 14,
    borderRadius: 14,
    ...elevatedBorder,
  },

  recentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  recentImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    ...elevatedBorder,
  },

  recentTextGroup: {
    flex: 1,
  },

  recentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },

  recentDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },

  recentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    gap: 20,
  },

  recentAmount: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#E67E22",
  },

  recentCategory: {
    fontSize: 12,
    color: "#555",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  detailCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
    ...elevatedBorder,
  },
  detailImage: {
    width: 75,
    height: "100%",
    borderRadius: 8,
    ...elevatedBorder,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FC350B",
  },
  companyName: {
    fontSize: 12,
    color: "#666",
  },
  location: {
    fontSize: 12,
    color: "#999",
  },
  salary: {
    fontWeight: "bold",
    color: "#E67E22",
  },
  postedTime: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#aaa",
  },
});
