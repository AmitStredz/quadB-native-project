import {
  Image,
  StyleSheet,
  Platform,
  FlatList,
  View,
  Button,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { ReactElement, useEffect, useState } from "react";
import { SearchBar } from "@rneui/themed";
import { useRouter } from "expo-router";
import { BottomSheetModal } from "@/components/BottomSheet";
import { Portal, Text } from "react-native-paper";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieData, setSelectedMovieData] = useState(null);

  const router = useRouter();

  const fetchData = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.get(
        "https://api.tvmaze.com/search/shows?q=all"
      );

      console.log(response.data);

      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#C11119" }}
      headerImage={
        <ThemedView style={styles.headerContainer}>
          {/* <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        /> */}
          <ThemedText style={styles.bannerText}>Movies List</ThemedText>
        </ThemedView>
      }
    >
      <ScrollView style={{ flex: 1 }}>
        {isLoading ? (
          <ThemedView>
            <ThemedText>Loading...</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView>
            <ThemedView>
              <SearchBar
                placeholder="Search"
                onFocus={() => router.push("/search")}
              />
            </ThemedView>
            <FlatList
              style={styles.container}
              data={data}
              numColumns={2}
              // nestedScrollEnabled={false}
              scrollEnabled={false}
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
                <ThemedText style={styles.noResultsText}>
                  No Movies Found...
                </ThemedText>
              }
            />
          </ThemedView>
        )}

        {isModalOpen && (
          <BottomSheetModal onClose={() => setIsModalOpen(false)} selectedMovie={selectedMovieData}/>
        )}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    position: "relative",
    height: 10,
  },
  reactLogo: {
    // width: 150,
    // height: 150,
    // resizeMode: "contain",
    // marginBottom: 20,
  },
  bannerText: {
    position: "absolute",
    top: 100,
    lineHeight: 50,
    fontSize: 50,
    // height: 200,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  // reactLogo: {
  //   height: 178,
  //   width: 290,
  //   bottom: 0,
  //   left: 0,
  //   position: "absolute",
  // },

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
    // padding: 10,
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

{
  /* <FlatList
            style={styles.container}
            numColumns={2}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <Image
                  style={styles.cardImage}
                  source={{ uri: item?.show?.image?.original }}
                />
                <ThemedView style={{padding: 5}}>
                  <ThemedText style={{fontSize: 20, fontWeight: 700, textAlign: "center"}}>{item?.show?.name}</ThemedText>
                  <ThemedText numberOfLines={2} style={{fontSize: 12, color: "#E0E0E0"}}>
                    {item.show.summary?.replace(/<[^>]+>/g, "") ||
                      "No summary available."}{" "}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            )}
          /> */
}

{
  /* <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView> */
}
