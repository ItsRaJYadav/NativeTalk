import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const FooterMenu = () => {
  // hooks
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("AllUsers")}>
        <FontAwesome5
          name="home"
          style={styles.iconStyle}
          color={route.name === "AllUsers" && "orange"}
        />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Chatlist")}>
        <MaterialIcons
          name="mark-chat-unread"
          style={styles.iconStyle}
          color={route.name === "Chatlist" && "orange"}
        />
        <Text>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Status")}>
        <MaterialIcons
          name="mood"
          style={styles.iconStyle}
          color={route.name === "Status" && "orange"}
        />
        <Text>Status</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <FontAwesome5
          name="user"
          style={styles.iconStyle}
          color={route.name === "Profile" && "orange"}
        />
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-between",
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 25,
  },
});

export default FooterMenu;