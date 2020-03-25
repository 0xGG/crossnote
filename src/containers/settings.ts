import { createContainer } from "unstated-next";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface InitialState {}

function useSettingsContainer(initialState: InitialState) {
  const [language, setLanguage] = useState<string>(
    localStorage.getItem("settings/language") || "en-US"
  );
  const [editorCursorColor, setEditorCursorColor] = useState<string>(
    localStorage.getItem("settings/editorCursorColor") || "rgba(51, 51, 51, 1)"
  );
  const [authorName, setAuthorName] = useState<string>(
    localStorage.getItem("settings/authorName") || "Anonymous"
  );
  const [authorEmail, setAuthorEmail] = useState<string>(
    localStorage.getItem("settings/authorEmail") || "anonymous@crossnote.app"
  );

  const { t, i18n } = useTranslation();

  const _setLanguage = useCallback(
    (language: string) => {
      if (
        language === "en-US" ||
        language === "zh-CN" ||
        language === "zh-TW" ||
        language === "ja-JP"
      ) {
        localStorage.setItem("settings/language", language);
        setLanguage(language);
        i18n.changeLanguage(language);
      } else {
        localStorage.setItem("settings/language", "en-US");
        setLanguage("en-US");
        i18n.changeLanguage("en-US");
      }
    },
    [i18n]
  );

  const _setEditorCursorColor = useCallback((editorCursorColor: string) => {
    localStorage.setItem("settings/editorCursorColor", editorCursorColor);
    setEditorCursorColor(editorCursorColor);
  }, []);

  const _setAuthorName = useCallback((authorName: string) => {
    localStorage.setItem("settings/authorName", authorName);
    setAuthorName(authorName);
  }, []);

  const _setAuthorEmail = useCallback((authorEmail: string) => {
    localStorage.setItem("settings/authorEmail", authorEmail);
    setAuthorEmail(authorEmail);
  }, []);

  return {
    language,
    setLanguage: _setLanguage,
    editorCursorColor,
    setEditorCursorColor: _setEditorCursorColor,
    authorName,
    setAuthorName: _setAuthorName,
    authorEmail,
    setAuthorEmail: _setAuthorEmail
  };
}

export const SettingsContainer = createContainer(useSettingsContainer);