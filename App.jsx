import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {
  RewardedAd,
  TestIds,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="showAds"
        onPress={async () => {
          let loaded = false;

          const adUnitId = __DEV__
            ? TestIds.REWARDED
            : 'ca-app-pub-6721519204185712/1219314954';

          const admob = RewardedAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true,
          });

          const unsubscribeLoaded = admob.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
              loaded = true;
              console.log('ads loaded');
              unsubscribeLoaded();
            },
          );

          const unsubscribeEarned = admob.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
              console.log('User earned reward of ', reward);
              unsubscribeEarned();
            },
          );

          const showAds = async () => {
            admob.load();
            while (!loaded) await sleep(1000);
            admob.show();
          };

          return await showAds();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
});
