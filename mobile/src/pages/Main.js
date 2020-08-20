import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

import { api } from "../services/api";
import { connect, disconnect, subscribeToNewDevs } from "../services/socket";

import styles from "./styles";

function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState("");

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDevs((dev) => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    disconnect();

    const { latitude, longitude } = currentRegion;

    connect(latitude, longitude, techs);
  }

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const response = await api.get("./search", {
      params: {
        latitude: latitude,
        longitude: longitude,
        techs: techs,
      },
    });

    setDevs(response.data.devs);
    setupWebsocket();
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    return null;
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={currentRegion}
        style={styles.map}
      >
        {devs.map((dev) => (
          <Marker
            key={dev._id}
            coordinate={{
              latitude: dev.location.coordinates[0],
              longitude: dev.location.coordinates[1],
            }}
          >
            <Image
              style={styles.avatar}
              source={{
                uri: dev.avatar_url,
              }}
            ></Image>
            <Callout
              onPress={() => {
                navigation.navigate("Profile", {
                  github_username: dev.github_username,
                });
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchFrom}>
        <TextInput
          style={styles.searchInput}
          placeholder={"Buscar devs por tecnologias..."}
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        ></TextInput>
        <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
          <MaterialIcons
            name="my-location"
            size={20}
            color="#fff"
          ></MaterialIcons>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default Main;
