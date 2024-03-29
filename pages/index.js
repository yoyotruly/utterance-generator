import { useState } from "react";
import Head from "next/head";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Input,
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

export default function Home({}) {
  // Intent State --------------------
  const [intent, setIntent] = useState("");
  const handleChangeIntent = (event) => {
    setIntent(event.target.value);
  };

  // Context State --------------------
  const [context, setContext] = useState([]);
  const handleDeleteContext = (itemToDelete) => {
    setContext((prevContext) =>
      prevContext.filter((item) => item !== itemToDelete)
    );
  };
  const addContext = (event) => {
    if (event.key === "Enter") {
      setContext((prevContext) => [...prevContext, event.target.value]);
      event.target.value = "";
    }
  };
  const contextElements = (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      {context.map((item) => (
        <Chip
          size="small"
          key={item}
          label={item}
          onDelete={() => handleDeleteContext(item)}
        />
      ))}
      <Input
        disableUnderline
        placeholder="add more"
        onKeyUp={addContext}
        sx={{ fontSize: "13px" }}
      />
    </Box>
  );

  // Utterance State --------------------
  const [utterance, setUtterance] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUtterance = async (event, keywords) => {
    event.preventDefault();
    setError(null);

    if (keywords.trim().length === 0) {
      return setError("Please enter a valid intent or context to start.");
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords: keywords }),
      });

      setIsLoading(false);

      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      const data = await response.json();

      const parseUtterance = (result) => {
        const parsedResult = result.split(/\n\d\.\s/).slice(1);

        return parsedResult.map((sentence) => {
          if (sentence.startsWith('"')) {
            return sentence.replace(/"/g, "");
          } else {
            return sentence;
          }
        });
      };

      setUtterance((prevUtterance) => [
        ...prevUtterance,
        ...parseUtterance(data.result),
      ]);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const clearUtterance = () => {
    setUtterance([]);
    setIsLoading(false);
    setError(null);
  };

  // Popper State --------------------
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

      <Stack spacing={5} alignItems="center" p={6} sx={{ height: "100vh" }}>
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
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Typography sx={{ width: 100, fontWeight: 500 }}>
                    Context
                  </Typography>
                  {contextElements}
                </Stack>
              </Item>

              <Divider />

              <Item>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "text.secondary" }}
                  >
                    Utterances
                  </Typography>
                  <Button onClick={clearUtterance}>Clear All</Button>
                </Stack>
              </Item>
            </Paper>

            {!!utterance.length && (
              <Item sx={{ overflowY: "auto" }}>
                <Stack spacing={2}>
                  {utterance.map((item, index) => {
                    return (
                      <TextField
                        key={index}
                        size="small"
                        defaultValue={item}
                        sx={{ borderRadius: "6px" }}
                      />
                    );
                  })}
                </Stack>
              </Item>
            )}

            <Item sx={{ mb: 2 }} onMouseLeave={handlePopperClose}>
              <Box sx={{ position: "relative" }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  onMouseEnter={handlePopperOpen}
                  sx={{ borderRadius: "10px" }}
                >
                  AI Generate
                </Button>
                {isLoading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Box>

              <Popper
                open={open}
                anchorEl={anchorEl}
                onClick={handlePopperClose}
              >
                <Paper elevation={24} sx={{ width: "434px", p: "8px 0" }}>
                  <Stack>
                    <Button
                      size="large"
                      onClick={(event) => {
                        const keywords = intent.split(" ").join(", ");
                        fetchUtterance(event, keywords);
                      }}
                      sx={{
                        color: "text.primary",
                        fontWeight: 400,
                        justifyContent: "flex-start",
                        pl: 3,
                      }}
                    >
                      Generate with intent only
                    </Button>
                    <Button
                      size="large"
                      onClick={(event) => {
                        const keywords = context.join(", ");
                        fetchUtterance(event, keywords);
                      }}
                      sx={{
                        color: "text.primary",
                        fontWeight: 400,
                        justifyContent: "flex-start",
                        pl: 3,
                      }}
                    >
                      Generate with context only
                    </Button>
                    <Button
                      size="large"
                      onClick={(event) => {
                        const keywords = intent
                          .split(" ")
                          .concat(context)
                          .join(", ");
                        fetchUtterance(event, keywords);
                      }}
                      sx={{
                        color: "text.primary",
                        fontWeight: 400,
                        justifyContent: "flex-start",
                        pl: 3,
                      }}
                    >
                      Generate with intent and context
                    </Button>
                  </Stack>
                </Paper>
              </Popper>

              {error && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}
            </Item>
          </Stack>
        </Paper>
      </Stack>
    </>
  );
}
