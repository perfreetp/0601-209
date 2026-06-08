import { useState } from "react";
import {
  Palette,
  Check,
  Sparkles,
  Zap,
  Gift,
  Flame,
  Settings2,
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { TemplateStyle } from "@/types";

const styleIcons: Record<TemplateStyle, typeof Zap> = {
  new: Sparkles,
  group: Zap,
  festival: Gift,
  clearance: Flame,
};

const styleColors: Record<TemplateStyle, { gradient: string; badge: string; border: string }> = {
  new: {
    gradient: "from-purple-500/20 to-cyan-500/20",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    border: "border-purple-500/50",
  },
  group: {
    gradient: "from-orange-500/20 to-amber-500/20",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    border: "border-orange-500/50",
  },
  festival: {
    gradient: "from-red-500/20 to-rose-500/20",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
    border: "border-red-500/50",
  },
  clearance: {
    gradient: "from-emerald-500/20 to-green-500/20",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    border: "border-emerald-500/50",
  },
};

const styleLabels: Record<TemplateStyle, string> = {
  new: "新品上市",
  group: "团购促销",
  festival: "节日营销",
  clearance: "清仓甩卖",
};

const Templates = () => {
  const { templates, selectedTemplate, setSelectedTemplate } = useAppStore();
  const [expandedConfig, setExpandedConfig] = useState(false);
  const [filter, setFilter] = useState<TemplateStyle | "all">("all");

  const filteredTemplates =
    filter === "all" ? templates : templates.filter((t) => t.style === filter);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Palette className="w-7 h-7 text-primary-400" />
            模板选择
          </h1>
          <p className="text-gray-400">选择适合您营销场景的视频模板风格</p>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400 mr-2">风格筛选：</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-primary-500 text-white"
                : "bg-dark-700 text-gray-400 hover:text-white"
            }`}
          >
            全部
          </button>
          {(Object.keys(styleLabels) as TemplateStyle[]).map((style) => {
            const Icon = styleIcons[style];
            return (
              <button
                key={style}
                onClick={() => setFilter(style)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  filter === style
                    ? "bg-primary-500 text-white"
                    : "bg-dark-700 text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {styleLabels[style]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {filteredTemplates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;
          const colors = styleColors[template.style];
          const Icon = styleIcons[template.style];
          return (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? `ring-2 ring-offset-2 ring-offset-dark-950 ring-primary-500 scale-[1.02] shadow-glow`
                  : "hover:scale-[1.02]"
              }`}
            >
              <div
                className={`relative aspect-video overflow-hidden bg-gradient-to-br ${colors.gradient}`}
              >
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`badge border ${colors.badge} flex items-center gap-1`}>
                    <Icon className="w-3 h-3" />
                    {styleLabels[template.style]}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center shadow-glow">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-lg font-bold text-white mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2">{template.description}</p>
                </div>
                {!isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="btn-primary text-sm">选择此模板</span>
                  </div>
                )}
              </div>
              <div className="p-4 bg-dark-800/80 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: template.primaryColor }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: template.secondaryColor }}
                    />
                    <span className="text-xs text-gray-500">配色方案</span>
                  </div>
                  <span className="text-xs text-gray-500 capitalize">
                    {template.animationSpeed === "slow"
                      ? "慢速"
                      : template.animationSpeed === "fast"
                      ? "快速"
                      : "正常"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTemplate && (
        <div className="glass-card p-6 animate-slide-up">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedConfig(!expandedConfig)}
          >
            <h2 className="section-title mb-0">
              <Settings2 className="w-5 h-5 text-primary-400" />
              模板参数配置
              <span className="badge bg-primary-500/15 text-primary-400 border border-primary-500/30 ml-2">
                {selectedTemplate.name}
              </span>
            </h2>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedConfig ? "rotate-180" : ""
              }`}
            />
          </div>

          {expandedConfig && (
            <div className="mt-6 grid grid-cols-3 gap-6 animate-slide-up">
              <div>
                <label className="block text-sm text-gray-400 mb-2">主色调</label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-white/20"
                    style={{ background: selectedTemplate.primaryColor }}
                  />
                  <div>
                    <p className="text-white font-medium">{selectedTemplate.primaryColor}</p>
                    <p className="text-xs text-gray-500">品牌主色</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">辅助色</label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-white/20"
                    style={{ background: selectedTemplate.secondaryColor }}
                  />
                  <div>
                    <p className="text-white font-medium">{selectedTemplate.secondaryColor}</p>
                    <p className="text-xs text-gray-500">点缀色彩</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">字体风格</label>
                <div className="p-3 rounded-xl bg-dark-800/50 border border-white/10">
                  <p className="font-display text-white text-lg">Sample Text</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedTemplate.fontFamily}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">动画速度</label>
                <div className="flex gap-2">
                  {(["slow", "normal", "fast"] as const).map((speed) => (
                    <button
                      key={speed}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTemplate.animationSpeed === speed
                          ? "bg-primary-500 text-white"
                          : "bg-dark-700 text-gray-400 hover:text-white"
                      }`}
                    >
                      {speed === "slow" ? "慢速" : speed === "fast" ? "快速" : "正常"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Templates;
