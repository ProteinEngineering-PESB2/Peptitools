import { Collapse, Drawer, ListItemButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { DrawerHeader } from "./drawer_header";
import { drawerWidth } from "./drawerWith";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BuildIcon from "@mui/icons-material/Build";
import BiotechIcon from "@mui/icons-material/Biotech";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import HomeIcon from "@mui/icons-material/Home";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import config from "../../config.json";

interface Props {
  open: boolean;
  handleDrawerClose: () => void;
}

function Sidebar({ handleDrawerClose, open }: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    handleChangeOpenBioinformaticTools,
    handleChangeOpenMachineLearningTools,
    handleChangeOpenTools,
    handleChangeOpenPredictiveModels,
    handleChangeOpenStatisticTools,
    openBioinformaticTools,
    openMachineLearningTools,
    openPredictiveModels,
    openStatisticTools,
    openTools,
  } = useContext(AppContext);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemIcon>
            <HomeIcon sx={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </List>
      <List>
        <ListItemButton onClick={() => handleChangeOpenTools(!openTools)}>
          <ListItemIcon>
            <BuildIcon sx={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText primary="Tools" />
          {openTools ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openTools} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/fasta-converter")}
            >
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.convert_to_fasta.title} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/test-sequences")}
            >
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.test_sequences.title} />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <List>
        <ListItemButton
          onClick={() =>
            handleChangeOpenBioinformaticTools(!openBioinformaticTools)
          }
        >
          <ListItemIcon>
            <BiotechIcon sx={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText primary="Bioinformatic Tools" />
          {openBioinformaticTools ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openBioinformaticTools} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/msa")}>
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.msa.title} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/pfam")}>
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.pfam.title} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/go")}>
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.gene_ontology.title} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/structural-prediction")}
            >
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.structural_prediction.title} />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <List>
        <ListItemButton
          onClick={() => handleChangeOpenStatisticTools(!openStatisticTools)}
        >
          <ListItemIcon>
            <EqualizerIcon sx={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText primary="Statistic Tools" />
          {openStatisticTools ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openStatisticTools} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/frequency-evaluation")}
            >
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.frequency_evaluation.title} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/properties-estimation")}
            >
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.properties_estimation.title} />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <List>
        <ListItemButton
          onClick={() =>
            handleChangeOpenMachineLearningTools(!openMachineLearningTools)
          }
        >
          <ListItemIcon>
            <PsychologyIcon sx={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText primary="Machine Learning Tools" />
          {openMachineLearningTools ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMachineLearningTools} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/encoding-sequences")}
            >
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.encoding_sequences.title} />
            </ListItemButton>
            
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/clustering")}
            >
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.clustering.title} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/training-predictive-models")}
            >
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.supervised_learning.title} />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      {/* <List>
        <ListItemButton
          onClick={() =>
            handleChangeOpenPredictiveModels(!openPredictiveModels)
          }
        >
          <ListItemIcon>
            <ModelTrainingIcon sx={{ color: "#000" }} />
          </ListItemIcon>
          <ListItemText primary="Predictive Models" />
          {openPredictiveModels ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPredictiveModels} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => navigate("/activity-prediction")}
            >
              <ListItemIcon>
                <KeyboardDoubleArrowRightIcon sx={{ color: "#000" }} />
              </ListItemIcon>
              <ListItemText primary={config.activity_prediction.title} />
            </ListItemButton>
          </List>
        </Collapse>
      </List> */}
    </Drawer>
  );
}

export default Sidebar;
