import {
  StyleSheet,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  Dimensions,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "@rneui/base";
import { useEffect, useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Button } from "react-native";
import { BottomSheetModal } from "@/components/BottomSheet";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = SCREEN_HEIGHT / 1.5;
const MIN_TRANSLATE_Y = SCREEN_HEIGHT / 5;

export default function TabTwoScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieData, setSelectedMovieData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const fetchSearchData = async (search_term: string) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${search_term}`
      );
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      fetchSearchData(searchValue);
    }
  }, [searchValue]);

  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
    .onStart((e) => {
      context.value = { y: translateY.value };
    })
    .onUpdate((e) => {
      translateY.value = e.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, -MAX_TRANSLATE_Y);
    })
    .onEnd((e) => {
      if (translateY.value > -MIN_TRANSLATE_Y) {
        translateY.value = withSpring(SCREEN_HEIGHT);
      }
      if (translateY.value < -MIN_TRANSLATE_Y) {
        translateY.value = withSpring(-MAX_TRANSLATE_Y);
      }
    });

  /**
   * Animated style for the bottom sheet
   */
  const reanimatedBottomStyle = useAnimatedStyle((e) => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  /**
   * Scrolls to a specific destination
   * @param {number} destination - The destination to scroll to
   */
  const scrollTo = (destination) => {
    "worklet";
    translateY.value = withSpring(destination, { damping: 50 });
  };

  useEffect(() => {
    // Initial scroll to show the bottom sheet partially
    scrollTo(-SCREEN_HEIGHT / 3);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <ThemedView style={{ padding: 10 }}>
        <SearchBar
          placeholder="Search Movies"
          value={searchValue}
          onChangeText={setSearchValue}
          platform="default"
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchInputContainer}
        />
      </ThemedView>

      <ThemedView style={{ flex: 1 }}>
        {isLoading ? (
          <ThemedView style={styles.center}>
            <ThemedText style={styles.loadingText}>Loading...</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            style={styles.container}
            data={data}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setIsModalOpen(true);
                  setSelectedMovieData(item);
                }}
              >
                <ThemedView style={styles.card}>
                  {item?.show?.image?.original ? (
                    <Image
                      source={{ uri: item.show.image.original }}
                      style={styles.cardImage}
                    />
                  ) : (
                    <ThemedView style={styles.placeholder}>
                      <ThemedText>No Image</ThemedText>
                    </ThemedView>
                  )}
                  <ThemedView style={styles.cardContent}>
                    <ThemedText style={styles.cardTitle}>
                      {item?.show?.name}
                    </ThemedText>
                    <ThemedText style={styles.cardSummary} numberOfLines={2}>
                      {item?.show?.summary?.replace(/<[^>]+>/g, "") ||
                        "No summary available."}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              searchValue ? (
                <ThemedText style={styles.noResultsText}>
                  No Movies Found...
                </ThemedText>
              ) : (
                <ThemedText style={styles.noResultsText}>
                  Search for a Movie
                </ThemedText>
              )
            }
          />
        )}
      </ThemedView>

      {/* <Button
        onPress={() => setIsModalOpen(true)}
        title="Open Bottom Sheet"
      ></Button> */}

      {isModalOpen && <BottomSheetModal onClose={()=>setIsModalOpen(false)}/>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchInputContainer: {
    backgroundColor: "#1F1F1F",
    borderRadius: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#E0E0E0",
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#1F1F1F",
    borderRadius: 10,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333333",
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  cardSummary: {
    fontSize: 12,
    color: "#B0B0B0",
    textAlign: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
    marginTop: 20,
  },
});
