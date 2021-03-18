import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';

import NuevaMeetModal from './MeetModal.jsx'
import MeetModalEliminar from './MeetModalEliminar'


const MenuMeetAdmin = ({ nombreBoton, usuario, usuarios, meetup }) => {

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    
    const mobileMenuId = 'primary-search-account-menu';


    const renderMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <NuevaMeetModal
                nombreBoton={nombreBoton ? nombreBoton : "sin nombre"}
                usuario={usuario}
                usuarios={usuarios}
                meetup={meetup}
            />
            <MeetModalEliminar
                meetup={meetup}
            />
        </Menu>
    )

    return (
        <>
            <div>
                <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                >
                    <MoreIcon />
                </IconButton>
            </div>
            {renderMenu}
        </>
    )
}

export default MenuMeetAdmin;