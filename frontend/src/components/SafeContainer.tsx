import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./Box";

export function SafeContainer({ children, padding }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Box
      style={{
        padding: padding?.all,
        paddingTop: insets.top + (padding?.top ?? padding?.all ?? 0),
        paddingBottom: padding?.bottom,
        paddingLeft: padding?.left,
        paddingRight: padding?.right,
      }}
      width={"100%"}
      height={"100%"}
      flex={1}
      backgroundColor="background"
    >
      {children}
    </Box>
  );
}

interface Props {
  children: (undefined | JSX.Element | null)[] | JSX.Element | null;
  padding?: Partial<{
    all: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
  }>;
}
