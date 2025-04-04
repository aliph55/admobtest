import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { RewardedAd, TestIds } from 'react-native-google-mobile-ads';

// Test reklam birimi ID’si
const adUnitId = TestIds.REWARDED; // "ca-app-pub-3940256099942544/5224354917"

// Rewarded reklam nesnesini oluştur
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function App() {
  const [isLoading, setIsLoading] = useState(false); // Reklam yükleniyor mu?
  const [errorMessage, setErrorMessage] = useState(null); // Hata mesajı

  useEffect(() => {
    // Reklam olaylarını dinle (manuel string değerler kullanıyoruz)
    const unsubscribeLoaded = rewarded.addAdEventListener('loaded', () => {
      setIsLoading(false);
      console.log('Reklam yüklendi!');
    });

    const unsubscribeEarned = rewarded.addAdEventListener('earned_reward', (reward) => {
      console.log(`Kullanıcı ${reward.amount} ${reward.type} kazandı!`);
    });

    const unsubscribeError = rewarded.addAdEventListener('error', (error) => {
      setIsLoading(false);
      if (error.code === 'SERVICE_NOT_AVAILABLE') {
        setErrorMessage('Google Play Services eksik veya güncel değil. Lütfen cihazınızı kontrol edin.');
      } else {
        setErrorMessage('Reklam yüklenemedi: ' + error.message);
      }
      console.log('Reklam yüklenemedi:', error);
    });

    // Reklamı yükle
    setIsLoading(true);
    rewarded.load();

    // Temizlik fonksiyonu
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeError();
    };
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <Button
          title="Rewarded Reklam Göster"
          onPress={() => {
            if (rewarded.loaded) {
              rewarded.show();
            } else {
              setIsLoading(true);
              rewarded.load();
            }
          }}
        />
      )}
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