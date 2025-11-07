import type { CSSProperties } from "react";
import appStoreIcon from "../../../assets/icons/app-icons/app-store.svg";
import appleDeveloperIcon from "../../../assets/icons/app-icons/apple-developer.svg";
import appleTvIcon from "../../../assets/icons/app-icons/apple-tv.svg";
import automatorIcon from "../../../assets/icons/app-icons/automator.svg";
import booksIcon from "../../../assets/icons/app-icons/books.svg";
import calculatorIcon from "../../../assets/icons/app-icons/calculator.svg";
import calendarIcon from "../../../assets/icons/app-icons/calendar.svg";
import contactsIcon from "../../../assets/icons/app-icons/contacts.svg";
import customAppIcon from "../../../assets/icons/app-icons/custom-app.svg";
import dictionaryIcon from "../../../assets/icons/app-icons/dictionary.svg";
import documentIcon from "../../../assets/icons/app-icons/document.svg";
import facetimeIcon from "../../../assets/icons/app-icons/facetime.svg";
import finalCutProIcon from "../../../assets/icons/app-icons/final-cut-pro.svg";
import findMyIcon from "../../../assets/icons/app-icons/find-my.svg";
import finderIcon from "../../../assets/icons/app-icons/finder.svg";
import folderIcon from "../../../assets/icons/app-icons/folder.svg";
import freeformIcon from "../../../assets/icons/app-icons/freeform.svg";
import garagebandIcon from "../../../assets/icons/app-icons/garageband.svg";
import homeIcon from "../../../assets/icons/app-icons/home.svg";
import imovieIcon from "../../../assets/icons/app-icons/imovie.svg";
import keynoteIcon from "../../../assets/icons/app-icons/keynote.svg";
import launchpadIcon from "../../../assets/icons/app-icons/launchpad.svg";
import mailIcon from "../../../assets/icons/app-icons/mail.svg";
import mapsIcon from "../../../assets/icons/app-icons/maps.svg";
import messagesIcon from "../../../assets/icons/app-icons/messages.svg";
import musicIcon from "../../../assets/icons/app-icons/music.svg";
import newsIcon from "../../../assets/icons/app-icons/news.svg";
import notesIcon from "../../../assets/icons/app-icons/notes.svg";
import numbersIcon from "../../../assets/icons/app-icons/numbers.svg";
import pagesIcon from "../../../assets/icons/app-icons/pages.svg";
import photoBoothIcon from "../../../assets/icons/app-icons/photo-booth.svg";
import photosIcon from "../../../assets/icons/app-icons/photos.svg";
import podcastsIcon from "../../../assets/icons/app-icons/podcasts.svg";
import previewIcon from "../../../assets/icons/app-icons/preview.svg";
import quicktimePlayerIcon from "../../../assets/icons/app-icons/quicktime-player.svg";
import remindersIcon from "../../../assets/icons/app-icons/reminders.svg";
import safariIcon from "../../../assets/icons/app-icons/safari.svg";
import shortcutsIcon from "../../../assets/icons/app-icons/shortcuts.svg";
import siriIcon from "../../../assets/icons/app-icons/siri.svg";
import stocksIcon from "../../../assets/icons/app-icons/stocks.svg";
import swiftPlaygroundsIcon from "../../../assets/icons/app-icons/swift-playgrounds.svg";
import systemSettingsIcon from "../../../assets/icons/app-icons/system-settings.svg";
import terminalIcon from "../../../assets/icons/app-icons/terminal.svg";
import texteditIcon from "../../../assets/icons/app-icons/textedit.svg";
import trashFullIcon from "../../../assets/icons/app-icons/trash-full.svg";
import trashIcon from "../../../assets/icons/app-icons/trash.svg";
import voiceMemosIcon from "../../../assets/icons/app-icons/voice-memos.svg";
import xcodeIcon from "../../../assets/icons/app-icons/xcode.svg";

const appIconSources = {
  "app-store": appStoreIcon,
  "apple-developer": appleDeveloperIcon,
  "apple-tv": appleTvIcon,
  "automator": automatorIcon,
  "books": booksIcon,
  "calculator": calculatorIcon,
  "calendar": calendarIcon,
  "contacts": contactsIcon,
  "custom-app": customAppIcon,
  "dictionary": dictionaryIcon,
  "document": documentIcon,
  "facetime": facetimeIcon,
  "final-cut-pro": finalCutProIcon,
  "find-my": findMyIcon,
  "finder": finderIcon,
  "folder": folderIcon,
  "freeform": freeformIcon,
  "garageband": garagebandIcon,
  "home": homeIcon,
  "imovie": imovieIcon,
  "keynote": keynoteIcon,
  "launchpad": launchpadIcon,
  "mail": mailIcon,
  "maps": mapsIcon,
  "messages": messagesIcon,
  "music": musicIcon,
  "news": newsIcon,
  "notes": notesIcon,
  "numbers": numbersIcon,
  "pages": pagesIcon,
  "photo-booth": photoBoothIcon,
  "photos": photosIcon,
  "podcasts": podcastsIcon,
  "preview": previewIcon,
  "quicktime-player": quicktimePlayerIcon,
  "reminders": remindersIcon,
  "safari": safariIcon,
  "shortcuts": shortcutsIcon,
  "siri": siriIcon,
  "stocks": stocksIcon,
  "swift-playgrounds": swiftPlaygroundsIcon,
  "system-settings": systemSettingsIcon,
  "terminal": terminalIcon,
  "textedit": texteditIcon,
  "trash-full": trashFullIcon,
  "trash": trashIcon,
  "voice-memos": voiceMemosIcon,
  "xcode": xcodeIcon,
} as const;

export type AppIconName = keyof typeof appIconSources;
const appIconNames = Object.keys(appIconSources) as AppIconName[];
const appIconPreloadTargets = appIconNames.map(name => ({
  key: `app-icon-${name}`,
  src: appIconSources[name],
}));

type AppIconProps = {
  name: AppIconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  alt?: string;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async" | "auto";
};

const AppIcon = ({ name, size = 50, className, style, alt = "", loading = "lazy", decoding = "async" }: AppIconProps) => (
  <img
    src={appIconSources[name]}
    width={size}
    height={size}
    loading={loading}
    decoding={decoding}
    alt={alt}
    className={className}
    style={style}
  />
);

export { appIconNames };
export { appIconPreloadTargets };
export default AppIcon;
