import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { Box, Button } from "@mui/material";
import { memo } from "react";
import BottomDrawer from "../drawer";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  TwitterIcon,
} from "react-share";
import sakuraLogo from "../../assets/images/retail-sakura-cafe.png";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import "./sharePopup.css";
import { colorConstant } from "../../constants/colors";

const ShareProductPopUp = ({
  openShareDrawer,
  setOpenShareDrawer,
  shareUrl,
  title,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <BottomDrawer
      drawerStateProp={openShareDrawer}
      setDrawerStateProp={setOpenShareDrawer}
      drawerHeight="50vh"
      customCloseIcon={
        <CancelPresentationIcon
          sx={{ color: "black", backgroundColor: "white" }}
        />
      }
      drawerContentStyle={{
        padding: "16px",
        paddingBottom: "32px",
      }}
      drawerContent={
        <Box
          sx={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Logo + Title */}
          <Box textAlign="center" mb={2}>
            <img
              src={sakuraLogo}
              alt="logo"
              width={60}
              height={60}
              style={{ borderRadius: 8, backgroundColor: colorConstant?.showdowColor }}
            />
            <div
              style={{
                marginTop: 8,
                fontWeight: "500",
                fontFamily: "sans-serif",
              }}
            >
              {title}
            </div>
          </Box>

          {/* Share Buttons */}
          <Box
            display="flex"
            justifyContent="space-around"
            flexWrap="wrap"
            gap={2}
          >
            <WhatsappShareButton url={shareUrl} title={title}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <WhatsappIcon size={48} round />
                <div className="share-btn">WhatsApp</div>
              </Box>
            </WhatsappShareButton>

            <FacebookShareButton url={shareUrl} quote={title}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <FacebookIcon size={48} round />
                <div className="share-btn">Facebook</div>
              </Box>
            </FacebookShareButton>

            <EmailShareButton
              url={shareUrl}
              subject={`Check this out: ${title}`}
              body={`I thought you might be interested in this:\n\n${shareUrl}`}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <EmailIcon size={48} round />
                <div className="share-btn">Email</div>
              </Box>
            </EmailShareButton>
            <TelegramShareButton url={shareUrl} title={title}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <TelegramIcon size={48} round />
                <div className="share-btn">Telegram</div>
              </Box>
            </TelegramShareButton>

            <TwitterShareButton url={shareUrl} title={title}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <TwitterIcon size={48} round />
                <div className="share-btn">Twitter</div>
              </Box>
            </TwitterShareButton>
          </Box>

          {/* Copy Link */}
          <div className="copy-link">
            Copy Link
            <ContentCopyIcon size={2} onClick={handleCopyLink} />
          </div>
        </Box>
      }
    />
  );
};

export default memo(ShareProductPopUp);
