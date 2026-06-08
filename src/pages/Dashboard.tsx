import {
  LayoutDashboard,
  Video,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Sparkles,
  ImagePlus,
  FileText,
  Palette,
  Mic,
  Scissors,
  Play,
  Calendar,
  BarChart3,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const { videoProjects, records, schedules, products } = useAppStore();

  const totalVideos = videoProjects.length;
  const completedVideos = videoProjects.filter(
    (p) => p.status === "completed"
  ).length;
  const successRate = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
  const pendingReview = records.filter((r) => r.needsReview).length;
  const todaySchedules = schedules.filter(
    (s) => new Date(s.publishTime).toDateString() === new Date().toDateString()
  ).length;
  const failedCount = records.filter((r) => r.status === "failed").length;

  const stats = [
    {
      label: "生成总数",
      value: totalVideos,
      icon: Video,
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-500/10",
      iconColor: "text-primary-400",
      change: "+12%",
    },
    {
      label: "成功率",
      value: `${successRate}%`,
      icon: CheckCircle2,
      color: "from-accent-green to-emerald-600",
      bgColor: "bg-accent-green/10",
      iconColor: "text-accent-green",
      change: "+3%",
    },
    {
      label: "待审核",
      value: pendingReview,
      icon: AlertTriangle,
      color: "from-accent-orange to-amber-600",
      bgColor: "bg-accent-orange/10",
      iconColor: "text-accent-orange",
      change: "需处理",
    },
    {
      label: "今日排期",
      value: todaySchedules,
      icon: Clock,
      color: "from-accent-cyan to-cyan-600",
      bgColor: "bg-accent-cyan/10",
      iconColor: "text-accent-cyan",
      change: "已就绪",
    },
  ];

  const quickActions = [
    { path: "/materials", label: "素材导入", icon: ImagePlus, color: "from-primary-500 to-purple-600" },
    { path: "/script", label: "脚本生成", icon: FileText, color: "from-accent-cyan to-cyan-600" },
    { path: "/templates", label: "选择模板", icon: Palette, color: "from-pink-500 to-rose-600" },
    { path: "/voice", label: "配音设置", icon: Mic, color: "from-accent-orange to-amber-600" },
    { path: "/editing", label: "自动剪辑", icon: Scissors, color: "from-accent-green to-emerald-600" },
    { path: "/preview", label: "预览编辑", icon: Play, color: "from-indigo-500 to-violet-600" },
    { path: "/schedule", label: "发布排期", icon: Calendar, color: "from-blue-500 to-cyan-600" },
    { path: "/records", label: "记录统计", icon: BarChart3, color: "from-fuchsia-500 to-pink-600" },
  ];

  const recentProjects = videoProjects.slice(0, 5);
  const recentRecords = records.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-accent-green/15 text-accent-green border-accent-green/30",
      generating: "bg-primary-500/15 text-primary-400 border-primary-500/30",
      failed: "bg-accent-red/15 text-accent-red border-accent-red/30",
      pending_review: "bg-accent-orange/15 text-accent-orange border-accent-orange/30",
      draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    };
    const labels: Record<string, string> = {
      completed: "已完成",
      generating: "生成中",
      failed: "失败",
      pending_review: "待审核",
      draft: "草稿",
    };
    return (
      <span className={`badge border ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-primary-400" />
            工作台
          </h1>
          <p className="text-gray-400">欢迎回来，快速开始创作您的下一个爆款短视频</p>
        </div>
        <button
          onClick={() => navigate("/templates")}
          className="btn-orange flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          开始创作
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card-hover p-5 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className="text-xs text-accent-green flex items-center gap-1">
                {stat.change}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-dark-700 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000`}
                style={{ width: `${typeof stat.value === "number" ? Math.min((stat.value / 50) * 100, 100) : stat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title mb-0">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              快捷操作
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="group p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/30 transition-all duration-300 hover:bg-dark-700/50 hover:-translate-y-0.5"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-white mb-0.5">{action.label}</p>
                <p className="text-xs text-gray-500">点击进入</p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-0">
            <Video className="w-5 h-5 text-primary-400" />
            生成趋势
          </h2>
          <div className="mt-6 space-y-3">
            {[
              { day: "周一", count: 8 },
              { day: "周二", count: 12 },
              { day: "周三", count: 6 },
              { day: "周四", count: 15 },
              { day: "周五", count: 10 },
              { day: "周六", count: 18 },
              { day: "周日", count: 14 },
            ].map((item) => (
              <div key={item.day} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8">{item.day}</span>
                <div className="flex-1 h-2 rounded-full bg-dark-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-cyan"
                    style={{ width: `${(item.count / 20) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-6 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title mb-0">
              <Video className="w-5 h-5 text-primary-400" />
              最近项目
            </h2>
            <button
              onClick={() => navigate("/preview")}
              className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/20 transition-all cursor-pointer group"
                onClick={() => navigate("/preview")}
              >
                {project.coverImage && (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{project.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(project.createdAt).toLocaleString("zh-CN")}
                  </p>
                </div>
                {getStatusBadge(project.status)}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title mb-0">
              <BarChart3 className="w-5 h-5 text-primary-400" />
              最近记录
            </h2>
            <button
              onClick={() => navigate("/records")}
              className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentRecords.map((record) => {
              const statusStyle: Record<string, string> = {
                success: "bg-accent-green text-accent-green",
                failed: "bg-accent-red text-accent-red",
                pending_review: "bg-accent-orange text-accent-orange",
              };
              const statusLabels: Record<string, string> = {
                success: "成功",
                failed: "失败",
                pending_review: "待审核",
              };
              return (
                <div
                  key={record.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/50 border border-white/5"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${statusStyle[record.status]?.split(" ")[0]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {record.videoTitle}
                    </p>
                    {record.errorMessage && (
                      <p className="text-xs text-accent-red mt-0.5 truncate">
                        {record.errorMessage}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${statusStyle[record.status]?.split(" ")[1]}`}
                  >
                    {statusLabels[record.status]}
                  </span>
                </div>
              );
            })}
          </div>
          {failedCount > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-accent-red/10 border border-accent-red/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-red" />
                <span className="text-sm text-accent-red font-medium">
                  有 {failedCount} 个生成失败项需要处理
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
