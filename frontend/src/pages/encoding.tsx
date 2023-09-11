import { Box } from "@mui/material";
import DashboardLayout from "../components/common/dashboard_layout";
import EncodingForm from "../components/encoding/encoding_form";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import config from "../config.json";

export default function Encoding() {
  useHandleSection({ section: "encoding" });
  useLoadingComponent();

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <EncodingForm service={config.encoding_sequences}/>
      </Box>
    </DashboardLayout>
  );
}
