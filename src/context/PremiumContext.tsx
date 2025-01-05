import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PremiumContextType {
  isPremium: boolean;
  setPremiumStatus: (status: boolean) => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  async function loadPremiumStatus() {
    try {
      const status = await AsyncStorage.getItem('premiumStatus');
      setIsPremium(status === 'true');
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  }

  async function setPremiumStatus(status: boolean) {
    try {
      await AsyncStorage.setItem('premiumStatus', status.toString());
      setIsPremium(status);
    } catch (error) {
      console.error('Error saving premium status:', error);
    }
  }

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        setPremiumStatus,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
} 