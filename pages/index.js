import { useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Divider,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 4),
}));

export default function Home() {
  const [intent, setIntent] = useState("reset password");
  const handleChangeIntent = (event) => {
    setIntent(event.target.value);
  };

  const [result, setResult] = useState([
    "Tell me more.",
    "I want to learn more.",
    "I want to learn more about this.",
  ]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopperOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopperClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Head>
        <title>Utterance Generator</title>
        <meta name="description" content="Utterance generator with Open AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack spacing={5} alignItems="center" p={6} sx={{ minHeight: "100vh" }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          Welcome to Utterance Generator
        </Typography>

        <Paper
          variant="outlined"
          square
          sx={{ width: "500px", overflowY: "auto" }}
        >
          <Stack>
            <Paper
              elevation={0}
              square
              sx={{ position: "sticky", top: 0, zIndex: 1 }}
            >
              <Item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    sx={{ width: 100, fontSize: "1.125rem", fontWeight: 700 }}
                  >
                    Intent
                  </Typography>
                  <TextField
                    variant="standard"
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: "1.125rem", fontWeight: 700 },
                    }}
                    value={intent}
                    onChange={handleChangeIntent}
                  />
                </Stack>
              </Item>

              <Divider />

              <Item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography sx={{ width: 100, fontWeight: 500 }}>
                    Context
                  </Typography>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="add additional values"
                  />
                </Stack>
              </Item>

              <Divider />

              <Item>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  Utterances
                </Typography>
              </Item>
            </Paper>

            <Item sx={{ overflowY: "auto" }}>
              <Stack spacing={2}>
                {result.map((item, index) => (
                  <TextField key={index} size="small" defaultValue={item} />
                ))}
              </Stack>
            </Item>

            <Item sx={{ mb: 2 }} onMouseLeave={handlePopperClose}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onMouseEnter={handlePopperOpen}
              >
                AI Generate
              </Button>
              <Popper
                open={open}
                anchorEl={anchorEl}
                onClick={handlePopperClose}
              >
                <Paper elevation={24} sx={{ width: "434px" }}>
                  <Stack>
                    <Button>Generate with intent only</Button>
                    <Button>Generate with additional context</Button>
                  </Stack>
                </Paper>
              </Popper>
            </Item>
          </Stack>
        </Paper>
      </Stack>
    </>
  );
}
