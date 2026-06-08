import { create } from "zustand";
import type {
  Product,
  Store,
  VideoScript,
  VideoTemplate,
  VoiceConfig,
  VideoProject,
  PublishSchedule,
  GenerationRecord,
  VideoStatus,
  RecordStatus,
} from "@/types";
import {
  mockProducts,
  mockStore,
  mockTemplates,
  mockScript,
  mockVoiceConfig,
  mockVideoProjects,
  mockSchedules,
  mockRecords,
} from "@/data/mockData";

interface GenerateVideoOptions {
  imageOrder?: string[];
  transition?: string;
  backgroundMusic?: string;
  coverImage?: string;
}

interface AppState {
  products: Product[];
  store: Store;
  templates: VideoTemplate[];
  currentScript: VideoScript | null;
  selectedTemplate: VideoTemplate | null;
  voiceConfig: VoiceConfig;
  videoProjects: VideoProject[];
  schedules: PublishSchedule[];
  records: GenerationRecord[];
  currentPage: string;

  setCurrentPage: (page: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  updateStore: (updates: Partial<Store>) => void;
  setCurrentScript: (script: VideoScript) => void;
  updateScript: (updates: Partial<VideoScript>) => void;
  setSelectedTemplate: (template: VideoTemplate | null) => void;
  updateVoiceConfig: (updates: Partial<VoiceConfig>) => void;
  addVideoProject: (project: VideoProject) => void;
  updateVideoProject: (id: string, updates: Partial<VideoProject>) => void;
  updateProjectStatus: (id: string, status: VideoStatus) => void;
  addSchedule: (schedule: PublishSchedule) => void;
  updateSchedule: (id: string, updates: Partial<PublishSchedule>) => void;
  removeSchedule: (id: string) => void;
  addRecord: (record: GenerationRecord) => void;
  updateRecordStatus: (id: string, status: RecordStatus) => void;
  generateVideo: (productId: string, templateId: string, options?: GenerateVideoOptions) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppState>((set) => ({
  products: mockProducts,
  store: mockStore,
  templates: mockTemplates,
  currentScript: mockScript,
  selectedTemplate: mockTemplates[0],
  voiceConfig: mockVoiceConfig,
  videoProjects: mockVideoProjects,
  schedules: mockSchedules,
  records: mockRecords,
  currentPage: "dashboard",

  setCurrentPage: (page) => set({ currentPage: page }),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: generateId() }],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateStore: (updates) =>
    set((state) => ({
      store: { ...state.store, ...updates },
    })),

  setCurrentScript: (script) => set({ currentScript: script }),

  updateScript: (updates) =>
    set((state) => ({
      currentScript: state.currentScript
        ? { ...state.currentScript, ...updates }
        : null,
    })),

  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  updateVoiceConfig: (updates) =>
    set((state) => ({
      voiceConfig: { ...state.voiceConfig, ...updates },
    })),

  addVideoProject: (project) =>
    set((state) => ({
      videoProjects: [...state.videoProjects, project],
    })),

  updateVideoProject: (id, updates) =>
    set((state) => ({
      videoProjects: state.videoProjects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  updateProjectStatus: (id, status) =>
    set((state) => ({
      videoProjects: state.videoProjects.map((p) =>
        p.id === id ? { ...p, status } : p
      ),
    })),

  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule],
    })),

  updateSchedule: (id, updates) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  removeSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    })),

  addRecord: (record) =>
    set((state) => ({
      records: [...state.records, record],
    })),

  updateRecordStatus: (id, status) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id ? { ...r, status, needsReview: status === "pending_review" } : r
      ),
    })),

  generateVideo: (productId, templateId, options) => {
    set((state) => {
      const product = state.products.find((p) => p.id === productId);
      const template = state.templates.find((t) => t.id === templateId);
      if (!product || !template) return state;

      const finalImageOrder = options?.imageOrder && options.imageOrder.length > 0
        ? options.imageOrder
        : product.images;
      const finalCoverImage = options?.coverImage || finalImageOrder[0];

      const newProject: VideoProject = {
        id: generateId(),
        productId,
        templateId,
        script: state.currentScript ? { ...state.currentScript } : mockScript,
        voiceConfig: { ...state.voiceConfig },
        imageOrder: finalImageOrder,
        transition: options?.transition || "fade",
        backgroundMusic: options?.backgroundMusic || "欢快流行",
        coverImage: finalCoverImage,
        status: "generating",
        title: `${product.name}_${template.name}`,
        createdAt: new Date().toISOString(),
      };

      const projectId = newProject.id;
      const projectTitle = newProject.title;

      setTimeout(() => {
        const success = Math.random() > 0.2;
        const status: VideoStatus = success
          ? Math.random() > 0.7
            ? "pending_review"
            : "completed"
          : "failed";

        set((prevState) => ({
          videoProjects: prevState.videoProjects.map((p) =>
            p.id === projectId ? { ...p, status } : p
          ),
          records: [
            ...prevState.records,
            {
              id: generateId(),
              videoProjectId: projectId,
              videoTitle: projectTitle,
              status: status === "failed" ? "failed" : status === "pending_review" ? "pending_review" : "success",
              errorMessage: success
                ? undefined
                : "图片素材加载超时，请检查网络连接后重试",
              createdAt: new Date().toISOString(),
              needsReview: status === "pending_review",
            },
          ],
        }));
      }, 2000);

      return {
        videoProjects: [...state.videoProjects, newProject],
      };
    });
  },
}));
