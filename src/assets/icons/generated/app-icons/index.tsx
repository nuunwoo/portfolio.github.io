import type { CSSProperties } from "react";
import appStoreIcon from "../../raw/app-icons/app-store.svg";
import appleDeveloperIcon from "../../raw/app-icons/apple-developer.svg";
import appleTvIcon from "../../raw/app-icons/apple-tv.svg";
import automatorIcon from "../../raw/app-icons/automator.svg";
import booksIcon from "../../raw/app-icons/books.svg";
import calculatorIcon from "../../raw/app-icons/calculator.svg";
import calendarIcon from "../../raw/app-icons/calendar.svg";
import contactsIcon from "../../raw/app-icons/contacts.svg";
import customAppIcon from "../../raw/app-icons/custom-app.svg";
import dictionaryIcon from "../../raw/app-icons/dictionary.svg";
import documentIcon from "../../raw/app-icons/document.svg";
import facetimeIcon from "../../raw/app-icons/facetime.svg";
import finalCutProIcon from "../../raw/app-icons/final-cut-pro.svg";
import findMyIcon from "../../raw/app-icons/find-my.svg";
import finderIcon from "../../raw/app-icons/finder.svg";
import folderIcon from "../../raw/app-icons/folder.svg";
import freeformIcon from "../../raw/app-icons/freeform.svg";
import garagebandIcon from "../../raw/app-icons/garageband.svg";
import homeIcon from "../../raw/app-icons/home.svg";
import imovieIcon from "../../raw/app-icons/imovie.svg";
import keynoteIcon from "../../raw/app-icons/keynote.svg";
import launchpadIcon from "../../raw/app-icons/launchpad.svg";
import mailIcon from "../../raw/app-icons/mail.svg";
import mapsIcon from "../../raw/app-icons/maps.svg";
import messagesIcon from "../../raw/app-icons/messages.svg";
import musicIcon from "../../raw/app-icons/music.svg";
import newsIcon from "../../raw/app-icons/news.svg";
import notesIcon from "../../raw/app-icons/notes.svg";
import numbersIcon from "../../raw/app-icons/numbers.svg";
import pagesIcon from "../../raw/app-icons/pages.svg";
import photoBoothIcon from "../../raw/app-icons/photo-booth.svg";
import photosIcon from "../../raw/app-icons/photos.svg";
import podcastsIcon from "../../raw/app-icons/podcasts.svg";
import previewIcon from "../../raw/app-icons/preview.svg";
import quicktimePlayerIcon from "../../raw/app-icons/quicktime-player.svg";
import remindersIcon from "../../raw/app-icons/reminders.svg";
import safariIcon from "../../raw/app-icons/safari.svg";
import shortcutsIcon from "../../raw/app-icons/shortcuts.svg";
import siriIcon from "../../raw/app-icons/siri.svg";
import stocksIcon from "../../raw/app-icons/stocks.svg";
import swiftPlaygroundsIcon from "../../raw/app-icons/swift-playgrounds.svg";
import systemSettingsIcon from "../../raw/app-icons/system-settings.svg";
import terminalIcon from "../../raw/app-icons/terminal.svg";
import texteditIcon from "../../raw/app-icons/textedit.svg";
import trashFullIcon from "../../raw/app-icons/trash-full.svg";
import trashIcon from "../../raw/app-icons/trash.svg";
import voiceMemosIcon from "../../raw/app-icons/voice-memos.svg";
import xcodeIcon from "../../raw/app-icons/xcode.svg";

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
const getAppIconSrc = (name: AppIconName) => appIconSources[name];
const appIconNames = Object.keys(appIconSources) as AppIconName[];
const appIconPreloadTargets = appIconNames.map(name => ({
  key: `app-icon-${name}`,
  src: getAppIconSrc(name),
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
    src={getAppIconSrc(name)}
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
export { getAppIconSrc };
export default AppIcon;
