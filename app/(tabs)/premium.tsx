import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePurchases } from '@/context/PurchasesContext';
import { useCallback } from 'react';

export default function PremiumScreen() {
  const { products, purchasePro, restorePurchases, loading, isProMember } = usePurchases();

  const handlePurchase = useCallback(async () => {
    try {
      await purchasePro();
    } catch (error) {
      // Handle error (show alert, etc.)
      console.error('Purchase failed:', error);
    }
  }, [purchasePro]);

  const handleRestore = useCallback(async () => {
    try {
      await restorePurchases();
    } catch (error) {
      // Handle error
      console.error('Restore failed:', error);
    }
  }, [restorePurchases]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isProMember) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-xl font-bold mb-4">
          You're a Pro Member! 🎉
        </Text>
        <Text className="text-center text-gray-600">
          Thank you for supporting our app. Enjoy all premium features!
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-6">Upgrade to Pro</Text>
      
      {products.map((product) => (
        <View key={product.identifier} className="mb-4 p-4 bg-white rounded-lg shadow">
          <Text className="text-lg font-semibold">{product.title}</Text>
          <Text className="text-gray-600 mb-2">{product.description}</Text>
          <Text className="text-lg font-bold mb-3">{product.priceString}</Text>
          <TouchableOpacity
            onPress={handlePurchase}
            className="bg-blue-500 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              Purchase
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        onPress={handleRestore}
        className="mt-4 p-3"
      >
        <Text className="text-blue-500 text-center">
          Restore Purchases
        </Text>
      </TouchableOpacity>
    </View>
  );
} 