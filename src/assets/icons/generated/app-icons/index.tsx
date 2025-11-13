import type { CSSProperties } from "react";
import ActivityMonitorIcon from "../../raw/app-icons/activity-monitor.svg";
import AirportUtilityIcon from "../../raw/app-icons/airport-utility.svg";
import AppStoreIcon from "../../raw/app-icons/app-store.svg";
import AppleTvIcon from "../../raw/app-icons/apple-tv.svg";
import AudioMidiSetupIcon from "../../raw/app-icons/audio-midi-setup.svg";
import BluetoothFileExchangeIcon from "../../raw/app-icons/bluetooth-file-exchange.svg";
import BooksIcon from "../../raw/app-icons/books.svg";
import CalculatorIcon from "../../raw/app-icons/calculator.svg";
import CalendarIcon from "../../raw/app-icons/calendar.svg";
import ChessIcon from "../../raw/app-icons/chess.svg";
import ClockIcon from "../../raw/app-icons/clock.svg";
import ColorsyncUtilityIcon from "../../raw/app-icons/colorsync-utility.svg";
import ConsoleIcon from "../../raw/app-icons/console.svg";
import ContactsIcon from "../../raw/app-icons/contacts.svg";
import CustomAppIcon from "../../raw/app-icons/custom-app.svg";
import DictionaryIcon from "../../raw/app-icons/dictionary.svg";
import DigitalColorMeterIcon from "../../raw/app-icons/digital-color-meter.svg";
import DiskUtilityIcon from "../../raw/app-icons/disk-utility.svg";
import DocumentIcon from "../../raw/app-icons/document.svg";
import FacetimeIcon from "../../raw/app-icons/facetime.svg";
import FigmaIcon from "../../raw/app-icons/figma.svg";
import FinalCutProIcon from "../../raw/app-icons/final-cut-pro.svg";
import FindMyIcon from "../../raw/app-icons/find-my.svg";
import FinderIcon from "../../raw/app-icons/finder.svg";
import FolderIcon from "../../raw/app-icons/folder.svg";
import FontBookIcon from "../../raw/app-icons/font-book.svg";
import FreeformIcon from "../../raw/app-icons/freeform.svg";
import GaragebandIcon from "../../raw/app-icons/garageband.svg";
import GrapherIcon from "../../raw/app-icons/grapher.svg";
import HomeIcon from "../../raw/app-icons/home.svg";
import ImageCaptureIcon from "../../raw/app-icons/image-capture.svg";
import ImovieIcon from "../../raw/app-icons/imovie.svg";
import KeychainAccessIcon from "../../raw/app-icons/keychain-access.svg";
import KeynoteIcon from "../../raw/app-icons/keynote.svg";
import LaunchpadIcon from "../../raw/app-icons/launchpad.svg";
import MailIcon from "../../raw/app-icons/mail.svg";
import MapsIcon from "../../raw/app-icons/maps.svg";
import MessagesIcon from "../../raw/app-icons/messages.svg";
import MigrationAssistantIcon from "../../raw/app-icons/migration-assistant.svg";
import MissionControlIcon from "../../raw/app-icons/mission-control.svg";
import MusicIcon from "../../raw/app-icons/music.svg";
import NewsIcon from "../../raw/app-icons/news.svg";
import NotesIcon from "../../raw/app-icons/notes.svg";
import NumbersIcon from "../../raw/app-icons/numbers.svg";
import PagesIcon from "../../raw/app-icons/pages.svg";
import PhotoBoothIcon from "../../raw/app-icons/photo-booth.svg";
import PhotosIcon from "../../raw/app-icons/photos.svg";
import PodcastsIcon from "../../raw/app-icons/podcasts.svg";
import PreviewIcon from "../../raw/app-icons/preview.svg";
import QuicktimePlayerIcon from "../../raw/app-icons/quicktime-player.svg";
import RemindersIcon from "../../raw/app-icons/reminders.svg";
import SafariIcon from "../../raw/app-icons/safari.svg";
import ScreenshotIcon from "../../raw/app-icons/screenshot.svg";
import ScriptEditorIcon from "../../raw/app-icons/script-editor.svg";
import ShortcutsIcon from "../../raw/app-icons/shortcuts.svg";
import SiriIcon from "../../raw/app-icons/siri.svg";
import StickiesIcon from "../../raw/app-icons/stickies.svg";
import StocksIcon from "../../raw/app-icons/stocks.svg";
import SwiftPlaygroundsIcon from "../../raw/app-icons/swift-playgrounds.svg";
import SystemInformationIcon from "../../raw/app-icons/system-information.svg";
import SystemSettingsIcon from "../../raw/app-icons/system-settings.svg";
import TerminalIcon from "../../raw/app-icons/terminal.svg";
import TexteditIcon from "../../raw/app-icons/textedit.svg";
import TimeMachineIcon from "../../raw/app-icons/time-machine.svg";
import TrashIcon from "../../raw/app-icons/trash.svg";
import TrashFullIcon from "../../raw/app-icons/trash-full.svg";
import VoiceMemosIcon from "../../raw/app-icons/voice-memos.svg";
import VoiceoverUtilityIcon from "../../raw/app-icons/voiceover-utility.svg";
import WeatherIcon from "../../raw/app-icons/weather.svg";
import XcodeIcon from "../../raw/app-icons/xcode.svg";

const appIconSources = {
  "activity-monitor": ActivityMonitorIcon,
  "airport-utility": AirportUtilityIcon,
  "app-store": AppStoreIcon,
  "apple-tv": AppleTvIcon,
  "audio-midi-setup": AudioMidiSetupIcon,
  "bluetooth-file-exchange": BluetoothFileExchangeIcon,
  "books": BooksIcon,
  "calculator": CalculatorIcon,
  "calendar": CalendarIcon,
  "chess": ChessIcon,
  "clock": ClockIcon,
  "colorsync-utility": ColorsyncUtilityIcon,
  "console": ConsoleIcon,
  "contacts": ContactsIcon,
  "custom-app": CustomAppIcon,
  "dictionary": DictionaryIcon,
  "digital-color-meter": DigitalColorMeterIcon,
  "disk-utility": DiskUtilityIcon,
  "document": DocumentIcon,
  "facetime": FacetimeIcon,
  "figma": FigmaIcon,
  "final-cut-pro": FinalCutProIcon,
  "find-my": FindMyIcon,
  "finder": FinderIcon,
  "folder": FolderIcon,
  "font-book": FontBookIcon,
  "freeform": FreeformIcon,
  "garageband": GaragebandIcon,
  "grapher": GrapherIcon,
  "home": HomeIcon,
  "image-capture": ImageCaptureIcon,
  "imovie": ImovieIcon,
  "keychain-access": KeychainAccessIcon,
  "keynote": KeynoteIcon,
  "launchpad": LaunchpadIcon,
  "mail": MailIcon,
  "maps": MapsIcon,
  "messages": MessagesIcon,
  "migration-assistant": MigrationAssistantIcon,
  "mission-control": MissionControlIcon,
  "music": MusicIcon,
  "news": NewsIcon,
  "notes": NotesIcon,
  "numbers": NumbersIcon,
  "pages": PagesIcon,
  "photo-booth": PhotoBoothIcon,
  "photos": PhotosIcon,
  "podcasts": PodcastsIcon,
  "preview": PreviewIcon,
  "quicktime-player": QuicktimePlayerIcon,
  "reminders": RemindersIcon,
  "safari": SafariIcon,
  "screenshot": ScreenshotIcon,
  "script-editor": ScriptEditorIcon,
  "shortcuts": ShortcutsIcon,
  "siri": SiriIcon,
  "stickies": StickiesIcon,
  "stocks": StocksIcon,
  "swift-playgrounds": SwiftPlaygroundsIcon,
  "system-information": SystemInformationIcon,
  "system-settings": SystemSettingsIcon,
  "terminal": TerminalIcon,
  "textedit": TexteditIcon,
  "time-machine": TimeMachineIcon,
  "trash": TrashIcon,
  "trash-full": TrashFullIcon,
  "voice-memos": VoiceMemosIcon,
  "voiceover-utility": VoiceoverUtilityIcon,
  "weather": WeatherIcon,
  "xcode": XcodeIcon,
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
