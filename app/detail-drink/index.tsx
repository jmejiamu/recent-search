import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DetailDrink = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const drink = JSON.parse(params.drink as string);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 20 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginVertical: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {drink ? drink?.strDrink : "No Drink Found"}
          </Text>
          <Image
            source={{ uri: drink?.strDrinkThumb }}
            style={{
              width: "100%",
              height: 400,
              borderRadius: 10,
              marginVertical: 20,
            }}
            resizeMode="cover"
          />

          <View style={{ gap: 15 }}>
            <Text style={{ fontWeight: "bold" }}>Type</Text>
            <Text style={{ color: "#555", fontSize: 16 }}>
              {drink ? drink?.strAlcoholic : "No alcohol info found"}
            </Text>
          </View>
          <View style={{ gap: 15, marginBottom: 50 }}></View>
          <Text style={{ fontWeight: "bold" }}>Instructions</Text>
          <Text style={{ color: "#555", fontSize: 16 }}>
            {drink ? drink?.strInstructions : "No instructions found"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailDrink;

const styles = StyleSheet.create({});
