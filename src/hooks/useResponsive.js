import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    isDesktop: width >= 768,
    isMobile: width < 768,
  };
}
