import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  SkipBack,
  SkipForward,
  Edit3,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Video,
  RefreshCw,
  Download,
  Share2,
  Calendar,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const Preview = () => {
  const { videoProjects, updateVideoProject } = useAppStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(30);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const selectedProject = videoProjects[selectedIndex];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-accent-green/15 text-accent-green border-accent-green/30",
      generating: "bg-primary-500/15 text-primary-400 border-primary-500/30",
      failed: "bg-accent-red/15 text-accent-red border-accent-red/30",
      pending_review: "bg-accent-orange/15 text-accent-orange border-accent-orange/30",
    };
    const labels: Record<string, string> = {
      completed: "已完成",
      generating: "生成中",
      failed: "失败",
      pending_review: "待审核",
    };
    return (
      <span className={`badge border ${styles[status] || ""}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (!selectedProject) return null;

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = (field: string) => {
    updateVideoProject(selectedProject.id, { [field]: editValue });
    setEditingField(null);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Video className="w-7 h-7 text-primary-400" />
            预览编辑
          </h1>
          <p className="text-gray-400">预览生成的视频，逐条修改内容</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            重新生成
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            批量导出
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <div className="glass-card p-4 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">视频列表</span>
              <span className="badge bg-primary-500/15 text-primary-400 border border-primary-500/30">
                {videoProjects.length} 个视频
              </span>
            </div>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {videoProjects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full p-3 rounded-xl flex gap-3 text-left transition-all ${
                    selectedIndex === index
                      ? "bg-primary-500/10 border border-primary-500/30"
                      : "bg-dark-800/50 border border-white/5 hover:border-primary-500/20"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt=""
                        className="w-20 h-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-14 rounded-lg bg-dark-700" />
                    )}
                    {selectedIndex === index && (
                      <div className="absolute inset-0 rounded-lg bg-primary-500/40 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {project.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(project.status)}
                      <span className="text-xs text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <button
                onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                disabled={selectedIndex === 0}
                className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-gray-300" />
              </button>
              <span className="text-sm text-gray-400">
                {selectedIndex + 1} / {videoProjects.length}
              </span>
              <button
                onClick={() =>
                  setSelectedIndex(Math.min(videoProjects.length - 1, selectedIndex + 1))
                }
                disabled={selectedIndex === videoProjects.length - 1}
                className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-7 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                {editingField === "title" ? (
                  <div className="flex gap-2">
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="input-field text-lg font-display font-bold w-80"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && saveEdit("title")}
                    />
                    <button
                      onClick={() => saveEdit("title")}
                      className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="group flex items-center gap-2 cursor-pointer"
                    onClick={() => startEdit("title", selectedProject.title)}
                  >
                    <h2 className="font-display text-2xl font-bold text-white">
                      {selectedProject.title}
                    </h2>
                    <Edit3 className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(selectedProject.status)}
                  <span className="text-sm text-gray-500">
                    创建于 {new Date(selectedProject.createdAt).toLocaleString("zh-CN")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary flex items-center gap-1 text-sm py-2 px-3">
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
                <button className="btn-secondary flex items-center gap-1 text-sm py-2 px-3">
                  <Calendar className="w-4 h-4" />
                  排期
                </button>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-dark-900">
              {selectedProject.coverImage && (
                <img
                  src={selectedProject.coverImage}
                  alt=""
                  className="w-full h-full object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="badge bg-accent-orange/90 text-white border-0">限时特惠</span>
                <span className="text-xs text-white/80 bg-dark-950/60 px-2 py-1 rounded">
                  00:12 / 00:24
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white ml-0.5" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  招牌红烧牛肉面
                </p>
                <p className="text-3xl font-bold text-accent-orange drop-shadow-lg">
                  ¥28
                  <span className="text-base text-gray-300 line-through ml-2 font-normal">
                    ¥38
                  </span>
                </p>
                <p className="text-sm text-white/80 mt-1">点击左下角立即抢购！</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
              <button className="w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-all">
                <SkipBack className="w-4 h-4 text-gray-300" />
              </button>
              <button className="w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-all">
                <SkipForward className="w-4 h-4 text-gray-300" />
              </button>

              <div className="flex-1">
                <div
                  className="h-1.5 rounded-full bg-dark-700 cursor-pointer"
                  onClick={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    setProgress((x / rect.width) * 100);
                  }}
                >
                  <div
                    className="h-full rounded-full bg-gradient-primary relative"
                    style={{ width: `${progress}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-glow" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-all"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-gray-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-gray-300" />
                )}
              </button>
              <button className="w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-all">
                <Maximize2 className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="card-title mb-4">脚本内容</h3>
              <div className="space-y-3">
                {editingField === "script.opening" ? (
                  <div className="p-3 rounded-xl bg-dark-800/50 border border-primary-500/30">
                    <p className="text-xs text-gray-500 mb-2">开场文案</p>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="input-field w-full min-h-[80px] resize-none text-sm"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditingField(null)}
                        className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-dark-700"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => {
                          updateVideoProject(selectedProject.id, {
                            script: { ...selectedProject.script, opening: editValue },
                          });
                          setEditingField(null);
                        }}
                        className="text-xs text-white px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-400 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => startEdit("script.opening", selectedProject.script.opening)}
                    className="group p-3 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/20 cursor-pointer transition-all"
                  >
                    <p className="text-xs text-gray-500 mb-1">开场文案</p>
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-sm text-white">{selectedProject.script.opening}</p>
                      <Edit3 className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 mt-0.5 transition-opacity flex-shrink-0" />
                    </div>
                  </div>
                )}

                {editingField === "script.sellingPoints" ? (
                  <div className="p-3 rounded-xl bg-dark-800/50 border border-primary-500/30">
                    <p className="text-xs text-gray-500 mb-2">核心卖点（每行一条）</p>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="input-field w-full min-h-[100px] resize-none text-sm"
                      autoFocus
                      placeholder="每行输入一条卖点..."
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditingField(null)}
                        className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-dark-700"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => {
                          const points = editValue.split("\n").filter((p) => p.trim());
                          updateVideoProject(selectedProject.id, {
                            script: { ...selectedProject.script, sellingPoints: points },
                          });
                          setEditingField(null);
                        }}
                        className="text-xs text-white px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-400 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => startEdit("script.sellingPoints", selectedProject.script.sellingPoints.join("\n"))}
                    className="group p-3 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/20 cursor-pointer transition-all"
                  >
                    <p className="text-xs text-gray-500 mb-1">核心卖点</p>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-1">
                        {selectedProject.script.sellingPoints.map((point, i) => (
                          <p key={i} className="text-sm text-white">
                            • {point}
                          </p>
                        ))}
                      </div>
                      <Edit3 className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 mt-0.5 transition-opacity flex-shrink-0" />
                    </div>
                  </div>
                )}

                {editingField === "script.callToAction" ? (
                  <div className="p-3 rounded-xl bg-dark-800/50 border border-primary-500/30">
                    <p className="text-xs text-gray-500 mb-2">行动引导</p>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="input-field w-full min-h-[80px] resize-none text-sm"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditingField(null)}
                        className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-dark-700"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => {
                          updateVideoProject(selectedProject.id, {
                            script: { ...selectedProject.script, callToAction: editValue },
                          });
                          setEditingField(null);
                        }}
                        className="text-xs text-white px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-400 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => startEdit("script.callToAction", selectedProject.script.callToAction)}
                    className="group p-3 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/20 cursor-pointer transition-all"
                  >
                    <p className="text-xs text-gray-500 mb-1">行动引导</p>
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-sm text-white">{selectedProject.script.callToAction}</p>
                      <Edit3 className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 mt-0.5 transition-opacity flex-shrink-0" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="card-title mb-4">配置信息</h3>
              <div className="space-y-3">
                {[
                  { label: "配音", value: `${selectedProject.voiceConfig.gender === "female" ? "女声" : "男声"} · ${selectedProject.voiceConfig.tone}` },
                  { label: "语速", value: `${selectedProject.voiceConfig.speed}x` },
                  { label: "转场", value: selectedProject.transition },
                  { label: "背景音乐", value: selectedProject.backgroundMusic },
                  { label: "方言", value: selectedProject.voiceConfig.dialect },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50 border border-white/5">
                    <span className="text-sm text-gray-400">{item.label}</span>
                    <span className="text-sm text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
