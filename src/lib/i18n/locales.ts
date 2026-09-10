import type { Category } from "@/lib/news/types";

export const LOCALES = ["ja", "en", "zh", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_META: Record<
  Locale,
  { label: string; native: string; html: string; intl: string; edition: string }
> = {
  ja: { label: "日本語", native: "日本語", html: "ja", intl: "ja-JP", edition: "JAPAN" },
  en: { label: "English", native: "English", html: "en", intl: "en-US", edition: "WORLD" },
  zh: { label: "中文", native: "中文", html: "zh-CN", intl: "zh-CN", edition: "CHINA" },
  ko: { label: "한국어", native: "한국어", html: "ko", intl: "ko-KR", edition: "KOREA" },
};

export function parseLocale(value: unknown): Locale {
  if (typeof value === "string" && (LOCALES as readonly string[]).includes(value)) {
    return value as Locale;
  }
  return "ja";
}

type Dict = {
  tagline: string;
  search: string;
  saved: string;
  savedTitle: string;
  savedEmpty: string;
  breaking: string;
  all: string;
  categories: Record<Category, string>;
  kickers: Record<Category, string>;
  topStory: string;
  empty: string;
  footer: string;
  fetched: string;
  back: string;
  missing: string;
  headlineOnly: string;
  readOriginal: string;
  related: string;
  bookmark: string;
  unbookmark: string;
  city: string;
  lang: string;
  nav: string;
  translated: string;
  original: string;
  special: string;
  latest: string;
  notify: string;
  notifyOn: string;
  notifyOff: string;
  alerts: string;
  alertsEmpty: string;
  newAlerts: string;
  disaster: string;
  install: string;
  iosInstall: string;
  installHint: string;
  pwaBanner: string;
  close: string;
  pwaTitle: string;
  pwaReady: string;
  pwaAdded: string;
  pwaOpenTab: string;
  pwaChrome: string;
  pwaIos1: string;
  pwaIos2: string;
  pwaIos3: string;
  sportSearch: string;
  sportAll: string;
  sportPriority: string;
  musicDomestic: string;
  musicOverseas: string;
};

export const MESSAGES: Record<Locale, Dict> = {
  ja: {
    tagline: "海外・芸能・音楽・政治・スポーツ・経済。いまを、朝刊の紙面のように。",
    search: "見出しを探す",
    saved: "保存",
    savedTitle: "保存した記事",
    savedEmpty: "まだ保存した記事はありません。",
    breaking: "速報",
    all: "総合",
    categories: {
      world: "海外",
      entertainment: "芸能",
      music: "音楽",
      politics: "政治",
      sports: "スポーツ",
      economy: "経済",
    },
    kickers: {
      world: "WORLD",
      entertainment: "ENTERTAINMENT",
      music: "MUSIC",
      politics: "POLITICS",
      sports: "SPORTS",
      economy: "ECONOMY",
    },
    topStory: "TOP STORY",
    empty: "該当する記事がありません。",
    footer: "見出しは各社のRSS配信に基づきます。本文は各媒体の原文をご覧ください。",
    fetched: "最終取得",
    back: "紙面へ戻る",
    missing: "この記事は見つかりませんでした。",
    headlineOnly: "配信元の見出しのみ公開されています。全文は原文でご覧ください。",
    readOriginal: "原文を読む",
    related: "同じ分野",
    bookmark: "後で読む",
    unbookmark: "保存を解除",
    city: "東京",
    lang: "言語",
    nav: "分野",
    translated: "訳",
    original: "原文",
    special: "特設",
    latest: "最新",
    notify: "通知",
    notifyOn: "通知オン",
    notifyOff: "通知を許可",
    alerts: "速報",
    alertsEmpty: "新しい速報は、紙面の右上と鐘に出ます。",
    newAlerts: "件の新着",
    disaster: "災害",
    install: "追加",
    iosInstall: "共有ボタンから「ホーム画面に追加」を選んでください。",
    installHint: "ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選んでください。",
    pwaBanner: "In報をホーム画面に追加すると、紙面をすぐ開けます。",
    close: "閉じる",
    pwaTitle: "アプリを追加",
    pwaReady: "この端末にインストール",
    pwaAdded: "ホーム画面に追加済みです。",
    pwaOpenTab: "プレビュー枠の中では追加できません。新しいタブで開いてからインストールしてください。",
    pwaChrome: "Chrome または Edge のメニューから「アプリをインストール」を選んでください。少し待つと、上のボタンが使えます。",
    pwaIos1: "下部の共有ボタンをタップします。",
    pwaIos2: "「ホーム画面に追加」を選びます。",
    pwaIos3: "右上の「追加」で完了します。",
    sportSearch: "競技を探す（サッカー、野球…）",
    sportAll: "すべての競技",
    sportPriority: "優先表示",
    musicDomestic: "国内",
    musicOverseas: "海外",
  },
  en: {
    tagline: "World, entertainment, music, politics, sports, and business — read like a morning paper.",
    search: "Search headlines",
    saved: "Saved",
    savedTitle: "Saved stories",
    savedEmpty: "No saved stories yet.",
    breaking: "LIVE",
    all: "Top",
    categories: {
      world: "World",
      entertainment: "Entertainment",
      music: "Music",
      politics: "Politics",
      sports: "Sports",
      economy: "Business",
    },
    kickers: {
      world: "WORLD",
      entertainment: "ENTERTAINMENT",
      music: "MUSIC",
      politics: "POLITICS",
      sports: "SPORTS",
      economy: "BUSINESS",
    },
    topStory: "TOP STORY",
    empty: "No matching stories.",
    footer: "Headlines come from publisher RSS feeds. Read the full story at the source.",
    fetched: "Updated",
    back: "Back to front page",
    missing: "This story could not be found.",
    headlineOnly: "Only the headline was provided. Open the original for the full article.",
    readOriginal: "Read original",
    related: "More in this section",
    bookmark: "Save for later",
    unbookmark: "Remove from saved",
    city: "Tokyo",
    lang: "Language",
    nav: "Sections",
    translated: "TR",
    original: "Original",
    special: "Specials",
    latest: "Latest",
    notify: "Alerts",
    notifyOn: "Alerts on",
    notifyOff: "Allow alerts",
    alerts: "Alerts",
    alertsEmpty: "No new alerts. Disasters appear here as soon as they arrive.",
    newAlerts: "new",
    disaster: "Disaster",
    install: "Install",
    iosInstall: "Tap Share, then Add to Home Screen.",
    installHint: "Use the browser menu to Install app or Add to Home Screen.",
    pwaBanner: "Add In報 to your home screen to open the paper instantly.",
    close: "Close",
    pwaTitle: "Install app",
    pwaReady: "Install on this device",
    pwaAdded: "In報 is already on your home screen.",
    pwaOpenTab: "Install is blocked inside the preview frame. Open this page in a new tab, then install.",
    pwaChrome: "In Chrome or Edge, use Install app from the menu. The button above appears after a moment.",
    pwaIos1: "Tap the Share button.",
    pwaIos2: "Choose Add to Home Screen.",
    pwaIos3: "Tap Add in the top right.",
    sportSearch: "Search a sport (soccer, baseball…)",
    sportAll: "All sports",
    sportPriority: "Showing first",
    musicDomestic: "Japan",
    musicOverseas: "World",
  },
  zh: {
    tagline: "国际、娱乐、音乐、政治、体育、财经。像早报一样读今天。",
    search: "搜索标题",
    saved: "收藏",
    savedTitle: "已收藏文章",
    savedEmpty: "还没有收藏的文章。",
    breaking: "快讯",
    all: "要闻",
    categories: {
      world: "国际",
      entertainment: "娱乐",
      music: "音乐",
      politics: "政治",
      sports: "体育",
      economy: "财经",
    },
    kickers: {
      world: "WORLD",
      entertainment: "ENTERTAINMENT",
      music: "MUSIC",
      politics: "POLITICS",
      sports: "SPORTS",
      economy: "BUSINESS",
    },
    topStory: "头条",
    empty: "没有符合条件的文章。",
    footer: "标题来自各媒体 RSS。全文请阅读原文。",
    fetched: "更新于",
    back: "返回头版",
    missing: "找不到这篇文章。",
    headlineOnly: "目前仅提供标题。请打开原文阅读全文。",
    readOriginal: "阅读原文",
    related: "同领域",
    bookmark: "稍后阅读",
    unbookmark: "取消收藏",
    city: "东京",
    lang: "语言",
    nav: "栏目",
    translated: "译",
    original: "原文",
    special: "特辑",
    latest: "最新",
    notify: "通知",
    notifyOn: "通知已开",
    notifyOff: "允许通知",
    alerts: "快讯",
    alertsEmpty: "暂无新通知。灾害信息会第一时间出现在这里。",
    newAlerts: "条新消息",
    disaster: "灾害",
    install: "安装",
    iosInstall: "点分享，然后选择“添加到主屏幕”。",
    installHint: "请从浏览器菜单选择“安装应用”或“添加到主屏幕”。",
    pwaBanner: "把 In報 添加到主屏幕，打开更快。",
    close: "关闭",
    pwaTitle: "安装应用",
    pwaReady: "安装到此设备",
    pwaAdded: "已添加到主屏幕。",
    pwaOpenTab: "预览框内无法安装。请用新标签页打开后再安装。",
    pwaChrome: "请在 Chrome 或 Edge 菜单中选择“安装应用”。稍等后上方按钮可用。",
    pwaIos1: "点分享按钮。",
    pwaIos2: "选择“添加到主屏幕”。",
    pwaIos3: "点右上角“添加”。",
    sportSearch: "搜索项目（足球、棒球…）",
    sportAll: "全部项目",
    sportPriority: "优先显示",
    musicDomestic: "国内",
    musicOverseas: "海外",
  },
  ko: {
    tagline: "해외, 연예, 음악, 정치, 스포츠, 경제. 조간신문처럼 오늘을 읽습니다.",
    search: "헤드라인 검색",
    saved: "저장",
    savedTitle: "저장한 기사",
    savedEmpty: "저장한 기사가 없습니다.",
    breaking: "속보",
    all: "종합",
    categories: {
      world: "해외",
      entertainment: "연예",
      music: "음악",
      politics: "정치",
      sports: "스포츠",
      economy: "경제",
    },
    kickers: {
      world: "WORLD",
      entertainment: "ENTERTAINMENT",
      music: "MUSIC",
      politics: "POLITICS",
      sports: "SPORTS",
      economy: "ECONOMY",
    },
    topStory: "헤드라인",
    empty: "해당하는 기사가 없습니다.",
    footer: "헤드라인은 각 매체의 RSS를 따릅니다. 본문은 원문에서 확인하세요.",
    fetched: "마지막 수집",
    back: "1면으로",
    missing: "이 기사를 찾을 수 없습니다.",
    headlineOnly: "제목만 제공됩니다. 전문은 원문에서 확인하세요.",
    readOriginal: "원문 보기",
    related: "같은 분야",
    bookmark: "나중에 읽기",
    unbookmark: "저장 해제",
    city: "도쿄",
    lang: "언어",
    nav: "분야",
    translated: "번역",
    original: "원문",
    special: "특집",
    latest: "최신",
    notify: "알림",
    notifyOn: "알림 켜짐",
    notifyOff: "알림 허용",
    alerts: "속보",
    alertsEmpty: "새 알림이 없습니다. 재해 속보는 들어오는 대로 여기에 표시됩니다.",
    newAlerts: "건 신규",
    disaster: "재해",
    install: "추가",
    iosInstall: "공유 버튼에서 ‘홈 화면에 추가’를 선택하세요.",
    installHint: "브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택하세요.",
    pwaBanner: "In報를 홈 화면에 추가하면 바로 열 수 있습니다.",
    close: "닫기",
    pwaTitle: "앱 추가",
    pwaReady: "이 기기에 설치",
    pwaAdded: "홈 화면에 이미 추가되어 있습니다.",
    pwaOpenTab: "미리보기 안에서는 설치할 수 없습니다. 새 탭에서 연 뒤 설치하세요.",
    pwaChrome: "Chrome 또는 Edge 메뉴에서 앱 설치를 선택하세요. 잠시 후면 위 버튼을 쓸 수 있습니다.",
    pwaIos1: "공유 버튼을 탭하세요.",
    pwaIos2: "‘홈 화면에 추가’를 선택하세요.",
    pwaIos3: "오른쪽 위 ‘추가’로 완료합니다.",
    sportSearch: "종목 검색 (축구, 야구…)",
    sportAll: "모든 종목",
    sportPriority: "우선 표시",
    musicDomestic: "국내",
    musicOverseas: "해외",
  },
};
