import {
  Box,
  Card,
  Typography,
  Popover,
  Hidden,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Divider,
  Button
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { useTranslation } from "react-i18next";
import { SettingsContainer } from "../containers/settings";
import { Menu as MenuIcon, Translate } from "mdi-material-ui";
import { CloudContainer } from "../containers/cloud";
import { AuthDialog } from "./AuthDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingsCard: {
      padding: theme.spacing(2),
      width: "600px",
      maxWidth: "100%",
      left: "50%",
      position: "relative",
      top: "32px",
      transform: "translateX(-50%)",
      height: "fit-content",
      [theme.breakpoints.down("sm")]: {
        top: "0",
        height: "100%"
      }
    },
    cover: {
      position: "relative",
      width: "100%",
      height: "0",
      marginTop: theme.spacing(2),
      paddingTop: "30%",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "#fade79",
      [theme.breakpoints.down("sm")]: {
        paddingTop: "50%"
      }
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    avatar: {
      marginTop: theme.spacing(2),
      width: "64px",
      height: "64px",
      borderRadius: "4px"
    },
    saveBtn: {
      marginTop: theme.spacing(2)
    },
    logoutBtn: {
      position: "absolute",
      top: "16px",
      right: "16px"
    },
    section: {
      marginTop: theme.spacing(1)
    },
    swatch: {
      padding: "4px",
      backgroundColor: "#fff",
      borderRadius: "1px",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
      display: "inline-block",
      cursor: "pointer"
    },
    color: {
      width: "36px",
      height: "18px",
      borderRadius: "2px"
    },
    editorText: {
      marginLeft: theme.spacing(4)
    },
    editorCursor: {
      borderLeftStyle: "solid",
      borderLeftWidth: "2px",
      padding: "0",
      position: "relative"
    }
  })
);

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

function getRGBA(inputStr: string = ""): RGBA {
  if (!inputStr || !inputStr.length || !inputStr.match(/^rgba\(/)) {
    return {
      r: 51,
      g: 51,
      b: 51,
      a: 1
    };
  } else {
    const match = inputStr.match(
      /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/
    );
    if (!match) {
      return {
        r: 51,
        g: 51,
        b: 51,
        a: 1
      };
    } else {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: parseInt(match[4], 10)
      };
    }
  }
}

interface Props {
  toggleDrawer: () => void;
}
export function Settings(props: Props) {
  const classes = useStyles(props);
  const { t } = useTranslation();
  const [colorPickerAnchorElement, setColorPickerAnchorElement] = useState<
    HTMLElement
  >(null);
  const displayColorPicker = Boolean(colorPickerAnchorElement);
  const settingsContainer = SettingsContainer.useContainer();
  const cloudContainer = CloudContainer.useContainer();

  return (
    <Card className={clsx(classes.settingsCard)}>
      <Box
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Hidden smUp implementation="css">
          <IconButton onClick={props.toggleDrawer}>
            <MenuIcon></MenuIcon>
          </IconButton>
        </Hidden>
        <Typography variant={"h6"}>{t("general/Settings")}</Typography>
      </Box>
      <Box className={clsx(classes.section)}>
        <Button
          variant={"outlined"}
          color={"primary"}
          style={{ marginBottom: "24px" }}
          onClick={() => cloudContainer.setAuthDialogOpen(true)}
        >
          {t("general/sign-in")}
        </Button>
      </Box>
      <Box className={clsx(classes.section)}>
        <Typography
          variant={"body2"}
          style={{
            color: "rgba(0, 0, 0, 0.54)",
            fontSize: "0.75rem",
            marginBottom: "6px"
          }}
        >
          <Translate style={{ marginRight: "8px" }}></Translate>
          {"Languages/语言"}
        </Typography>
        <Select
          variant={"standard"}
          value={settingsContainer.language}
          onChange={event =>
            settingsContainer.setLanguage(event.target.value as string)
          }
        >
          <MenuItem value={"en-US"}>English</MenuItem>
          <MenuItem value={"zh-CN"}>简体中文</MenuItem>
          <MenuItem value={"zh-TW"}>繁体中文</MenuItem>
          <MenuItem value={"ja-JP"}>日本語</MenuItem>
        </Select>
      </Box>
      <Box className={clsx(classes.section)}>
        <TextField
          label={t("settings/author-name")}
          placeholder={t("account/Anonymous")}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          value={settingsContainer.authorName}
          onChange={event =>
            settingsContainer.setAuthorName(event.currentTarget.value)
          }
        ></TextField>
      </Box>
      <Box className={clsx(classes.section)}>
        <TextField
          label={t("settings/author-email")}
          placeholder={"anonymous@crossnote.app"}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          value={settingsContainer.authorEmail}
          onChange={event =>
            settingsContainer.setAuthorEmail(event.currentTarget.value)
          }
        ></TextField>
      </Box>
      <Box className={clsx(classes.section)}>
        <Typography
          variant={"body2"}
          style={{
            color: "rgba(0, 0, 0, 0.54)",
            fontSize: "0.75rem",
            marginBottom: "6px"
          }}
        >
          {t("settings/editor-cursor-color")}
        </Typography>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Box
            className={clsx(classes.swatch)}
            onClick={(event: React.MouseEvent<HTMLElement>) =>
              setColorPickerAnchorElement(event.currentTarget)
            }
          >
            <Box
              className={clsx(classes.color)}
              style={{ backgroundColor: settingsContainer.editorCursorColor }}
            ></Box>
          </Box>
          <div className={clsx(classes.editorText)}>
            {t("settings/hello")}
            <span
              className={clsx(classes.editorCursor)}
              style={{
                borderLeftColor: settingsContainer.editorCursorColor || "#333"
              }}
            ></span>
            {t("settings/world")}
          </div>
        </Box>
        <Popover
          open={displayColorPicker}
          anchorEl={colorPickerAnchorElement}
          onClose={() => {
            setColorPickerAnchorElement(null);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <SketchPicker
            color={getRGBA(settingsContainer.editorCursorColor)}
            onChange={color => {
              const cursorColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
              settingsContainer.setEditorCursorColor(cursorColor);
            }}
          ></SketchPicker>
        </Popover>
      </Box>
      <AuthDialog
        open={cloudContainer.authDialogOpen}
        onClose={() => cloudContainer.setAuthDialogOpen(false)}
      ></AuthDialog>
    </Card>
  );
}