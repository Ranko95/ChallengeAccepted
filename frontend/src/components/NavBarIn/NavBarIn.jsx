import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Menu,
  Avatar,
  Button,
  Drawer,
  List,
  ListItemText,
  Divider,
  ListItem,
  ListItemAvatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import SearchIcon from '@material-ui/icons/Search';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import avatarImage from '../../assets/van-damme.jpg';
import logoImage from '../../assets/logo.png';
import { DropzoneArea } from 'material-ui-dropzone';
import { addUserAC, addChallengeAC, fetchLogOutAC } from '../../redux/action-creator';


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    color: '#6D676E',
    backgroundColor: '#FBFFFE',
  },
  logoDiv: {
    textAligh: 'center',
    minWidth: '120px',
    minHeight: '50px',
    position: 'relative',
  },
  logo: {
    maxWidth: '200px',
    maxHeight: '100px',
    position: 'absolute',
    top: '65%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  divUpload: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down(469)]: {
      marginRight: 0,
    },
  },
  btnUpload: {
    fontSize: '1rem',
    fontWeight: '700',
    backgroundColor: '#FAA916',
    color: '#FBFFFE',
    '&:hover': {
      backgroundColor: '#96031A',
      color: '#FAA916',
    },
  },
  btnUploadName: {
    [theme.breakpoints.down(469)]: {
      display: 'none',
    },
  },
  divUploadIcon: {
    [theme.breakpoints.down(469)]: {
      marginLeft: '10px',
    },
  },
  btnCancel: {
    fontSize: '1rem',
    fontWeight: '700',
    backgroundColor: '#6D676E',
    color: '#FBFFFE',
    '&:hover': {
      backgroundColor: '#96031A',
      color: '#FBFFFE',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    marginRight: theme.spacing(2),
    border: '1px solid #e0e0e0',
    marginLeft: 0,
    [theme.breakpoints.down(725)]: {
      display: 'none',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  listItem: {
    color: '#6D676E',
    '&:hover': {
      backgroundColor: '#96031A',
      color: '#FAA916',
    },
  },
  listTitle: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '20px',
    paddingBottom: '20px',
    fontWeight: 'bold',
    color: '#FAA916',
    backgroundColor: '#96031A',
  },
  profileLink: {
    textDecoration: 'none',
  },
}));

const PrimarySearchAppBar = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openUploader, setOpenUploader] = React.useState(false);
  const [video, setVideo] = React.useState(null);
  const [userInput, setUserInput] = React.useState(
    { title: '', description: '', hashtags: '' },
  );

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    })
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleUploaderOpen = () => {
    setOpenUploader(true);
  };
  const handleUploaderClose = () => {
    setOpenUploader(false);
    setVideo(null);
  };

  const handleUploading = (file) => {
    setVideo(file);
  };

  const handleLogout = () => {
    props.fetchLogout();
  }
  
  const handleUploaderSubmit = () => {
    const userId = props.state.user._id;
    const title = userInput.title;
    const description = userInput.description;
    const hashtags = userInput.hashtags;
    const vid = video[0];
    const data = new FormData();
    data.append('file', vid);
    const response = fetch(`/challenges/uploadVideo`, {
      method: 'POST',
      body: data
    })
      .then(res => res.json())
      .then(videoUrl => fetch(`/challenges/createChallenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: videoUrl.videoUrl, userId, title, description, hashtags })
      }))
      .then(res => res.json())
      .then(result => {
        props.updateUser(result.updatedUser);
        props.updateChallenges(result.challenge);
        handleUploaderClose();
      })
      .catch(err => console.log(err))
  };

  const renderUploader = (
    <Dialog
      open={openUploader}
      onClose={handleUploaderClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>Upload Challenge</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To upload your Challenge, please enter its title, description and
          attach video file. Thank You!
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Challenge title"
          type="text"
          fullWidth
          id="title"
          name="title"
          required
          onChange={changeInputHandler}
        />
        <TextField
          margin="dense"
          label="Challenge desciption"
          type="text"
          id="description"
          name="description"
          fullWidth
          required
          onChange={changeInputHandler}
        />
        <TextField
          margin="dense"
          label="Hashtags"
          type="text"
          id="hashtags"
          name="hashtags"
          onChange={changeInputHandler}
          fullWidth
        />
      </DialogContent>
      <DropzoneArea onChange={handleUploading} maxFileSize={15000000} />
      <DialogActions>
        <Button onClick={handleUploaderClose} className={classes.btnCancel}>
          Cancel
        </Button>
        <Button onClick={handleUploaderSubmit} className={classes.btnUpload}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link className={classes.profileLink} to="/profile">
          My Profile
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose, handleLogout}>Log Out</MenuItem>
    </Menu>
  );

  const renderDrawer = (
    <Drawer anchor="left" open={openDrawer} onClose={handleDrawerClose}>
      <div onClick={handleDrawerClose}>
        <Typography className={classes.listTitle} variant="h6">
          Following
        </Typography>
        <Divider />
        <List>
          <ListItem button className={classes.listItem}>
            <ListItemAvatar>
              <Avatar src={avatarImage} />
            </ListItemAvatar>
            <ListItemText primary="Ranko" />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemAvatar>
              <Avatar src={avatarImage} />
            </ListItemAvatar>
            <ListItemText primary="Ilya" />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemAvatar>
              <Avatar src={avatarImage} />
            </ListItemAvatar>
            <ListItemText primary="Kostya" />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemAvatar>
              <Avatar src={avatarImage} />
            </ListItemAvatar>
            <ListItemText primary="Kolya" />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemAvatar>
              <Avatar src={avatarImage} />
            </ListItemAvatar>
            <ListItemText primary="Katrin" />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemAvatar>
              <Avatar src="" />
            </ListItemAvatar>
            <ListItemText primary="Anon" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" classes={{ root: classes.appBar }}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
          >
            <SubscriptionsIcon />
          </IconButton>
          {renderDrawer}

          <div className={classes.logoDiv}>
            <Link to="/main">
              <img className={classes.logo} src={logoImage} alt="logo" />
            </Link>
          </div>

          <div className={classes.divUpload}>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon className={classes.divUploadIcon} />}
              className={classes.btnUpload}
              onClick={handleUploaderOpen}
            >
              <Typography className={classes.btnUploadName}>
                Upload Challenge
              </Typography>
            </Button>
            {renderUploader}
          </div>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onChange={props.handleChange}
              type="search"
              placeholder="Search..."
              classes={{ input: classes.inputInput }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar alt="Challenger" src={props.state.user.avatar} />
          </IconButton>
          {renderMenu}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => ({ state });
const mapDispatchToProps = (dispatch) => ({
  updateUser: (user) => dispatch(addUserAC(user)),
  updateChallenges: (challenge) => dispatch(addChallengeAC(challenge)),
  fetchLogout: () => dispatch(fetchLogOutAC())
});

export default connect(mapStateToProps, mapDispatchToProps)(PrimarySearchAppBar);
