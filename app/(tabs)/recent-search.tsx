import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { addSearch } from "@/redux/features/recent-search-slice";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function TabTwoScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [cocktail, setCocktail] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setCocktail(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setCocktail(null);

      try {
        const res = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query.toLowerCase()}`
        );

        const data = await res.json();
        setCocktail(data.drinks);
      } catch (error) {
        console.error("Error fetching cocktail data:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, dispatch]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Recent Search</Text>
        <TextInput
          placeholder="Search..."
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />

        {loading && (
          <ActivityIndicator
            size="large"
            color="#888"
            style={{ marginVertical: 16 }}
          />
        )}

        <FlatList
          data={cocktail}
          keyExtractor={(item, index) => item.idDrink + index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={{ marginVertical: 8 }}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(addSearch(item));
                    router.push({
                      pathname: `/detail-drink`,
                      params: { drink: JSON.stringify(item) },
                    });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item.strDrinkThumb }}
                      style={{
                        width: 50,
                        height: 50,
                        marginRight: 16,
                        borderRadius: 10,
                      }}
                      resizeMode="cover"
                    />
                    <View>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.strDrink}
                      </Text>
                      <Text style={{ color: "#888" }}>{item.strGlass}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          ListHeaderComponent={
            <View style={{ marginTop: 16 }}>
              {query.length > 0 && !loading && (
                <Text>Search result for "{query}"</Text>
              )}
            </View>
          }
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#eee" }} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
