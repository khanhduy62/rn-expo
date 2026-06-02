import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function RandomProfile() {
  const params = useLocalSearchParams();
  console.log(params.id);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={params.id as string}
        style={{ width: 100, height: 100, borderRadius: 50 }}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={300}
      />
    </View>
  );
}
