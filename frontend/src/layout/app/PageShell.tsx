import { Box, Container } from "@mui/material";
import { bepayPageBgSx } from "../../ui/bepay";

type Props = {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
};

export default function PageShell({ children, maxWidth = "lg" }: Props) {
  return (
    <Box sx={{ ...bepayPageBgSx, py: { xs: 3, sm: 4 } }}>
      <Container maxWidth={maxWidth} sx={{ position: "relative", zIndex: 1 }}>
        {children}
      </Container>
    </Box>
  );
}
