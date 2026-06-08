import { Bell, Search, Settings, Zap } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const Header = () => {
  const { records, videoProjects } = useAppStore();
  const pendingCount = records.filter((r) => r.needsReview).length;
  const generatingCount = videoProjects.filter(
    (p) => p.status === "generating"
  ).length;

  return (
    <header className="h-16 bg-dark-950/60 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="搜索项目、商品..."
            className="input-field pl-10 pr-4 py-2 w-80 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {generatingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
            <Zap className="w-4 h-4 text-primary-400 animate-pulse" />
            <span className="text-sm text-primary-300">
              {generatingCount} 个生成中
            </span>
          </div>
        )}

        <button className="relative w-10 h-10 rounded-xl bg-dark-800/80 border border-white/10 flex items-center justify-center transition-all hover:border-primary-500/30 hover:bg-dark-700">
          <Bell className="w-5 h-5 text-gray-400" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-orange rounded-full text-xs text-white flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button className="w-10 h-10 rounded-xl bg-dark-800/80 border border-white/10 flex items-center justify-center transition-all hover:border-primary-500/30 hover:bg-dark-700">
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;
