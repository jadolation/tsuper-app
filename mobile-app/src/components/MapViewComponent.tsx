import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { UrlTile, Marker, Region } from 'react-native-maps';

export type MarkerData = {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  pinColor?: string;
};

type MapViewComponentProps = {
  markers?: MarkerData[];
  initialRegion?: Region;
  children?: React.ReactNode;
};

const DEFAULT_REGION: Region = {
  latitude: 16.0433,
  longitude: 120.3333,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapViewComponent({
  markers = [],
  initialRegion = DEFAULT_REGION,
  children,
}: MapViewComponentProps) {
  return (
    <MapView style={styles.map} initialRegion={initialRegion}>
      <UrlTile
        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        flipY={false}
      />

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.lat, longitude: marker.lng }}
          title={marker.title}
          description={marker.description}
          pinColor={marker.pinColor ?? 'red'}
        />
      ))}

      {children}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
