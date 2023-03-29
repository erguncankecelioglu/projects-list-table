import React, {useState, useEffect} from 'react';
import {initializeApp} from 'firebase/app';
import {getDatabase, ref, onValue, push, remove, update} from 'firebase/database';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Card, Typography } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from 'react-modal';


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};
const firebaseApp = initializeApp(firebaseConfig);

Modal.setAppElement('#root');

const Row = ({ project, handleEdit, handleDelete }) => {
    const [open, setOpen] = React.useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };



    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={handleToggle}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Typography variant="subtitle1" fontStyle="italic">{project.name}</Typography>
                </TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{
                    <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                {project.link}
                </a>
                }</TableCell>
                <TableCell>
                    <IconButton onClick={() => handleEdit(project)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(project)}>
                        <Delete />
                    </IconButton>
                </TableCell>
            </TableRow>
            {open && (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Details
                            </Typography>
                            <Typography>
                                <strong>Made by:</strong> {project.makerEmail}
                            </Typography>
                            <Typography>
                                <strong>Guide:</strong> {project.guide}
                            </Typography>
                        </Box>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
};

const App = () => {
    const [projects, setProjects] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [action, setAction] = useState('');
    const [formData, setFormData] = useState({
        projectName: '',
        makerEmail: '',
        description: '',
        projectLink: '',
        guide: '',
    });

    const [customStyles, setCustomStyles]  = useState({
        content: {
            width: '80%',
            height: '75%',
            maxWidth: '600px',
            margin: 'auto',
        },
    });



    useEffect(() => {
        const fetchData = async () => {
            const database = getDatabase(firebaseApp);
            const projectsRef = ref(database, 'projects');
            onValue(projectsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const projectsArray = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));
                    setProjects(projectsArray);
                } else {
                    setProjects([]);
                }
            });
        };

        fetchData();
    }, []);


    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddNew = () => {
        setSelectedProject(null);
        setAction('new');
        setCustomStyles(
            {
                content: {
                    width: '80%',
                    height: '75%',
                    maxWidth: '600px',
                    margin: 'auto',
                },
            }
        )
        setModalIsOpen(true);
    };

    const handleAddNewSubmit = async (event) => {
        event.preventDefault();
        try {
            const database = getDatabase(firebaseApp);
            const projectsRef = ref(database, 'projects');
            await push(projectsRef, {
                name: formData.projectName,
                makerEmail: formData.makerEmail,
                description: formData.description,
                link: formData.projectLink,
                guide: formData.guide,
            });
            setFormData({
                projectName: '',
                makerEmail: '',
                description: '',
                projectLink: '',
                guide: '',
            });
            handleCloseModal();
        } catch (error) {
            console.error("Error adding new project:", error);
        }
    };


    const handleEdit = (project) => {
        setSelectedProject(project);
        setAction('edit');
        setCustomStyles(
            {
                content: {
                    width: '80%',
                    height: '75%',
                    maxWidth: '600px',
                    margin: 'auto',
                },
            }
        )
        setModalIsOpen(true);
        setFormData({
            projectName: project.name,
            makerEmail: project.makerEmail,
            description: project.description,
            projectLink: project.link,
            guide: project.guide,
        });
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const database = getDatabase(firebaseApp);
            const projectRef = ref(database, `projects/${selectedProject.id}`);
            await update(projectRef, {
                name: formData.projectName,
                makerEmail: formData.makerEmail,
                description: formData.description,
                link: formData.projectLink,
                guide: formData.guide,
            });
            handleCloseModal();
        } catch (error) {
            console.error("Error editing project:", error);
        }
    };

    const handleDelete = (project) => {
        setSelectedProject(project);
        setAction('delete');
        setCustomStyles({
            content: {
                width: '80%',
                height: '20%',
                maxWidth: '600px',
                margin: 'auto',
            }
        });
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setFormData({
            projectName: '',
            makerEmail: '',
            description: '',
            projectLink: '',
            guide: '',
            }
        )
        setSelectedProject(null);
    };

    const handleConfirmDelete = async () => {
        const database = getDatabase(firebaseApp);
        await remove(ref(database, `projects/${selectedProject.id}`));
        handleCloseModal();
    };

    return (
        <>

            <TableContainer component={Card} style={{ width: '80%', margin: 'auto'}}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell><IconButton onClick={handleAddNew} color="primary">
                                <Add />
                            </IconButton></TableCell>
                            <TableCell><Typography variant="body1" style={{ fontSize: '13pt', fontWeight: 'bold' }}>Project Name</Typography></TableCell>
                            <TableCell><Typography variant="body1" style={{ fontSize: '13pt', fontWeight: 'bold' }}>Description</Typography></TableCell>
                            <TableCell><Typography variant="body1" style={{ fontSize: '13pt', fontWeight: 'bold' }}>Link to Project</Typography></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
                            <Row
                                key={project.id}
                                project={project}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Project Modal"
                style={customStyles}
            >
                {action === 'new' && (
                    <>
                        <h2>Add New Project</h2>
                        <form onSubmit={handleAddNewSubmit}>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Project Name"
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Maker Email"
                                    name="makerEmail"
                                    value={formData.makerEmail}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Project Link"
                                    name="projectLink"
                                    value={formData.projectLink}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Guide"
                                    name="guide"
                                    multiline
                                    rows={2}
                                    value={formData.guide}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </form>

                    </>
                )}
                {selectedProject && (
                    <>
                {action === 'edit' && (
                    <>
                        <h2>Edit Project</h2>
                        <form onSubmit={handleEditSubmit}>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Project Name"
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Maker Email"
                                    name="makerEmail"
                                    value={formData.makerEmail}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Project Link"
                                    name="projectLink"
                                    value={formData.projectLink}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <TextField
                                    fullWidth
                                    label="Guide"
                                    name="guide"
                                    multiline
                                    rows={2}
                                    value={formData.guide}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Button type="submit" variant="contained">
                                Save Changes
                            </Button>
                            <Button onClick={handleCloseModal} variant="outlined">
                                Cancel
                            </Button>
                        </form>
                    </>
                )}
                </>
                )}
                {selectedProject && (
                    <>
                {action === 'delete' && (
                    <>
                        <h2>Delete Project</h2>
                        <p>
                            Are you sure you want to delete{' '}
                            {selectedProject.name}?
                        </p>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </button>
                    </>
                )}
                </>
                )}
            </Modal>
        </>
    );
};

export default App;
