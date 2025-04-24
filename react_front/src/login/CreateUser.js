import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material"

const URI_CREATE_USER = "http://localhost:3000/api/v1/users";

const CreateUsers = () => {
  const [name, setName] = useState("");
  const [cellPhoneNumber, setCellPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const id_roleFK = 2;


  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(URI_CREATE_USER, {
        name,
        cellPhoneNumber,
        email,
        password,
        id_roleFK,
      });

      if (response.status === 201) {
        navigate("/"); // Redirigir al login después de crear el usuario
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#2c2c2c",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          maxWidth: isMobile ? 400 : 900,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            padding: isMobile ? 3 : 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: isMobile ? "100%" : "60%",
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
            Crear Usuario
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleCreateUser} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Teléfono"
              value={cellPhoneNumber}
              onChange={(e) => setCellPhoneNumber(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              disabled={loading}
              sx={{ py: 1.5, mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Crear Usuario"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{ mt: 2 }}
            >
              Volver al login
            </Button>
          </Box>
        </CardContent>

        <CardMedia
          component="img"
          image="/fondo_barber.jpg"
          alt="Barbería fondo"
          sx={{
            flex: 1,
            objectFit: "cover",
            minHeight: isMobile ? 200 : 500,
            objectPosition: "center",
            order: isMobile ? -1 : 1,
            width: isMobile ? "100%" : 450,
          }}
        />
      </Card>
    </Box>
  );

  // return (
  //   <div className="login-background">
  //     <div className="login-card">
  //       <h2 className="login-title">Crear Usuario</h2>
  //       {error && <div className="login-error">{error}</div>}
  //       <form onSubmit={handleCreateUser}>
  //         <input
  //           className="login-input"
  //           type="text"
  //           placeholder="Nombre"
  //           value={name}
  //           onChange={(e) => setName(e.target.value)}
  //           required
  //         />
  //         <input
  //           className="login-input"
  //           type="text"
  //           placeholder="Teléfono"
  //           value={cellPhoneNumber}
  //           onChange={(e) => setCellPhoneNumber(e.target.value)}
  //           required
  //         />
  //         <input
  //           className="login-input"
  //           type="email"
  //           placeholder="Correo electrónico"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           required
  //         />
  //         <input
  //           className="login-input"
  //           type="password"
  //           placeholder="Contraseña"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           required
  //         />
          
  //         <button className="login-button" type="submit" disabled={loading}>
  //           {loading ? "Creando..." : "Crear Usuario"}
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );
};

export default CreateUsers;
