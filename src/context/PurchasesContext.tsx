import { createContext, useContext, useEffect, useState } from 'react';
import Purchases, { CustomerInfo, PurchasesConfiguration } from 'react-native-purchases';
import { Platform } from 'react-native';

// Define your offering interfaces
interface Product {
  identifier: string;
  description: string;
  title: string;
  price: number;
  priceString: string;
}

interface PurchasesContextType {
  isProMember: boolean;
  products: Product[];
  currentOffering: string | null;
  purchasePro: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  loading: boolean;
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

// RevenueCat API keys
const API_KEYS = {
  android: 'your_android_key_from_revenuecat',
  ios: 'your_ios_key_from_revenuecat',
};

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
  const [isProMember, setIsProMember] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentOffering, setCurrentOffering] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializePurchases();
  }, []);

  async function initializePurchases() {
    try {
      const configuration: PurchasesConfiguration = {
        apiKey: Platform.select(API_KEYS)!,
      };
      
      await Purchases.configure(configuration);
      await updatePurchasesStatus();
      await loadProducts();
    } catch (error) {
      console.error('Failed to initialize purchases:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updatePurchasesStatus() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setIsProMember(checkIfUserHasProAccess(customerInfo));
    } catch (error) {
      console.error('Failed to update purchase status:', error);
    }
  }

  async function loadProducts() {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setCurrentOffering(offerings.current.identifier);
        setProducts(offerings.current.availablePackages.map(pkg => ({
          identifier: pkg.identifier,
          description: pkg.product.description,
          title: pkg.product.title,
          price: pkg.product.price,
          priceString: pkg.product.priceString,
        })));
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  function checkIfUserHasProAccess(customerInfo: CustomerInfo): boolean {
    return customerInfo.entitlements.active['pro_access'] !== undefined;
  }

  async function purchasePro() {
    try {
      setLoading(true);
      const offerings = await Purchases.getOfferings();
      if (!offerings.current) throw new Error('No offerings available');

      const proPackage = offerings.current.availablePackages[0]; // Assuming first package is Pro
      const { customerInfo } = await Purchases.purchasePackage(proPackage);
      setIsProMember(checkIfUserHasProAccess(customerInfo));
    } catch (error) {
      console.error('Failed to purchase:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function restorePurchases() {
    try {
      setLoading(true);
      const customerInfo = await Purchases.restorePurchases();
      setIsProMember(checkIfUserHasProAccess(customerInfo));
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <PurchasesContext.Provider
      value={{
        isProMember,
        products,
        currentOffering,
        purchasePro,
        restorePurchases,
        loading,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
}

export function usePurchases() {
  const context = useContext(PurchasesContext);
  if (context === undefined) {
    throw new Error('usePurchases must be used within a PurchasesProvider');
  }
  return context;
} 