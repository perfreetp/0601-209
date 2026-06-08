import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Eye,
  Check,
  X,
  Clock,
  Download,
  Filter,
  PieChart,
  Activity,
  Calendar,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

type TabType = "stats" | "failed" | "review";

const Records = () => {
  const { records, updateRecordStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>("stats");

  const successCount = records.filter((r) => r.status === "success").length;
  const failedCount = records.filter((r) => r.status === "failed").length;
  const pendingReviewCount = records.filter((r) => r.status === "pending_review").length;
  const totalCount = records.length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  const weeklyData = [
    { day: "周一", success: 8, failed: 1 },
    { day: "周二", success: 12, failed: 0 },
    { day: "周三", success: 6, failed: 2 },
    { day: "周四", success: 15, failed: 1 },
    { day: "周五", success: 10, failed: 0 },
    { day: "周六", success: 18, failed: 3 },
    { day: "周日", success: 14, failed: 1 },
  ];

  const maxValue = Math.max(...weeklyData.map((d) => d.success + d.failed));

  const failedReasons = [
    { reason: "图片素材加载超时", count: 3, percent: 50 },
    { reason: "配音服务连接失败", count: 1, percent: 16.7 },
    { reason: "存储空间不足", count: 1, percent: 16.7 },
    { reason: "模板渲染异常", count: 1, percent: 16.7 },
  ];

  const platformData = [
    { name: "抖音", value: 45, color: "#000000" },
    { name: "视频号", value: 28, color: "#10b981" },
    { name: "快手", value: 18, color: "#f97316" },
    { name: "小红书", value: 9, color: "#ef4444" },
  ];

  const tabs = [
    { id: "stats" as TabType, label: "数据统计", icon: BarChart3 },
    { id: "failed" as TabType, label: "失败记录", icon: XCircle, count: failedCount },
    { id: "review" as TabType, label: "待审核", icon: Eye, count: pendingReviewCount },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary-400" />
            记录统计
          </h1>
          <p className="text-gray-400">查看视频生成记录、失败原因和待审核内容</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            筛选
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="glass-card-hover p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-400" />
            </div>
            <span className="text-xs text-accent-green flex items-center gap-1">
              +12.5%
              <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <p className="text-3xl font-display font-bold text-white">{totalCount}</p>
          <p className="text-sm text-gray-500 mt-1">生成总数</p>
        </div>
        <div className="glass-card-hover p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-accent-green/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-accent-green" />
            </div>
            <span className="text-xs text-accent-green flex items-center gap-1">
              +3.2%
              <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <p className="text-3xl font-display font-bold text-accent-green">{successRate}%</p>
          <p className="text-sm text-gray-500 mt-1">成功率</p>
        </div>
        <div className="glass-card-hover p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-accent-red/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-accent-red" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-accent-red">{failedCount}</p>
          <p className="text-sm text-gray-500 mt-1">失败次数</p>
        </div>
        <div className="glass-card-hover p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-accent-orange/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-orange" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-accent-orange">
            {pendingReviewCount}
          </p>
          <p className="text-sm text-gray-500 mt-1">待审核</p>
        </div>
      </div>

      <div className="flex rounded-xl bg-dark-800 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? "bg-primary-500 text-white shadow-glow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-accent-red/20 text-accent-red"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "stats" && (
        <div className="grid grid-cols-12 gap-6 animate-slide-up">
          <div className="col-span-8 glass-card p-6">
            <h2 className="section-title">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              生成趋势（近7天）
            </h2>
            <div className="mt-6 h-64 flex items-end justify-between gap-3">
              {weeklyData.map((data) => {
                const total = data.success + data.failed;
                const successHeight = (data.success / maxValue) * 100;
                const failedHeight = (data.failed / maxValue) * 100;
                return (
                  <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end h-52 gap-0.5">
                      {data.failed > 0 && (
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-accent-red to-red-400 transition-all"
                          style={{ height: `${failedHeight}%` }}
                          title={`失败 ${data.failed}`}
                        />
                      )}
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-primary-500 to-accent-cyan transition-all"
                        style={{ height: `${successHeight}%` }}
                        title={`成功 ${data.success}`}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{data.day}</span>
                    <span className="text-xs text-gray-500">{total}条</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-primary-500 to-accent-cyan" />
                <span className="text-sm text-gray-400">成功</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gradient-to-r from-accent-red to-red-400" />
                <span className="text-sm text-gray-400">失败</span>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="glass-card p-6">
              <h2 className="section-title">
                <PieChart className="w-5 h-5 text-primary-400" />
                平台分布
              </h2>
              <div className="mt-4 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {(() => {
                      let cumulativePercent = 0;
                      const colors = ["#8b5cf6", "#10b981", "#f97316", "#ef4444"];
                      return platformData.map((item, i) => {
                        const startPercent = cumulativePercent;
                        cumulativePercent += item.value;
                        return (
                          <circle
                            key={item.name}
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            stroke={colors[i]}
                            strokeWidth="3"
                            strokeDasharray={`${item.value} ${100 - item.value}`}
                            strokeDashoffset={-startPercent}
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-display font-bold text-white">
                        {platformData.reduce((a, b) => a + b.value, 0)}
                      </p>
                      <p className="text-xs text-gray-500">总发布</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {platformData.map((item, i) => {
                  const colors = ["#8b5cf6", "#10b981", "#f97316", "#ef4444"];
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: colors[i] }}
                        />
                        {item.name}
                      </span>
                      <span className="text-sm font-medium text-white">{item.value}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="section-title">
                <AlertTriangle className="w-5 h-5 text-primary-400" />
                失败原因分析
              </h2>
              <div className="space-y-3 mt-4">
                {failedReasons.map((item) => (
                  <div key={item.reason}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{item.reason}</span>
                      <span className="text-sm text-accent-red font-medium">{item.count}次</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-dark-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent-red to-orange-400"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "failed" && (
        <div className="glass-card p-6 animate-slide-up">
          <h2 className="section-title">
            <XCircle className="w-5 h-5 text-accent-red" />
            失败记录
            <span className="badge bg-accent-red/15 text-accent-red border border-accent-red/30 ml-2">
              {failedCount} 条
            </span>
          </h2>
          <div className="space-y-3 mt-4">
            {records
              .filter((r) => r.status === "failed")
              .map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-xl bg-dark-800/50 border border-accent-red/20 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-accent-red/10 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 text-accent-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{record.videoTitle}</p>
                    <p className="text-sm text-accent-red mt-0.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {record.errorMessage}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(record.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary flex items-center gap-1.5 text-sm py-2 px-3">
                      <RefreshCw className="w-4 h-4" />
                      重试
                    </button>
                    <button className="btn-secondary text-sm py-2 px-3">详情</button>
                  </div>
                </div>
              ))}
            {failedCount === 0 && (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-accent-green mx-auto mb-3" />
                <p className="text-gray-400">暂无失败记录，一切运行正常！</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "review" && (
        <div className="glass-card p-6 animate-slide-up">
          <h2 className="section-title">
            <Eye className="w-5 h-5 text-accent-orange" />
            待人工审核
            <span className="badge bg-accent-orange/15 text-accent-orange border border-accent-orange/30 ml-2">
              {pendingReviewCount} 条
            </span>
          </h2>
          <div className="space-y-4 mt-4">
            {records
              .filter((r) => r.status === "pending_review")
              .map((record) => {
                const project = useAppStore
                  .getState()
                  .videoProjects.find((p) => p.id === record.videoProjectId);
                return (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl bg-dark-800/50 border border-white/10"
                  >
                    <div className="flex gap-4">
                      {project?.coverImage && (
                        <img
                          src={project.coverImage}
                          alt=""
                          className="w-28 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white font-medium">{record.videoTitle}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(record.createdAt).toLocaleString("zh-CN")}
                            </p>
                          </div>
                          <span className="badge bg-accent-orange/15 text-accent-orange border border-accent-orange/30">
                            待审核
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => updateRecordStatus(record.id, "success")}
                            className="px-4 py-2 rounded-lg bg-accent-green/20 text-accent-green text-sm font-medium hover:bg-accent-green/30 transition-all flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            通过
                          </button>
                          <button
                            onClick={() => updateRecordStatus(record.id, "failed")}
                            className="px-4 py-2 rounded-lg bg-accent-red/20 text-accent-red text-sm font-medium hover:bg-accent-red/30 transition-all flex items-center gap-1.5"
                          >
                            <X className="w-4 h-4" />
                            驳回
                          </button>
                          <button className="btn-secondary text-sm py-2 px-3 flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            预览
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {pendingReviewCount === 0 && (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-accent-green mx-auto mb-3" />
                <p className="text-gray-400">暂无待审核内容，干得漂亮！</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
