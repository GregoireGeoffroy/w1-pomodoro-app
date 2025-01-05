import { usePurchases } from '@/context/PurchasesContext';

export function useIsPremiumFeature(featureName: string): boolean {
  const { isProMember } = usePurchases();
  
  // Define which features require pro membership
  const premiumFeatures = [
    'customThemes',
    'advancedStats',
    'cloudSync',
    'customSounds',
    'teamFeatures'
  ];

  if (!premiumFeatures.includes(featureName)) {
    return true; // Free feature
  }

  return isProMember;
} 