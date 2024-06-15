import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';
import Illustration from '../../components/404Illustration/404Illustration';
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
                width: isTabletScreen ? '50%' : undefined,
                height: isTabletScreen ? '50%' : undefined,
                mt: -47,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF',
                padding: isTabletScreen ? 3 : 90,
            }}
        >
            <Illustration />
        </Box>
    );
};

export default Page404;
