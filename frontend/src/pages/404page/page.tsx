import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';
import React from 'react';


interface IPage404Props { }

const Page404 = (props: IPage404Props) => {
    const theme = useTheme();
    const isTabletScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        document.title = '404 - Page Not Found';
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF',
            }}
        >
            <img
                src={"/images/404.png"}
                alt="404"
                width={isTabletScreen ? 404 : 600}
                style={{ objectFit: "contain" }}
            />
        </Box>
    );
};

export default Page404;
