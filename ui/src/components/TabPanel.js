import { Box } from "@mui/system";

export default function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        style={{marginTop: 30}}
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            {children}
          </Box>
        )}
      </div>
    );
  }
  