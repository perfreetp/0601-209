import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ImagePlus,
  FileText,
  Palette,
  Mic,
  Scissors,
  Play,
  Calendar,
  BarChart3,
  Sparkles,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { path: "/materials", label: "素材导入", icon: ImagePlus },
  { path: "/script", label: "脚本生成", icon: FileText },
  { path: "/templates", label: "模板选择", icon: Palette },
  { path: "/voice", label: "配音设置", icon: Mic },
  { path: "/editing", label: "自动剪辑", icon: Scissors },
  { path: "/preview", label: "预览编辑", icon: Play },
  { path: "/schedule", label: "发布排期", icon: Calendar },
  { path: "/records", label: "记录统计", icon: BarChart3 },
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-dark-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">
              <span className="gradient-text">ClipFlow</span>
            </h1>
            <p className="text-xs text-gray-500">短视频自动化工具</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-sm font-bold text-white">
              味
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">味道小馆</p>
              <p className="text-xs text-gray-500">专业版会员</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
