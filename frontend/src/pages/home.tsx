import { useHandleSection } from "../hooks/useHandleSection";
import { Box } from "@mui/material";
import useLoadingComponent from "../hooks/useLoadingComponent";
import DashboardLayout from "../components/common/dashboard_layout";
import Team from "../components/home/team";
import Links from "../components/home/links"
import Cite from "../components/home/cite"
import Data from "../components/home/data"
import Front from "../components/home/front"
import config from "../config.json"
import Diagram from "../components/home/diagram";
import Services from "../components/home/services"
export default function Home() {
  const obj = config.home
  useHandleSection({ section: "home" });
  useLoadingComponent();

  return (
    <DashboardLayout>
      <>
        <Box sx={{ padding: 2 }}>
          <Front title = {obj.title} description = {obj.description}/>
        </Box>
        <Box sx={{ padding: 2 }}>
          <Diagram/>
        </Box>
        <Box sx={{ padding: 2 }}>
          <Services/>
        </Box>
        <Box sx={{ padding: 3}}>
          <Links/>
        </Box>
        <Box sx={{ padding: 3 }}>
          <Cite/>
        </Box>
        <Box sx={{ padding: 3}}>
          <Team/>
        </Box>
      </>
    </DashboardLayout>
  );
}
