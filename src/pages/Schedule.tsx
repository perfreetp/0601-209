import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  Check,
  Trash2,
  Send,
  Music,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { PublishSchedule } from "@/types";

const platforms = [
  { id: "douyin", label: "抖音", icon: "🎵", color: "from-black to-gray-900" },
  { id: "kuaishou", label: "快手", icon: "📹", color: "from-orange-500 to-red-500" },
  { id: "shipinhao", label: "视频号", icon: "💚", color: "from-green-500 to-emerald-600" },
  { id: "bilibili", label: "B站", icon: "📺", color: "from-pink-500 to-blue-500" },
  { id: "xiaohongshu", label: "小红书", icon: "📕", color: "from-red-500 to-pink-600" },
];

const Schedule = () => {
  const { schedules, videoProjects, addSchedule, removeSchedule } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("18:00");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["douyin"]);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月",
  ];
  const weekdayNames = ["日", "一", "二", "三", "四", "五", "六"];

  const getSchedulesForDate = (date: Date) => {
    return schedules.filter((s) => {
      const sDate = new Date(s.publishTime);
      return (
        sDate.getDate() === date.getDate() &&
        sDate.getMonth() === date.getMonth() &&
        sDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleAddSchedule = () => {
    if (!selectedVideo || !selectedDate || !selectedTime) return;
    const project = videoProjects.find((p) => p.id === selectedVideo);
    if (!project) return;

    const newSchedule: PublishSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      videoProjectId: selectedVideo,
      videoTitle: project.title,
      publishTime: new Date(`${selectedDate}T${selectedTime}:00`).toISOString(),
      platforms: selectedPlatforms.map(
        (p) => platforms.find((pl) => pl.id === p)?.label || p
      ),
      status: "scheduled",
    };
    addSchedule(newSchedule);
    setShowAddModal(false);
    setSelectedVideo("");
    setSelectedDate("");
    setSelectedPlatforms(["douyin"]);
  };

  const todaySchedule = getSchedulesForDate(new Date());

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-primary-400" />
            发布排期
          </h1>
          <p className="text-gray-400">设置视频发布时间，定时自动发布到各平台</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-dark-800 p-1">
            {(["month", "week"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === mode
                    ? "bg-primary-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {mode === "month" ? "月视图" : "周视图"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新建排期
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{schedules.length}</p>
              <p className="text-sm text-gray-500">总排期数</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-green/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-accent-green" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">
                {schedules.filter((s) => s.status === "published").length}
              </p>
              <p className="text-sm text-gray-500">已发布</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-orange/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-orange" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">
                {schedules.filter((s) => s.status === "scheduled").length}
              </p>
              <p className="text-sm text-gray-500">待发布</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{todaySchedule.length}</p>
              <p className="text-sm text-gray-500">今日排期</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </button>
            <h2 className="font-display text-xl font-bold text-white">
              {year}年 {monthNames[month]}
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {[...Array(startWeekday)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const date = new Date(year, month, i + 1);
              const daySchedules = getSchedulesForDate(date);
              const today = isToday(date);
              return (
                <div
                  key={i + 1}
                  onClick={() => {
                    setSelectedDate(
                      `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
                    );
                    setShowAddModal(true);
                  }}
                  className={`aspect-square rounded-xl p-2 cursor-pointer transition-all border ${
                    today
                      ? "bg-primary-500/20 border-primary-500/50"
                      : daySchedules.length > 0
                      ? "bg-dark-800/70 border-primary-500/20 hover:bg-dark-700"
                      : "bg-dark-800/30 border-transparent hover:bg-dark-800/60 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        today ? "text-primary-400" : "text-gray-300"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {daySchedules.length > 0 && (
                      <span className="flex gap-0.5">
                        {daySchedules.slice(0, 3).map((_, idx) => (
                          <span
                            key={idx}
                            className="w-1.5 h-1.5 rounded-full bg-primary-500"
                          />
                        ))}
                      </span>
                    )}
                  </div>
                  {daySchedules.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {daySchedules.slice(0, 2).map((s) => (
                        <div
                          key={s.id}
                          className="text-[10px] text-gray-400 truncate bg-dark-900/50 px-1.5 py-0.5 rounded"
                        >
                          {new Date(s.publishTime).toLocaleTimeString("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          {s.videoTitle.slice(0, 6)}
                        </div>
                      ))}
                      {daySchedules.length > 2 && (
                        <div className="text-[10px] text-primary-400">
                          +{daySchedules.length - 2} 更多
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="glass-card p-6">
            <h2 className="section-title mb-4">
              <Clock className="w-5 h-5 text-primary-400" />
              即将发布
            </h2>
            <div className="space-y-3">
              {schedules
                .filter((s) => s.status === "scheduled")
                .slice(0, 5)
                .map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-3 rounded-xl bg-dark-800/50 border border-white/5 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {schedule.videoTitle}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(schedule.publishTime).toLocaleString("zh-CN", {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="flex gap-1 mt-1.5">
                          {schedule.platforms.slice(0, 3).map((p, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-dark-700 text-gray-400"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => removeSchedule(schedule.id)}
                        className="w-7 h-7 rounded-md bg-dark-700 hover:bg-accent-red/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-accent-red" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="section-title mb-4">
              <Music className="w-5 h-5 text-primary-400" />
              平台分布
            </h2>
            <div className="space-y-3">
              {platforms.map((platform) => {
                const count = schedules.filter((s) =>
                  s.platforms.includes(platform.label)
                ).length;
                const percent = schedules.length > 0 ? (count / schedules.length) * 100 : 0;
                return (
                  <div key={platform.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-300 flex items-center gap-1.5">
                        <span>{platform.icon}</span>
                        {platform.label}
                      </span>
                      <span className="text-sm text-gray-400">{count}条</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-dark-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${platform.color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary-400" />
                新建排期
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">选择视频</label>
                <select
                  value={selectedVideo}
                  onChange={(e) => setSelectedVideo(e.target.value)}
                  className="input-field"
                >
                  <option value="">请选择要发布的视频</option>
                  {videoProjects
                    .filter((p) => p.status === "completed" || p.status === "pending_review")
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">发布日期</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">发布时间</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">发布平台</label>
                <div className="grid grid-cols-5 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-primary-500 bg-primary-500/10"
                          : "border-white/10 bg-dark-800/50 hover:border-primary-500/30"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{platform.icon}</span>
                      <span className="text-xs text-gray-300">{platform.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary text-sm"
              >
                取消
              </button>
              <button
                onClick={handleAddSchedule}
                className="btn-primary text-sm flex items-center gap-1.5"
                disabled={!selectedVideo || !selectedDate || selectedPlatforms.length === 0}
              >
                <Send className="w-4 h-4" />
                确认排期
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
