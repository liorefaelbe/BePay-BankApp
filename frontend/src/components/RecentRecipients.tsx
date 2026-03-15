import { Chip, Stack, Typography } from "@mui/material";

export default function RecentRecipients({
  recipients,
  onPick,
}: {
  recipients: string[];
  onPick: (email: string) => void;
}) {
  if (!recipients.length) return null;

  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        Recent recipients
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {recipients.map((email) => (
          <Chip
            key={email}
            label={email}
            variant="outlined"
            onClick={() => onPick(email)}
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </Stack>
  );
}
