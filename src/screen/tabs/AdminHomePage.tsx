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
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import colours from "../../components/colours";

export default function AdminHomepage() {
  const { userInfo, logout } = useContext(AuthContext);
  const { deliveryGuys } = useOrderContext();
  const navigation = useNavigation<any>();
  
  const DeliveryGuyCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[styles.detailCard]}
        onPress={() => {}}
      >
        <Image source={{ uri: item.profile_image }} style={[styles.detailImage]} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.jobTitle}>{item.name}</Text>
          <Text style={styles.companyName}>Phone: {item.phone_number}</Text>
          <Text style={styles.location}>Gender: {item.gender}</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.salary}>Orders: {item.orders_assigned.length}</Text>
            <Text style={styles.postedTime}>Active</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

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

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={26}
            color="white"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholderTextColor={colours.adminTheme.textSecondary}
            placeholder="Search delivery guys..."
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <MaterialIcons name="filter-list" size={24} color={'white'} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {["All", "Active", "Inactive"].map((category, index) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              {
                backgroundColor: colours.adminTheme.headerBackground,
              },
              index === 1 && styles.selectedCategoryButton,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                index === 0 && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 50}}>
        {/* All Delivery Guys */}
        <Text style={styles.sectionTitle}>All Delivery Guys ({deliveryGuys.length})</Text>

        {deliveryGuys.map((item, index) => (
          <React.Fragment key={item.id}>{DeliveryGuyCard({ item })}</React.Fragment>
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
  shadowColor: 'white',
  borderColor: colours.adminTheme.border,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: colours.adminTheme.background,
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
    color: colours.userTheme.textSecondary,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 22,
    color: colours.adminTheme.primary,
  },
  logoutButton: {
    backgroundColor: colours.adminTheme.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    ...elevatedBorder,
    borderColor: 'white',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colours.adminTheme.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    ...elevatedBorder,
  },
  searchInput: {
    flex: 1,
    color: colours.adminTheme.primary,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: colours.adminTheme.primary,
    padding: 10,
    marginLeft: 8,
    borderRadius: 10,
    height: "100%",
    ...elevatedBorder,
    borderColor: 'white',
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
    backgroundColor: colours.adminTheme.primary,
    ...elevatedBorder,
    borderColor: 'white',
  },
  categoryText: {
    fontSize: 14,
    color: colours.adminTheme.textPrimary,
  },
  selectedCategoryText: {
    color: colours.adminTheme.textPrimary,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 12,
    color: colours.adminTheme.primary,
  },
  detailCard: {
    flexDirection: "row",
    backgroundColor: colours.adminTheme.cardBackground,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
    ...elevatedBorder,
  },
  detailImage: {
    width: 75,
    height: 75,
    borderRadius: 8,
    ...elevatedBorder,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    // color: colours.adminTheme.primary,
    color: colours.adminTheme.primary,
  },
  companyName: {
    fontSize: 12,
    color: colours.adminTheme.textPrimary,
  },
  location: {
    fontSize: 12,
    color: colours.adminTheme.textSecondary,
  },
  salary: {
    fontWeight: "bold",
    color: colours.adminTheme.primary,
  },
  postedTime: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});