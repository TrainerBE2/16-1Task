import * as React from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import useMediaQuery from "@mui/material/useMediaQuery";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useAuth } from "../../contexts/authContext";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";

interface IRegisterInputs {
  email: string;
  username: string;
  password: string;
  passwordUlang: string;
}

const schema = yup
  .object({
    email: yup
      .string()
      .email("Must be an email")
      .required("Required"),
    username: yup
      .string()
      .required("Required"),
    password: yup.string().required("Required"),
    passwordUlang: yup.string().required("Required")
      .oneOf([yup.ref("password")], "Password didn't match"),
  })
  .required();

const Register = () => {
  const theme = useTheme();
  const isTabletScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordUlang, setShowPasswordUlang] = React.useState(false);
  const thisYear = new Date().getFullYear();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowPasswordUlang = () => {
    setShowPasswordUlang((prev) => !prev);
  };

  const initialValues = React.useMemo(
    () => ({
      email: "",
      username: "",
      password: "",
      passwordUlang: "",
    }),
    [],
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IRegisterInputs>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit = (data: IRegisterInputs) => {
    register(data);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh", backgroundColor: "#FFF" }}
      >
        <Box
          display={isTabletScreen ? "flex" : "grid"}
          gridTemplateColumns={isTabletScreen ? undefined : "1fr 1fr"}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mx={isTabletScreen ? 0 : 3}
          gap={isTabletScreen ? 0 : 1}
        >
          <Stack
            alignItems={"flex-start"}
            paddingX={isTabletScreen ? undefined : 7}
          >
            <Typography
              marginTop={3}
              marginBottom={4.5}
              variant="h4"
              component="div"
              textAlign="center"
              fontWeight="bold"
            >
              Register{" "}
            </Typography>
            <form
              style={{
                width: "100%",
                minWidth: "200px",
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    marginBottom={1}
                    variant="body1"
                  >
                    Email
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.email)}
                      >
                        <OutlinedInput
                          id="email"
                          type="email"
                          placeholder="email@gmail.com"
                          size="medium"
                          sx={{ borderRadius: 2 }}
                          {...field}
                        />
                        {errors.email && (
                          <FormHelperText>
                            {errors.email
                              ? errors.email
                                .message
                              : " "}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                    rules={{ required: "Email required" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    marginBottom={1}
                    variant="body1"
                  >
                    Username
                  </Typography>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.email)}
                      >
                        <OutlinedInput
                          id="username"
                          autoComplete=""
                          placeholder="johndoe"
                          size="medium"
                          sx={{ borderRadius: 2 }}
                          {...field}
                        />
                        {errors.username && (
                          <FormHelperText>
                            {errors.username
                              ? errors.username
                                .message
                              : " "}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                    rules={{ required: "Username required" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    marginBottom={1}
                    variant="body1"
                  >
                    Password
                  </Typography>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.password)}
                      >
                        <OutlinedInput
                          id="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          sx={{ borderRadius: 2 }}
                          placeholder="Min 8 character"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={
                                  handleClickShowPassword
                                }
                                edge="end"
                                sx={{
                                  color: "#A8B4AF",
                                }}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          size="medium"
                          {...field}
                        />
                        {errors.password && (
                          <FormHelperText>
                            {errors.password
                              ? errors.password
                                .message
                              : " "}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                    rules={{
                      required: "Passwords required",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    marginBottom={1}
                    variant="body1"
                  >
                    Confirm Password
                  </Typography>
                  <Controller
                    name="passwordUlang"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(errors.password)}
                      >
                        <OutlinedInput
                          id="passwordUlang"
                          type={
                            showPasswordUlang
                              ? "text"
                              : "password"
                          }
                          sx={{ borderRadius: 2 }}
                          placeholder="Min 8 character"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={
                                  handleClickShowPasswordUlang
                                }
                                edge="end"
                                sx={{
                                  color: "#A8B4AF",
                                }}
                              >
                                {showPasswordUlang ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          size="medium"
                          {...field}
                        />
                        {errors.passwordUlang && (
                          <FormHelperText>
                            {errors.passwordUlang
                              ? errors.passwordUlang
                                .message
                              : " "}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                    rules={{
                      required: "Passwords required",
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                disableElevation
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  textTransform: "none",
                  marginTop: 3.5,
                }}
              >
                Register
              </Button>
              <Button
                href="/"
                disableElevation
                fullWidth
                size="large"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  marginTop: 2.5,
                }}
              >
                Login
              </Button>
            </form>
          </Stack>
          {isTabletScreen ? null : (
            <Box>
              <img
                alt="Ilustrasi Main"
                src={"/images/Notes.png"}
                width="100%"
                height="100%"
                style={{ objectFit: "contain" }}
              />
            </Box>
          )}
        </Box>
      </Box>
      <LoadingOverlay open={isLoading} />
    </>
  );
};

export default Register;
