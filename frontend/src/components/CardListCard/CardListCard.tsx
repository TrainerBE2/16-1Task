import { Card, Stack, IconButton, CardActionArea, Typography, Box, Chip, Tooltip, AvatarGroup, Avatar, Dialog, DialogTitle, DialogContent, useMediaQuery, useTheme, Button, TextField, Menu, LinearProgress, linearProgressClasses, styled, Autocomplete } from "@mui/material";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import defaultAxios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import axios from "../../services/axios";
import { DefaultResponse } from "../../constants/types";
import { useAuth } from "../../contexts/authContext";
import useCardActivity from "../../services/queries/useCardActivity";
import useCardMember from "../../services/queries/useCardMember";
import useCardChecklist from "../../services/queries/useCardChecklist";
import useCardComment from "../../services/queries/useCardComment";
import useCardCover from "../../services/queries/useCardCover";
import useCardDate from "../../services/queries/useCardDate";
import useCardLabel from "../../services/queries/useCardLabel";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment, { Moment } from "moment";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SubjectIcon from '@mui/icons-material/Subject';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import avatarAlt from "../../utils/avatarAlt";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import { SketchPicker } from "react-color";
import PaletteIcon from '@mui/icons-material/Palette';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import useWorkspaceMembers from "../../services/queries/useWorkspaceMembers";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface ICardListCardProps {
    id: number;
    idList: number;
    namaUser: string;
    level: string;
    namaCard: string;
    namaList: string;
    desc: string;
    refetch?: () => void;
}

const CardListCard = ({
    id,
    idList,
    namaUser,
    level,
    namaCard,
    namaList,
    refetch,
    desc,
}: ICardListCardProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [valueD, setValueD] = React.useState<Moment | null>(moment());

    const { workspaceId } = useAuth();
    const [hoveringItems, setHoveringItems] = useState<number[]>([]);
    const [hoveringItemsM, setHoveringItemsM] = useState<number[]>([]);
    const theme = useTheme();
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [inviteMember, setInviteMember] = useState();
    const { data: dataCardActivity, refetch: refetchCardActivity } = useCardActivity(id);
    const { data: dataCardMember, refetch: refetchCardMember } = useCardMember(id);
    const { data: dataCardChecklist, refetch: refetchCardChecklist } = useCardChecklist(id);
    const { data: dataCardComment, refetch: refetchCardComment } = useCardComment(id);
    const { data: dataCardCover, refetch: refetchCardCover } = useCardCover(id);
    const { data: dataCardDate, refetch: refetchCardDate } = useCardDate(id);
    const { data: dataCardLabel, refetch: refetchCardLabel } = useCardLabel(id);
    const { data: dataMembers } = useWorkspaceMembers(workspaceId);

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isPast, setIsPast] = useState<boolean>(false);
    const isPhoneScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
    const [isOpenModalListCard, setIsOpenModalListCard] = useState(false);
    const [colorHex, setColorHex] = useState<string>();
    const [colorLabel, setColorLabel] = useState<string>('');
    const [checklistCard, setChecklistCard] = useState<string>();
    const [label, setLabel] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [description, setDesc] = useState<string>(desc);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorElM, setAnchorElM] = React.useState<null | HTMLElement>(null);
    const [anchorElL, setAnchorElL] = React.useState<null | HTMLElement>(null);
    const [anchorElD, setAnchorElD] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const openM = Boolean(anchorElM);
    const handleClickM = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElM(event.currentTarget);
    };
    const handleCloseM = () => {
        setAnchorElM(null);
    };

    const openL = Boolean(anchorElL);
    const handleClickL = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElL(event.currentTarget);
    };
    const handleCloseL = () => {
        setAnchorElL(null);
    };

    const openD = Boolean(anchorElD);
    const handleClickD = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElD(event.currentTarget);
    };
    const handleCloseD = () => {
        setAnchorElD(null);
    };

    function handleHover(index: number, isLeaving: boolean) {
        setHoveringItems((prevItems) => {
            if (isLeaving) return prevItems.filter((item) => item !== index);
            return [...prevItems, index];
        });
    }

    function handleHoverM(index: number, isLeaving: boolean) {
        setHoveringItemsM((prevItems) => {
            if (isLeaving) return prevItems.filter((item) => item !== index);
            return [...prevItems, index];
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const closeModalListCard = () => {
        setIsOpenModalListCard(false);
        setDesc(desc ?? '');
    };
    const handleChangeChecklist = (event: ChangeEvent<HTMLInputElement>) => {
        setChecklistCard(event.target.value);
    };
    const handleChangeLabel = (event: ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value);
    };
    const handleChangeDesc = (event: ChangeEvent<HTMLInputElement>) => {
        setDesc(event.target.value);
    };
    const handleChangeComm = (event: ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const handleErrorResponse = useCallback((error: any) => {
        if (defaultAxios.isAxiosError(error)) {
            const serverError = error as AxiosError<any>;
            if (serverError && serverError.response) {
                console.log(`serverError`, serverError.response);
                if (serverError.response!.status === 400) {
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

                if (serverError.response!.status === 409) {
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

    const refetchs = useCallback(
        async () => {
            try {
                refetchCardActivity();
                refetchCardMember();
                refetchCardChecklist();
                refetchCardComment();
                refetchCardCover();
                refetchCardDate();
                refetchCardLabel();
            } catch (error) {
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [handleErrorResponse, refetchCardActivity, refetchCardChecklist, refetchCardComment, refetchCardCover, refetchCardDate, refetchCardLabel, refetchCardMember],
    );

    const newCover = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultResponse>(
                    `card/${id}/cover`, {
                    cover: colorHex,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, colorHex, handleErrorResponse, id, refetchs],
    );

    const deleteCard = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.delete<DefaultResponse>(
                    `card/${id}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetch && refetch();
                    closeModalListCard();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetch],
    );

    const addCollabolator = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultResponse>(
                    `card/${id}/member`, {
                    user_id: inviteMember,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                    handleCloseM();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                handleCloseM();
                console.log(error);
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, inviteMember, refetchs],
    );

    const addComment = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultResponse>(
                    `card/${id}/comment`, {
                    comment: comment,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                    setComment('');
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [id, comment, refetchs, closeModalListCard, handleErrorResponse],
    );

    const addChecklist = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultResponse>(
                    `card/${id}/checklist`, {
                    title: checklistCard,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                    setChecklistCard('');
                    handleClose();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
                closeModalListCard();
                handleClose();
                handleErrorResponse(error);
            }
        },
        [checklistCard, closeModalListCard, handleErrorResponse, id, refetchs],
    );

    const addDate = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultResponse>(
                    `card/${id}/date`, {
                    deadline: moment(valueD).add(1, 'days').format('YYYY-MM-DD'),
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                    handleCloseD();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                handleCloseD();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetchs, valueD],
    );

    const addLabel = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.post<DefaultResponse>(
                    `card/${id}/label`, {
                    color: colorLabel,
                    title: label,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                    setLabel('');
                    handleCloseL();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                handleCloseL();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, colorLabel, handleErrorResponse, id, label, refetchs],
    );

    const updateDate = useCallback(
        async (ids: number) => {
            setLoading(true);
            try {
                const { data } = await axios.put<DefaultResponse>(
                    `card/${id}/date/${ids}`, {
                    deadline: moment(valueD).add(1, 'days').format('YYYY-MM-DD'),
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                    handleCloseD();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                handleCloseD();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetchs, valueD],
    );

    const doneChecklist = useCallback(
        async (ids: number) => {
            setLoading(true);
            try {
                const { data } = await axios.put<DefaultResponse>(
                    `card/${id}/checklist/${ids}/done`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetchs],
    );

    const updateDesc = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.put<DefaultResponse>(
                    `list/${idList}/card/${id}`, {
                    description: description,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetch && refetch();
                    setIsEdit(false);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setIsEdit(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, description, handleErrorResponse, id, idList, refetch],
    );

    const unDoneChecklist = useCallback(
        async (ids: number) => {
            setLoading(true);
            try {
                const { data } = await axios.put<DefaultResponse>(
                    `card/${id}/checklist/${ids}/not-yet`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetchs],
    );

    const deleteChecklist = useCallback(
        async (ids: number) => {
            setLoading(true);
            try {
                const { data } = await axios.delete<DefaultResponse>(
                    `card/${id}/checklist/${ids}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetchs],
    );

    const deleteComment = useCallback(
        async (ids: number) => {
            setLoading(true);
            try {
                const { data } = await axios.delete<DefaultResponse>(
                    `card/${id}/comment/${ids}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetchs],
    );

    const deleteDate = useCallback(
        async (ids: number) => {
            setLoading(true);
            try {
                const { data } = await axios.delete<DefaultResponse>(
                    `card/${id}/date/${ids}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetchs],
    );

    const deleteMember = useCallback(
        async (ids: number) => {
            setLoading(true);
            try {
                const { data } = await axios.delete<DefaultResponse>(
                    `card/${id}/member/${ids}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetchs],
    );

    const deleteLabel = useCallback(
        async (ids: number) => {
            setLoading(true);
            try {
                const { data } = await axios.delete<DefaultResponse>(
                    `card/${id}/label/${ids}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, handleErrorResponse, id, refetchs],
    );

    const updateCover = useCallback(
        async () => {
            setLoading(true);
            try {
                const { data } = await axios.put<DefaultResponse>(
                    `card/${id}/cover`, {
                    cover: colorHex,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
                );
                if (!data.errno) {
                    refetchs();
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                closeModalListCard();
                console.log(error)
                handleErrorResponse(error);
            }
        },
        [closeModalListCard, colorHex, handleErrorResponse, id, refetchs],
    );

    const BorderLinearProgress = useMemo(
        () =>
            styled(LinearProgress)(({ theme }) => ({
                height: 8,
                borderRadius: 5,
                [`&.${linearProgressClasses.colorPrimary}`]: {
                    backgroundColor:
                        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
                },
                [`& .${linearProgressClasses.bar}`]: {
                    borderRadius: 5,
                    background: "linear-gradient(90deg, #D8DADB 0%, #868686 100.33%)",
                },
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataCardChecklist]
    );

    const progressMember = useMemo(() => {
        const result =
            (Number(dataCardChecklist?.filter((el) => el.status_id === 2).length ?? 0) /
                Number(dataCardChecklist?.length ?? 0)) *
            100;

        return Math.ceil(result) > 100 ? 100 : Math.ceil(result);
    }, [dataCardChecklist]);

    React.useEffect(() => {
        refetchs();
    }, [refetchs]);

    React.useEffect(() => {
        if (dataCardCover && dataCardCover.length > 0 && dataCardCover[0].cover) {
            setColorHex(dataCardCover[0].cover);
        }
    }, [dataCardCover]);

    React.useEffect(() => {
        if (colorHex && level !== "see") {
            if (dataCardCover && dataCardCover.length > 0 && dataCardCover[0].cover) {
                updateCover();
            } else {
                newCover();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colorHex]);

    React.useEffect(() => {
        if (dataCardDate && dataCardDate.length > 0) {
            setValueD(moment(dataCardDate[0].deadline, 'YYYY-MM-DD'))
            var dDiff = moment().diff(moment(dataCardDate[0].deadline, 'YYYY-MM-DD'));
            if (dDiff > 0) {
                setIsPast(false);
            } else {
                setIsPast(true);
            }
        }
    }, [dataCardDate]);

    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: 'secondary.main',
                borderRadius: 2,
                minWidth: 200,
            }}
        >
            <CardActionArea onClick={() => setIsOpenModalListCard(true)}>
                {dataCardCover && dataCardCover.length > 0 &&
                    <Stack py={2} whiteSpace={'normal'} bgcolor={dataCardCover[0].cover}>
                    </Stack>
                }
                <Stack py={1}>
                    {dataCardLabel && dataCardLabel.length > 0 &&
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(6, 1fr)"
                            gap={0.6}
                            px={1.5}
                        >
                            {dataCardLabel.map((dat, idx) =>
                                <Stack key={String(idx)} flexDirection={'row'}><Tooltip
                                    title={dat.label_title}
                                    slotProps={{
                                        popper: {
                                            modifiers: [
                                                {
                                                    name: 'offset',
                                                    options: {
                                                        offset: [0, -14],
                                                    },
                                                },
                                            ],
                                        },
                                    }}
                                >
                                    <Chip size="small" label={""} sx={{ backgroundColor: dat.color, color: 'white', borderRadius: 1, width: 35, height: 10 }} />
                                </Tooltip> </Stack>
                            )}
                        </Box>
                    }
                    <Stack px={1.5} py={0.5} whiteSpace={'normal'}>
                        <Typography fontSize={14} color={"white"}>{namaCard}</Typography>
                    </Stack>
                    <Stack px={1.5} py={0.5} flexDirection={'row'} gap={0.5} alignItems={'center'} justifyContent={'space-between'}>
                        <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                            {dataCardDate && dataCardDate.length > 0 && <Tooltip
                                title={`This card is due on ${moment(dataCardDate[0].deadline, 'YYYY-MM-DD').format('DD MMM YYYY')}`}
                                slotProps={{
                                    popper: {
                                        modifiers: [
                                            {
                                                name: 'offset',
                                                options: {
                                                    offset: [0, -14],
                                                },
                                            },
                                        ],
                                    },
                                }}
                            >
                                <Chip icon={<AccessTimeIcon style={{ color: dataCardChecklist && dataCardChecklist.filter((el) => el.status_id === 2).length === dataCardChecklist.length ? 'white' : isPast ? 'black' : 'white' }} />} size="small" label={`${moment(dataCardDate[0].deadline, 'YYYY-MM-DD').format('MMM DD')}`} sx={{ backgroundColor: dataCardChecklist && dataCardChecklist.filter((el) => el.status_id === 2).length === dataCardChecklist.length ? 'buttongreen.main' : isPast ? "buttonyellow.main" : "error.main", color: dataCardChecklist && dataCardChecklist.filter((el) => el.status_id === 2).length === dataCardChecklist.length ? 'white' : isPast ? 'black' : 'white', borderRadius: 1 }} />
                            </Tooltip>}
                            {dataCardChecklist && dataCardChecklist.length > 0 &&
                                <Stack flexDirection={'row'} alignItems={'center'}>
                                    <CheckBoxOutlinedIcon sx={{ color: dataCardChecklist.filter((el) => el.status_id === 2).length === dataCardChecklist.length ? 'buttongreen.main' : 'white', width: 20, height: 20, mr: 0.5 }} />
                                    <Typography
                                        fontSize={14}
                                        color={dataCardChecklist.filter((el) => el.status_id === 2).length === dataCardChecklist.length ? 'buttongreen.main' : 'white'}
                                    >
                                        {dataCardChecklist.filter((el) => el.status_id === 2).length}/{dataCardChecklist.length}
                                    </Typography>
                                </Stack>
                            }
                        </Stack>

                        {dataCardMember && dataCardMember.length > 0 &&
                            <AvatarGroup max={2} sx={{
                                '& .MuiAvatar-root': { width: 32, height: 32, borderColor: 'primary.main', },
                            }}>
                                {dataCardMember.map((dat, idx) =>
                                    <Tooltip key={String(idx)} title={dat?.member_username ?? "-"} slotProps={{
                                        popper: {
                                            modifiers: [
                                                {
                                                    name: 'offset',
                                                    options: {
                                                        offset: [0, -14],
                                                    },
                                                },
                                            ],
                                        },
                                    }}>
                                        <Avatar
                                            sx={{
                                                backgroundColor: "secondary.main",
                                                width: 32, height: 32,
                                                color: 'white',
                                            }}
                                            alt={dat?.member_username ?? "-"}
                                        >
                                            {avatarAlt(dat?.member_username ?? "A")}
                                        </Avatar>
                                    </Tooltip>
                                )}
                            </AvatarGroup>
                        }
                    </Stack>
                </Stack>
            </CardActionArea>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
                fullScreen={isPhoneScreen}
                open={isOpenModalListCard}
                onClose={closeModalListCard}
                PaperProps={{
                    sx: {
                        borderRadius: isPhoneScreen ? 0 : 2,
                        maxWidth: "768px",
                        border: 0,
                        backgroundColor: 'secondary.main'
                    },
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    bgcolor={dataCardCover && dataCardCover.length > 0 && dataCardCover[0].cover ? dataCardCover[0].cover : 'primary.main'}
                >
                    <DialogTitle
                        sx={{ padding: 0 }}
                        fontSize={32}
                        fontWeight={700}
                    >
                        <IconButton disabled={level === 'see'}
                            onClick={level !== 'see' ? () => setDisplayColorPicker(true) : undefined} sx={{ py: 4.5, px: 3, color: level !== 'see' ? 'white' : dataCardCover && dataCardCover.length > 0 && dataCardCover[0].cover ? dataCardCover[0].cover : 'primary.main' }}
                        >
                            <PaletteIcon />
                        </IconButton>
                        {displayColorPicker ? (
                            <Box
                                sx={{
                                    position:
                                        "absolute",
                                    top: "10px",
                                    left: "10px",
                                    zIndex: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        position:
                                            "fixed",
                                        top: "0px",
                                        right: "0px",
                                        bottom: "0px",
                                        left: "0px",
                                    }}
                                    onClick={() =>
                                        setDisplayColorPicker(
                                            false,
                                        )
                                    }
                                />
                                <SketchPicker
                                    color={colorHex}
                                    onChangeComplete={(color) =>
                                        setColorHex(
                                            color.hex,
                                        )
                                    }
                                />
                            </Box>
                        ) : null}
                    </DialogTitle>
                </Stack>
                <IconButton
                    aria-label="close"
                    onClick={closeModalListCard}
                    sx={{
                        color: 'white',
                        position: 'absolute',
                        top: 5,
                        right: 5,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent
                    sx={{
                        px: 3,
                        py: 2,
                    }}
                >
                    <Stack flexDirection={"column"} gap={3} pb={2} flex={1}>
                        <Stack flexDirection={'row'} gap={4} justifyContent={'space-between'}>
                            <Stack flexDirection={"column"} gap={3} flex={1}>
                                <Stack flexDirection={"row"} gap={1}>
                                    <CreditCardIcon sx={{ color: 'white' }} />
                                    <Stack gap={0.5} flex={1}>
                                        <Typography
                                            fontWeight={600}
                                            fontSize={16}
                                            color={'white'}
                                        >
                                            {namaCard}
                                        </Typography>
                                        <Typography
                                            fontSize={12}
                                            color={'white'}
                                        >
                                            in list {namaList}
                                        </Typography>
                                        <BorderLinearProgress
                                            sx={{ maxWidth: 470 }}
                                            variant="determinate"
                                            value={progressMember}
                                        />
                                        <Stack gap={2} mt={3}>
                                            <Stack flexDirection={'row'} gap={3} flex={1}>
                                                {dataCardMember && dataCardMember.length > 0 &&
                                                    <Stack gap={0.5}>
                                                        <Typography
                                                            fontWeight={600}
                                                            fontSize={12}
                                                            color={'white'}
                                                        >
                                                            Members
                                                        </Typography>
                                                        <Stack flexDirection={'row'} alignItems={'center'}>
                                                            <Box
                                                                display="grid"
                                                                gridTemplateColumns="repeat(6, 1fr)"
                                                            >
                                                                {dataCardMember.map((dat, idx) =>
                                                                    <Tooltip onMouseEnter={level === 'see' ? undefined : () => handleHoverM(dat.member_id, false)}
                                                                        onMouseLeave={level === 'see' ? undefined : () => handleHoverM(dat.member_id, true)} key={String(idx)} title={dat?.member_username ?? "-"} slotProps={{
                                                                            popper: {
                                                                                modifiers: [
                                                                                    {
                                                                                        name: 'offset',
                                                                                        options: {
                                                                                            offset: [0, -14],
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            },
                                                                        }}>
                                                                        <IconButton onClick={level === 'see' ? undefined : () => deleteMember(dat.member_id)} sx={{ p: 0.5 }}>
                                                                            {hoveringItemsM.includes(dat.member_id) ? (
                                                                                <Avatar
                                                                                    sx={{
                                                                                        backgroundColor: "primary.main",
                                                                                        width: 32, height: 32,
                                                                                        color: 'error.main',
                                                                                        borderColor: 'primary.main',
                                                                                        border: 1,
                                                                                    }}
                                                                                    alt={dat?.member_username ?? "-"}
                                                                                >
                                                                                    {avatarAlt(dat?.member_username ?? "A")}
                                                                                </Avatar>
                                                                            ) : (
                                                                                <Avatar
                                                                                    sx={{
                                                                                        backgroundColor: "secondary.main",
                                                                                        width: 32, height: 32,
                                                                                        color: 'white',
                                                                                        borderColor: 'primary.main',
                                                                                        border: 1,
                                                                                    }}
                                                                                    alt={dat?.member_username ?? "-"}
                                                                                >
                                                                                    {avatarAlt(dat?.member_username ?? "A")}
                                                                                </Avatar>
                                                                            )}
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                }
                                                {dataCardLabel && dataCardLabel.length > 0 &&
                                                    <Stack gap={0.5}>
                                                        <Typography
                                                            fontWeight={600}
                                                            fontSize={12}
                                                            color={'white'}
                                                        >
                                                            Labels
                                                        </Typography>
                                                        <Box
                                                            display="grid"
                                                            gridTemplateColumns="repeat(2, 1fr)"
                                                            gap={0.7}
                                                        >
                                                            {dataCardLabel.map((dat, idx) =>
                                                                <Stack key={String(idx)} flexDirection={'row'}>
                                                                    <IconButton onClick={level === 'see' ? undefined : () => deleteLabel(dat.label_id)} sx={{ p: 0.5 }} onMouseEnter={level === 'see' ? undefined : () => handleHover(dat.label_id, false)}
                                                                        onMouseLeave={level === 'see' ? undefined : () => handleHover(dat.label_id, true)}>
                                                                        {hoveringItems.includes(dat.label_id) ? (
                                                                            <Chip label={dat.label_title} sx={{ backgroundColor: 'primary.main', color: 'error.main', borderRadius: 1 }} />
                                                                        ) : (
                                                                            <Chip label={dat.label_title} sx={{ backgroundColor: dat.color, color: 'white', borderRadius: 1 }} />
                                                                        )}
                                                                    </IconButton>
                                                                </Stack>
                                                            )}
                                                        </Box>
                                                    </Stack>
                                                }
                                            </Stack>
                                            {dataCardDate && dataCardDate.length > 0 &&
                                                <Stack gap={0.5}>
                                                    <Typography
                                                        fontWeight={600}
                                                        fontSize={12}
                                                        color={'white'}
                                                    >
                                                        Due date
                                                    </Typography>
                                                    <Stack flexDirection={'row'}>
                                                        <Chip icon={<AccessTimeIcon style={{ color: dataCardChecklist && dataCardChecklist.filter((el) => el.status_id === 2).length === dataCardChecklist.length ? 'white' : isPast ? 'black' : 'white' }} />} label={`${moment(dataCardDate[0].deadline, 'YYYY-MM-DD').format('DD MMMM YYYY')}`} sx={{ backgroundColor: dataCardChecklist && dataCardChecklist.filter((el) => el.status_id === 2).length === dataCardChecklist.length ? 'buttongreen.main' : isPast ? "buttonyellow.main" : "error.main", color: dataCardChecklist && dataCardChecklist.filter((el) => el.status_id === 2).length === dataCardChecklist.length ? 'white' : isPast ? 'black' : 'white', borderRadius: 1 }} />
                                                    </Stack>
                                                </Stack>}
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack gap={1.5}>
                                    <Stack flexDirection={"row"} gap={1}>
                                        <SubjectIcon sx={{ color: 'white' }} />
                                        <Stack gap={0.5} flex={1}>
                                            <Typography
                                                fontWeight={600}
                                                color={'white'}
                                            >
                                                Description
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack ml={3.5} flex={1} gap={1.5}>
                                        <TextField
                                            contentEditable={level !== 'see'}
                                            multiline
                                            value={description}
                                            onChange={level !== 'see' ? handleChangeDesc : undefined}
                                            onFocus={level !== 'see' ? () => setIsEdit(true) : undefined}
                                            rows={5}
                                            hiddenLabel
                                            placeholder="Write a description..."
                                            variant="filled"
                                            size="small"
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    backgroundColor: 'primary.main',
                                                    borderRadius: 2,
                                                    color: 'white !important',
                                                    minWidth: 303,
                                                    maxWidth: 470,
                                                },
                                                '& .MuiInputBase-input': {
                                                    color: 'white !important',
                                                },
                                                '& .MuiInputBase-multiline': {
                                                    color: 'white !important',
                                                },
                                                '& .MuiInput-underline:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:after': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:hover:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiFilledInput-underline:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiFilledInput-underline:after': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiFilledInput-underline:hover:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                    color: 'white !important',
                                                },
                                                '& .MuiInputBase-multiline.Mui-disabled': {
                                                    color: 'white !important',
                                                },
                                            }}
                                        />
                                        {isEdit &&
                                            <Stack flex={1} alignItems={'flex-end'}>
                                                <Button onClick={updateDesc} variant="contained" color="success" size="small" sx={{ fontSize: 14, height: 35, width: 169 }}>
                                                    Save
                                                </Button>
                                            </Stack>
                                        }
                                    </Stack>
                                </Stack>
                                {dataCardChecklist && dataCardChecklist.length > 0 &&
                                    <Stack>
                                        <Stack flexDirection={"row"} gap={1}>
                                            <CheckBoxOutlinedIcon sx={{ color: 'white' }} />
                                            <Stack gap={0.5} flex={1}>
                                                <Typography
                                                    fontWeight={600}
                                                    color={'white'}
                                                >
                                                    Checklist
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        {dataCardChecklist.map((dat, idx) =>
                                            <Stack key={String(idx)} flexDirection={'row'} justifyContent={'space-between'}>
                                                <Stack flexDirection={'row'} alignItems={'center'} ml={1} gap={0.2}>
                                                    <CustomCheckbox
                                                        disabled={level === 'see'}
                                                        onChange={() => { dat.status_id === 1 ? doneChecklist(dat.checklist_id) : unDoneChecklist(dat.checklist_id) }}
                                                        checked={
                                                            dat.status_id === 1 ? false : true
                                                        }
                                                    />
                                                    <Typography
                                                        fontWeight={500}
                                                        color={'white'}
                                                        sx={{ textDecorationLine: dat.status_id === 2 ? 'line-through' : undefined }}
                                                    >
                                                        {dat.checklist_title}
                                                    </Typography>
                                                </Stack>
                                                {level === 'delete' &&
                                                    <IconButton
                                                        aria-label="close"
                                                        onClick={() => deleteChecklist(dat.checklist_id)}
                                                        sx={{
                                                            color: 'error.main',
                                                        }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>}
                                            </Stack>
                                        )}
                                    </Stack>
                                }
                            </Stack>
                            {level !== 'see' &&
                                <Stack gap={0.5}>
                                    {level === 'delete' &&
                                        <Button variant="contained" color="error" size="small" sx={{ fontSize: 14, height: 35, width: 169 }} onClick={deleteCard}>
                                            Delete Card
                                        </Button>}
                                    <Typography
                                        mt={2.5}
                                        ml={0.5}
                                        fontSize={12}
                                        color={'white'}
                                    >
                                        Add to card
                                    </Typography>
                                    <Button onClick={handleClickM} variant="contained" size="small" startIcon={<PersonOutlineIcon sx={{ width: 14, height: 14 }} />} sx={{ fontSize: 14, height: 35, width: 171, justifyContent: 'flex-start' }}>
                                        Members
                                    </Button>
                                    <Menu
                                        elevation={0}
                                        anchorEl={anchorElM}
                                        open={openM}
                                        onClose={handleCloseM}
                                        MenuListProps={{
                                            "aria-labelledby": "basic-button",
                                        }}
                                        sx={{
                                            "& .MuiPaper-root": {
                                                borderRadius: 2,
                                                borderStyle: "solid",
                                                borderWidth: 1,
                                                backgroundColor: "white",
                                                borderColor: "white",
                                                p: 1,
                                                marginTop: theme.spacing(0.5),
                                                overflow: 'visible',
                                            },
                                        }}
                                    >
                                        <Stack gap={2} >
                                            <Autocomplete
                                                id="user"
                                                fullWidth
                                                size="medium"
                                                disablePortal
                                                options={dataMembers ?? []}
                                                getOptionLabel={(option) => option.user_username ?? ''}
                                                onChange={(_event, user: any) => {
                                                    setInviteMember(user?.user_id)
                                                }
                                                }
                                                renderInput={(params) => <TextField
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                                                            padding: 0,
                                                            border: 0,
                                                        },
                                                        width: 300,
                                                    }} {...params} />}
                                            />
                                            <Stack gap={0.5} flexDirection={'row'} justifyContent={"space-between"}>
                                                <Button fullWidth
                                                    onClick={addCollabolator} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="buttongreen">
                                                    Add Member
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Menu>
                                    <Button onClick={handleClickL} variant="contained" size="small" startIcon={<LabelOutlinedIcon sx={{ width: 14, height: 14 }} />} sx={{ fontSize: 14, height: 35, width: 171, justifyContent: 'flex-start' }}>
                                        Labels
                                    </Button>
                                    <Menu
                                        elevation={0}
                                        anchorEl={anchorElL}
                                        open={openL}
                                        onClose={handleCloseL}
                                        MenuListProps={{
                                            "aria-labelledby": "basic-button",
                                        }}
                                        sx={{
                                            "& .MuiPaper-root": {
                                                borderRadius: 2,
                                                borderStyle: "solid",
                                                borderWidth: 1,
                                                backgroundColor: "white",
                                                borderColor: "white",
                                                p: 1,
                                                marginTop: theme.spacing(0.5),
                                            },
                                        }}
                                    >
                                        <Stack gap={1} >
                                            <TextField
                                                value={label}
                                                onChange={handleChangeLabel}
                                                autoFocus
                                                inputProps={{ style: { padding: 10, backgroundColor: 'white', borderRadius: 8 } }}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                                                        padding: 0,
                                                        border: 0,
                                                        width: 300,
                                                    },
                                                }}
                                            />
                                            <SketchPicker
                                                styles={{
                                                    default: {
                                                        picker: {
                                                            boxShadow: 'none',
                                                        },
                                                    },
                                                }}
                                                width="300px"
                                                disableAlpha
                                                color={colorLabel}
                                                onChangeComplete={(color) =>
                                                    setColorLabel(
                                                        color.hex,
                                                    )
                                                }
                                            />
                                            <Stack gap={0.5} flexDirection={'row'} justifyContent={"space-between"}>
                                                <Button fullWidth
                                                    onClick={addLabel} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="buttongreen">
                                                    Add Label
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Menu>
                                    <Button onClick={handleClick} variant="contained" size="small" startIcon={<CheckBoxOutlinedIcon sx={{ width: 14, height: 14 }} />} sx={{ fontSize: 14, height: 35, width: 171, justifyContent: 'flex-start' }}>
                                        Checklist
                                    </Button>
                                    <Menu
                                        elevation={0}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            "aria-labelledby": "basic-button",
                                        }}
                                        sx={{
                                            "& .MuiPaper-root": {
                                                borderRadius: 2,
                                                borderStyle: "solid",
                                                borderWidth: 1,
                                                backgroundColor: "white",
                                                borderColor: "white",
                                                p: 1,
                                                marginTop: theme.spacing(0.5),
                                            },
                                        }}
                                    >
                                        <Stack gap={1} >
                                            <TextField
                                                value={checklistCard}
                                                onChange={handleChangeChecklist}
                                                autoFocus
                                                inputProps={{ style: { padding: 10, backgroundColor: 'white', borderRadius: 8 } }}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                                                        padding: 0,
                                                        border: 0,
                                                        width: 300,
                                                    },
                                                }}
                                            />
                                            <Stack gap={0.5} flexDirection={'row'} justifyContent={"space-between"}>
                                                <Button fullWidth
                                                    onClick={addChecklist} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="buttongreen">
                                                    Add Checklist
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Menu>
                                    <Button onClick={handleClickD} variant="contained" size="small" startIcon={<EventOutlinedIcon sx={{ width: 14, height: 14 }} />} sx={{ fontSize: 14, height: 35, width: 171, justifyContent: 'flex-start' }}>
                                        Date
                                    </Button>
                                    <Menu
                                        elevation={0}
                                        anchorEl={anchorElD}
                                        open={openD}
                                        onClose={handleCloseD}
                                        MenuListProps={{
                                            "aria-labelledby": "basic-button",
                                        }}
                                        sx={{
                                            "& .MuiPaper-root": {
                                                borderRadius: 2,
                                                borderStyle: "solid",
                                                borderWidth: 1,
                                                backgroundColor: "white",
                                                borderColor: "white",
                                                p: 1,
                                                marginTop: theme.spacing(0.5),
                                            },
                                        }}
                                    >
                                        <Stack gap={1} >
                                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                                <DatePicker
                                                    value={valueD}
                                                    onChange={(newValue) => setValueD(newValue)} />
                                            </LocalizationProvider>
                                            <Stack>
                                                {dataCardDate && dataCardDate.length > 0 ?
                                                    <Stack gap={0.5} flexDirection={'row'} justifyContent={"space-between"}>
                                                        <Button fullWidth
                                                            onClick={() => updateDate(dataCardDate[0].id)} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="buttongreen">
                                                            Save
                                                        </Button>
                                                        {level === 'delete' &&
                                                            <Button fullWidth
                                                                onClick={() => deleteDate(dataCardDate[0].id)} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="error">
                                                                Delete
                                                            </Button>}
                                                    </Stack> :
                                                    <Button fullWidth
                                                        onClick={addDate} sx={{ fontSize: 14, height: 35, mt: 0.5 }} variant="contained" color="buttongreen">
                                                        Add Due Date
                                                    </Button>}
                                            </Stack>
                                        </Stack>
                                    </Menu>
                                </Stack>}
                        </Stack>
                        <Stack gap={2}>
                            <Stack flexDirection={"row"} gap={1} >
                                <FormatListBulletedOutlinedIcon sx={{ color: 'white' }} />
                                <Stack gap={0.5} flex={1}>
                                    <Typography
                                        fontWeight={600}
                                        color={'white'}
                                    >
                                        Activity
                                    </Typography>
                                </Stack>
                            </Stack>
                            {level !== 'see' &&
                                <Stack flexDirection={'row'} gap={1}>
                                    <Avatar
                                        sx={{
                                            backgroundColor: "secondary.main",
                                            width: 32, height: 32,
                                            color: 'white',
                                            borderColor: 'primary.main',
                                            border: 1,
                                        }}
                                        alt={namaUser ?? "-"}
                                    >
                                        {avatarAlt(namaUser ?? "A")}
                                    </Avatar>
                                    <Stack gap={0.5} flex={1} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} maxWidth={"454px"}>
                                        <TextField
                                            value={comment}
                                            onChange={handleChangeComm}
                                            fullWidth
                                            hiddenLabel
                                            placeholder="Write a comment..."
                                            variant="filled"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'primary.main',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'primary.main',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'primary.main',
                                                    },
                                                },
                                                '& .MuiInputBase-root': {
                                                    backgroundColor: 'primary.main',
                                                    borderRadius: 2,
                                                    color: 'white !important'
                                                },
                                                '& .MuiInput-underline:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:after': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:hover:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiFilledInput-underline:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiFilledInput-underline:after': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiFilledInput-underline:hover:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                    color: 'white !important',
                                                },
                                            }}
                                        />
                                        <IconButton
                                            disabled={comment === ''}
                                            onClick={addComment} sx={{ color: 'buttongreen.main' }}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </Stack>
                                </Stack>}
                            {dataCardComment && dataCardComment.length > 0 && dataCardComment.map((dat, idx) =>
                                <Stack key={String(idx)} flexDirection={'row'} gap={1}>
                                    <Avatar
                                        sx={{
                                            backgroundColor: "secondary.main",
                                            width: 32, height: 32,
                                            color: 'white',
                                            borderColor: 'primary.main',
                                            border: 1,
                                        }}
                                        alt={dat.username ?? "-"}
                                    >
                                        {avatarAlt(dat.username ?? "A")}
                                    </Avatar>
                                    <Stack gap={0.5} flex={1} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} maxWidth={"454px"}>
                                        <Stack bgcolor={'primary.main'} borderRadius={2} flex={1}>
                                            <Typography px={2} py={1}
                                                color={'white'}
                                            >
                                                {`${dat.comment}`}
                                            </Typography>
                                        </Stack>
                                        {level === 'delete' &&
                                            <IconButton
                                                onClick={() => deleteComment(dat.comment_id)} sx={{ color: 'error.main' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>}
                                    </Stack>
                                </Stack>
                            )}
                            {dataCardActivity && dataCardActivity.length > 0 && dataCardActivity.map((dat, idx) =>
                                <Stack key={String(idx)} flexDirection={'row'} gap={1}>
                                    <Avatar
                                        sx={{
                                            backgroundColor: "secondary.main",
                                            width: 32, height: 32,
                                            color: 'white',
                                            borderColor: 'primary.main',
                                            border: 1,
                                        }}
                                        alt={dat.user_username ?? "-"}
                                    >
                                        {avatarAlt(dat.user_username ?? "A")}
                                    </Avatar>
                                    <Stack gap={0.5} flex={1}>
                                        <Stack flexDirection={isPhoneScreen ? 'column' : 'row'} gap={0.5}>
                                            <Typography
                                                fontSize={14}
                                                color={'white'}
                                            >
                                                {`${dat.user_username} `}
                                                {`${dat.detailed}`}
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            color={'white'}
                                        >
                                            {`${moment(dat.created_at, 'YYYY-MM-DD').format('DD MMMM YYYY')}`}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default CardListCard;
