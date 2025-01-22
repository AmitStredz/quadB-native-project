import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Image, BackHandler } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Portal } from "react-native-paper";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Rating } from "react-native-ratings";
import { Button } from "react-native";
import { Link } from "expo-router";

export const BottomSheetModal = ({
  onClose,
  selectedMovie,
}: {
  onClose: () => void;
  selectedMovie: null;
}) => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        bottomSheetRef.current?.close();
        return true;
      }
    );

    return () => backHandler.remove(); // Clean up the listener
  }, []);

  return (
    <Portal>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          onClose={onClose}
          snapPoints={["80%", "95%", "100%"]}
          enableOverDrag={true}
          // enableContentPanningGesture
          enableDynamicSizing
          enablePanDownToClose
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          handleStyle={{
            backgroundColor: "white",
            borderColor: "black",
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        >
          <ScrollView style={{ flex: 1 }}>
            <BottomSheetView style={styles.contentContainer}>
              <Image
                style={styles.image}
                source={{ uri: selectedMovie?.show?.image?.original }}
              />
              <ThemedView
                style={{ width: "100%", backgroundColor: "transparent" }}
              >
                <ThemedText style={styles.title}>
                  {selectedMovie?.show?.name}
                </ThemedText>
              </ThemedView>
              <ThemedView
                style={{
                  flexDirection: "row",
                  gap: 10,
                  width: "100%",
                  backgroundColor: "transparent",
                }}
              >
                <ThemedText style={styles.subText}>
                  {selectedMovie?.show?.language}
                </ThemedText>
                <ThemedText style={styles.subText}>
                  {selectedMovie?.show?.premiered}
                </ThemedText>
              </ThemedView>

              <ThemedView
                style={{
                  alignItems: "flex-start",
                  width: "100%",
                  backgroundColor: "transparent",
                }}
              >
                <Rating
                  imageSize={20}
                  type="custom"
                  ratingBackgroundColor="grey"
                  minValue={5}
                  tintColor="black"
                  readonly
                  // showRating
                  // ratingCount={6}
                  // readonly
                  // startingValue={5}
                  // ratingBackgroundColor="black"
                  // ratingColor="yellow"
                  // showRating
                  // ratingColor="red"
                />
              </ThemedView>

              <ThemedView>
                <ThemedText style={{ fontSize: 14, marginTop: 20 }}>
                  {selectedMovie?.show?.summary?.replace(/<[^>]+>/g, "") ||
                    "No summary available."}{" "}
                </ThemedText>
              </ThemedView>

              <ThemedView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: 20,
                  backgroundColor: "transparent",
                  marginBottom: 100,
                }}
              >
                <View
                  style={{
                    borderColor: "white",
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    paddingHorizontal: 20,
                    width: "50%",
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      textAlign: "center",
                      marginBottom: 5,
                    }}
                  >
                    {selectedMovie?.show?._links?.previousepisode?.name}
                  </ThemedText>
                  <Link
                    href={
                      selectedMovie?.show?._links?.previousepisode?.href || ""
                    }
                  >
                    <Button title="<- Previous Episode"></Button>
                  </Link>
                </View>
                <View
                  style={{
                    borderColor: "white",
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    paddingHorizontal: 20,
                    width: "50%",
                    justifyContent: "space-between",
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      textAlign: "center",
                      marginBottom: 5,
                    }}
                  >
                    {selectedMovie?.show?._links?.nextepisode?.name}
                  </ThemedText>
                  <Link
                    href={selectedMovie?.show?._links?.nextepisode?.href || ""}
                  >
                    <Button title="Next Episode ->"></Button>
                  </Link>
                </View>
              </ThemedView>
            </BottomSheetView>
          </ScrollView>
        </BottomSheet>
      </GestureHandlerRootView>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "black",
    flex: 1,
    // display: "flex" ,
    flexDirection: "column",
    gap: 10,
    // justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    padding: 10,
  },
  image: {
    height: 600,
    // aspectRatio: 2/3,
    width: "100%",
  },
  title: {
    height: 40,
    textAlign: "left",
    left: 0,
    textAlignVertical: "bottom",
    justifyContent: "flex-start",
    alignItems: "flex-start",

    fontSize: 30,
    // fontWeight: 500,
  },
  subText: {
    fontSize: 12,
    backgroundColor: "grey",
    backgroundBlendMode: "#B0B0B0",
    borderRadius: 5,
    paddingHorizontal: 5,
  },
});
