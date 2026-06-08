export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  description?: string;
  images: string[];
  category?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  businessHours: string;
  logo?: string;
  description?: string;
}

export interface Subtitle {
  timestamp: number;
  text: string;
}

export interface VideoScript {
  id: string;
  opening: string;
  sellingPoints: string[];
  callToAction: string;
  subtitles: Subtitle[];
}

export type TemplateStyle = "new" | "group" | "festival" | "clearance";

export interface VideoTemplate {
  id: string;
  name: string;
  style: TemplateStyle;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  animationSpeed: "slow" | "normal" | "fast";
  description: string;
  previewImage: string;
}

export interface VoiceConfig {
  id: string;
  gender: "male" | "female";
  tone: string;
  speed: number;
  dialect: string;
}

export type VideoStatus =
  | "draft"
  | "generating"
  | "completed"
  | "failed"
  | "pending_review";

export interface VideoProject {
  id: string;
  productId: string;
  templateId: string;
  script: VideoScript;
  voiceConfig: VoiceConfig;
  imageOrder: string[];
  transition: string;
  backgroundMusic: string;
  coverImage?: string;
  status: VideoStatus;
  title: string;
  createdAt: string;
}

export type ScheduleStatus = "scheduled" | "published" | "failed";

export interface PublishSchedule {
  id: string;
  videoProjectId: string;
  videoTitle: string;
  publishTime: string;
  platforms: string[];
  status: ScheduleStatus;
}

export type RecordStatus = "success" | "failed" | "pending_review";

export interface GenerationRecord {
  id: string;
  videoProjectId: string;
  videoTitle: string;
  status: RecordStatus;
  errorMessage?: string;
  createdAt: string;
  needsReview: boolean;
}

export interface AppState {
  products: Product[];
  store: Store;
  currentScript: VideoScript | null;
  selectedTemplate: VideoTemplate | null;
  voiceConfig: VoiceConfig;
  videoProjects: VideoProject[];
  schedules: PublishSchedule[];
  records: GenerationRecord[];
}
