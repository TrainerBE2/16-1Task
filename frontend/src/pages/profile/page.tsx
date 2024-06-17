import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, FormControl, FormHelperText, Grid, IconButton, InputAdornment, OutlinedInput, Tab, Tabs, TextField } from "@mui/material";
import avatarAlt from "../../utils/avatarAlt";
import { useCallback, useEffect, useState } from "react";
import defaultAxios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useModal } from "../../contexts/modalContext";
import { DefaultResponse } from "../../constants/types";
import axios from "../../services/axios";
import { LoadingButton } from "@mui/lab";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useUserData from "../../services/queries/useUserData";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import useUserActivity from "../../services/queries/useUserActivity";
import moment from "moment";

interface IUpdateUser {
  name: string;
  description?: string;
}

interface IUpdatePass {
  passwordLama: string;
  passwordBaru: string;
  passwordUlang: string;
}

const schemaUpdateUser = yup
  .object({
    name: yup
      .string()
      .required("Required"),
    description: yup
      .string(),
  })
  .required();

const schemaUpdatePass = yup
  .object({
    passwordLama: yup.string().required("Required"),
    passwordBaru: yup.string().required("Required"),
    passwordUlang: yup.string().required("Required")
      .oneOf([yup.ref("passwordBaru")], "Password didn't match"),
  })
  .required();

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2, px: 1 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Profile = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordLama, setShowPasswordLama] = React.useState(false);
  const [showPasswordUlang, setShowPasswordUlang] = React.useState(false);
  const theme = useTheme();
  const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const [isEdit, setIsEdit] = React.useState(false);
  const { setFetchingItems } = useModal();
  const { data: dataUser, refetch: refetchUser } = useUserData();
  const { data: dataUserActivity, refetch: refetchUserActivity } = useUserActivity();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowPasswordLama = () => {
    setShowPasswordLama((prev) => !prev);
  };

  const handleClickShowPasswordUlang = () => {
    setShowPasswordUlang((prev) => !prev);
  };

  const handleErrorResponse = useCallback((error: any) => {
    if (defaultAxios.isAxiosError(error)) {
      const serverError = error as AxiosError<any>;
      if (serverError && serverError.response) {
        console.log(`serverError`, serverError.response);
        if (serverError.response!.status === 400) {
          Swal.fire({
            title: "Something's Wrong!",
            text: `${serverError.response.data.data.errors.message}`,
            icon: "error",
            confirmButtonColor: "primary",
            customClass: {
              container: "my-swal",
            },
          });
          console.log("", `${serverError.response.data.data}`, [
            { text: "OK" },
          ]);
        }

        if (serverError.response!.status === 422) {
          Swal.fire({
            title: "Something's Wrong!",
            text: `Ada error validasi`,
            icon: "error",
            confirmButtonColor: "primary",
            customClass: {
              container: "my-swal",
            },
          });
          console.log("", `${serverError.response.data.message}`, [
            { text: "OK" },
          ]);
        }

        if (serverError.response!.status === 403) {
          Swal.fire({
            title: "Something's Wrong!",
            text: `${serverError.response.data.message}`,
            icon: "error",
            confirmButtonColor: "primary",
            customClass: {
              container: "my-swal",
            },
          });
          console.log("", `${serverError.response.data.data}`, [
            { text: "OK" },
          ]);
        }
      } else {
        console.log("", `Something's Wrong! Silahkan coba lagi.`, [
          { text: "OK" },
        ]);
      }
    }
  }, []);

  const refetch = useCallback(
    async () => {
      try {
        refetchUser();
        refetchUserActivity();
      } catch (error) {
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [handleErrorResponse, refetchUser, refetchUserActivity],
  );

  const initialValuesUpdateUser = React.useMemo(
    () => ({
      name: dataUser?.username,
      description: dataUser?.bio,
    }),
    [dataUser?.username, dataUser?.bio],
  );

  const {
    handleSubmit: handleSubmitUpdateUser,
    formState: { errors: errorsUpdateUser },
    control: controlUpdateUser,
    reset: resetUpdateUser,
  } = useForm<IUpdateUser>({
    resolver: yupResolver(schemaUpdateUser),
    defaultValues: initialValuesUpdateUser,
  });

  const UpdateUser = useCallback(
    async (values: IUpdateUser) => {
      setLoading(true);
      try {
        const { data: dataN } = await axios.put<DefaultResponse>(
          `users/username`, {
          username: values.name,
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        const { data: dataD } = await axios.put<DefaultResponse>(
          `users/bio`, {
          bio: values.description,
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        if (!dataN.errno || !dataD.errno) {
          Swal.fire({
            title: "User Updated",
            position: "bottom-end",
            showConfirmButton: false,
            icon: "success",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showCloseButton: true,
            customClass: {
              container: "my-swal",
            },
          });
          refetch();
          setFetchingItems();
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [handleErrorResponse, refetch, setFetchingItems],
  );

  const onSubmitUpdateUser = (data: IUpdateUser) => {
    UpdateUser(data);
  };

  const initialValuesUpdatePass = React.useMemo(
    () => ({
      passwordLama: '',
      passwordBaru: '',
      passwordUlang: '',
    }),
    [],
  );

  const {
    handleSubmit: handleSubmitUpdatePass,
    formState: { errors: errorsUpdatePass },
    control: controlUpdatePass,
    reset: resetUpdatePass,
  } = useForm<IUpdatePass>({
    resolver: yupResolver(schemaUpdatePass),
    defaultValues: initialValuesUpdatePass,
  });

  const UpdatePass = useCallback(
    async (values: IUpdatePass) => {
      setLoading(true);
      try {
        const { data: dataN } = await axios.put<DefaultResponse>(
          `users/password`, {
          old_password: values.passwordLama,
          new_password: values.passwordBaru,
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
        );
        if (!dataN.errno) {
          Swal.fire({
            title: "Password Updated",
            position: "bottom-end",
            showConfirmButton: false,
            icon: "success",
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showCloseButton: true,
            customClass: {
              container: "my-swal",
            },
          });
          refetch();
          resetUpdatePass();
          setFetchingItems();
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error)
        handleErrorResponse(error);
      }
    },
    [handleErrorResponse, refetch, resetUpdatePass, setFetchingItems],
  );

  const onSubmitUpdatePass = (data: IUpdatePass) => {
    UpdatePass(data);
  };

  useEffect(() => {
    if (dataUser) {
      resetUpdateUser(initialValuesUpdateUser);
    }
  }, [dataUser, initialValuesUpdateUser, resetUpdateUser]);

  return (
    <Stack spacing={4.5}>
      <Grid
        alignItems="center"
        padding={2}
      >
        {dataUser &&
          <Grid item xs={12} mb={2} py={2}>
            <Stack flexDirection={'row'} gap={1} justifyContent={"space-between"}>
              <Stack flexDirection={'row'} gap={1} alignItems={"flex-start"}>
                <IconButton sx={{ p: 0 }} >
                  <Avatar
                    sx={{
                      backgroundColor: "#7C8883",
                      width: 56,
                      height: 56,
                      color: "white"
                    }}
                    sizes="large"
                    alt={dataUser.username}
                    variant="circular"
                  >
                    <Typography fontSize={36}>
                      {avatarAlt(dataUser.username)}
                    </Typography>
                  </Avatar>
                </IconButton>
                <Stack>
                  <Typography
                    fontWeight={"600"}
                  >
                    {dataUser.username}
                  </Typography>
                  <Typography
                  >
                    {dataUser.bio}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        }
        <>
          <Box
            sx={{
              borderBottom:
                "1px solid var(--background-primary-dark, #CAD9D4)",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="basic tabs example"
            >
              <Tab
                label="Info"
                sx={{
                  textTransform: "none",
                }}
                {...a11yProps(0)}
              />
              <Tab
                label="Activity"
                sx={{
                  textTransform: "none",
                }}
                {...a11yProps(1)}
              />

            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Stack flex={1} gap={3}>
              <Stack flex={1} flexDirection={"column"} gap={1.5}>
                <Stack flexDirection={"column"} gap={0.5}>
                  <Typography
                    fontWeight={500}
                  >
                    Username
                  </Typography>
                  <Controller
                    control={controlUpdateUser}
                    name="name"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="name"
                        size="medium"
                        error={Boolean(errorsUpdateUser.name)}
                        helperText={
                          errorsUpdateUser.name
                            ? errorsUpdateUser.name.message
                            : ""
                        }
                      />
                    )}
                  />
                </Stack>
                <Stack flexDirection={"column"} gap={0.5}>
                  <Stack flexDirection={'row'} gap={0.5}>
                    <Typography
                      fontWeight={500}
                    >
                      Bio
                    </Typography>
                    <Typography
                      fontWeight={500}
                      display={"inline"}
                      color="#7C8883"
                    >
                      (optional)
                    </Typography>
                  </Stack>
                  <Controller
                    control={controlUpdateUser}
                    name="description"
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        size="medium"
                        id="description"
                        error={Boolean(errorsUpdateUser.description)}
                        helperText={
                          errorsUpdateUser.description
                            ? errorsUpdateUser.description.message
                            : ""
                        }
                        {...field}
                      />)}
                  />
                </Stack>
                <LoadingButton
                  loading={isLoading}
                  onClick={handleSubmitUpdateUser(onSubmitUpdateUser)}
                  size="small"
                  fullWidth={isPhoneScreen}
                  variant="contained"
                  type="submit"
                  color="buttongreen"
                  sx={{
                    fontWeight: "bold",
                    marginTop: isPhoneScreen ? 2 : 0,
                    py: 1,
                    px: 2,
                  }}
                >
                  Save
                </LoadingButton>
              </Stack>
              <Stack flex={1} flexDirection={"column"} gap={1.5}>
                <Grid item xs={12}>
                  <Typography
                    marginBottom={0.5}
                    fontWeight={500}
                  >
                    Old Password
                  </Typography>
                  <Controller
                    name="passwordLama"
                    control={controlUpdatePass}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(errorsUpdatePass.passwordLama)}
                      >
                        <OutlinedInput
                          id="passwordLama"
                          type={
                            showPasswordLama
                              ? "text"
                              : "password"
                          }
                          sx={{ borderRadius: 2 }}
                          placeholder="Min 8 character"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={
                                  handleClickShowPasswordLama
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
                        {errorsUpdatePass.passwordLama && (
                          <FormHelperText>
                            {errorsUpdatePass.passwordLama
                              ? errorsUpdatePass.passwordLama
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
                    marginBottom={0.5}
                    fontWeight={500}
                  >
                    New Password
                  </Typography>
                  <Controller
                    name="passwordBaru"
                    control={controlUpdatePass}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(errorsUpdatePass.passwordBaru)}
                      >
                        <OutlinedInput
                          id="passwordBaru"
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
                        {errorsUpdatePass.passwordBaru && (
                          <FormHelperText>
                            {errorsUpdatePass.passwordBaru
                              ? errorsUpdatePass.passwordBaru
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
                    marginBottom={0.5}
                    fontWeight={500}
                  >
                    Confirm Password
                  </Typography>
                  <Controller
                    name="passwordUlang"
                    control={controlUpdatePass}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(errorsUpdatePass.passwordUlang)}
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
                        {errorsUpdatePass.passwordUlang && (
                          <FormHelperText>
                            {errorsUpdatePass.passwordUlang
                              ? errorsUpdatePass.passwordUlang
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
                <LoadingButton
                  loading={isLoading}
                  onClick={handleSubmitUpdatePass(onSubmitUpdatePass)}
                  size="small"
                  fullWidth={isPhoneScreen}
                  variant="contained"
                  type="submit"
                  color="buttonblue"
                  sx={{
                    fontWeight: "bold",
                    marginTop: isPhoneScreen ? 2 : 0,
                    py: 1,
                    px: 2,
                  }}
                >
                  Change Password
                </LoadingButton>
              </Stack>
            </Stack>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Stack gap={2}>
              {dataUser && dataUserActivity && dataUserActivity.length > 0 && dataUserActivity.map((dat, idx) =>
                <Stack key={String(idx)} flexDirection={'row'} gap={1}>
                  <Avatar
                    sx={{
                      backgroundColor: "secondary.main",
                      width: 40, height: 40,
                      color: 'white',
                      borderColor: 'primary.main',
                      border: 1,
                    }}
                    alt={dataUser.username ?? "-"}
                  >
                    {avatarAlt(dataUser.username ?? "A")}
                  </Avatar>
                  <Stack flex={1} mt={0.25}>
                    <Stack flexDirection={isPhoneScreen ? 'column' : 'row'} gap={0.5}>
                      <Typography
                        fontSize={14}
                        fontWeight={700}
                        color={'primary.main'}
                      >
                        {`You `}
                        {`${dat.detailed}`}
                      </Typography>
                    </Stack>
                    <Typography
                      fontSize={14}
                      color={'secondary.main'}
                    >
                      {`${moment(dat.created_at, 'YYYY-MM-DD').format('DD MMMM YYYY')}`}
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </TabPanel>
        </>
      </Grid>
    </Stack>
  );
};

export default Profile;
