import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import {
  addSearch,
  clearSearches,
  removeOneItem,
} from "@/redux/features/recent-search-slice";
import { RootState } from "@/redux/store/store";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function TabTwoScreen() {
  const recentSearches = useSelector(
    (state: RootState) => state.recentSearch.items
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [cocktail, setCocktail] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleClearAllSearches = () => {
    dispatch(clearSearches());
  };

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

        {query.length >= 1 && (
          <FlatList
            data={cocktail}
            keyExtractor={(item, index) => item.idDrink + index.toString()}
            renderItem={({ item }) => {
              return (
                <View style={{ marginVertical: 8 }}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(
                        addSearch({
                          name: item.strDrink,
                          image: item.strDrinkThumb,
                          type: item.strAlcoholic,
                          instructions: item.strInstructions,
                          glass: item.strGlass,
                          idDrink: item.idDrink,
                        })
                      );
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
        )}
        {query.length === 0 && (
          <FlatList
            data={recentSearches}
            keyExtractor={(item, index) => item.idDrink + index.toString()}
            renderItem={({ item }) => {
              return (
                <View style={{ marginVertical: 16 }}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: `/detail-drink`,
                        params: {
                          drink: JSON.stringify({
                            strDrink: item.name,
                            strDrinkThumb: item.image,
                            strAlcoholic: item.type,
                            strInstructions: item.instructions,
                            strGlass: item.glass,
                          }),
                        },
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
                        source={{ uri: item.image }}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 56 / 2,
                        }}
                        resizeMode="cover"
                      />

                      <View style={{ marginLeft: 16 }}>
                        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                        <Text style={{ color: "#888" }}>{item.glass}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => dispatch(removeOneItem(item.idDrink))}
                        style={{ flex: 1, alignItems: "flex-end" }}
                      >
                        <AntDesign name="delete" size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListHeaderComponent={
              recentSearches.length > 0 ? (
                <View
                  style={{
                    marginTop: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>Recent Searches</Text>
                  <TouchableOpacity onPress={handleClearAllSearches}>
                    <Text style={{ color: "red" }}>Clear All</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#eee" }} />
            )}
            ListEmptyComponent={
              <View style={{ padding: 8 }}>
                <Text style={{ color: "#888", textAlign: "center" }}>
                  No recent searches
                </Text>
              </View>
            }
          />
        )}
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
