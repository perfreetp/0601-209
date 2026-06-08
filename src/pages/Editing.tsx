import { useState } from "react";
import {
  Scissors,
  Image as ImageIcon,
  ArrowLeftRight,
  Music2,
  Crop,
  GripVertical,
  Play,
  Trash2,
  Plus,
  Volume2,
  Wand2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const transitions = [
  { id: "fade", label: "淡入淡出", preview: "渐变过渡" },
  { id: "slide", label: "滑动切换", preview: "左右滑动" },
  { id: "zoom", label: "缩放推进", preview: "放大特写" },
  { id: "rotate", label: "旋转切换", preview: "动感旋转" },
  { id: "wipe", label: "擦除过渡", preview: "百叶窗" },
  { id: "flip", label: "翻转切换", preview: "3D翻转" },
];

const bgmList = [
  { id: "pop", label: "欢快流行", duration: "2:45", mood: "轻松愉悦" },
  { id: "electronic", label: "动感电子", duration: "3:12", mood: "活力十足" },
  { id: "summer", label: "清新夏日", duration: "2:58", mood: "清爽治愈" },
  { id: "warm", label: "温馨治愈", duration: "3:30", mood: "温暖舒适" },
  { id: "energetic", label: "激情澎湃", duration: "2:30", mood: "热血沸腾" },
  { id: "lofi", label: "慵懒Lo-fi", duration: "4:15", mood: "放松惬意" },
];

const Editing = () => {
  const { products, selectedTemplate } = useAppStore();
  const [activeProduct] = products;
  const [selectedTransition, setSelectedTransition] = useState("fade");
  const [selectedBgm, setSelectedBgm] = useState("pop");
  const [bgmVolume, setBgmVolume] = useState(50);
  const [autoCover, setAutoCover] = useState(true);
  const [expandedImages, setExpandedImages] = useState(true);

  if (!activeProduct) return null;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Scissors className="w-7 h-7 text-primary-400" />
            自动剪辑
          </h1>
          <p className="text-gray-400">调整图片顺序、转场特效和背景音乐</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            智能排序
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Play className="w-4 h-4" />
            生成视频
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => setExpandedImages(!expandedImages)}
            >
              <h2 className="section-title mb-0">
                <ImageIcon className="w-5 h-5 text-primary-400" />
                图片排序
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({activeProduct.images.length}张图片)
                </span>
              </h2>
              {expandedImages ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedImages && (
              <>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {activeProduct.images.map((img, index) => (
                    <div
                      key={index}
                      className="group relative flex-shrink-0 cursor-move"
                    >
                      <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-primary text-white text-sm font-bold flex items-center justify-center shadow-glow z-10">
                        {index + 1}
                      </div>
                      <div className="w-40 h-28 rounded-xl overflow-hidden border-2 border-primary-500/30 hover:border-primary-500 transition-all relative">
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button className="w-8 h-8 rounded-lg bg-dark-800/80 flex items-center justify-center hover:bg-dark-700">
                            <ArrowLeftRight className="w-4 h-4 text-white" />
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-accent-red/80 flex items-center justify-center hover:bg-accent-red">
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-center mt-2 text-gray-500">
                        <GripVertical className="w-4 h-4" />
                        <span className="text-xs">拖拽排序</span>
                      </div>
                    </div>
                  ))}
                  <button className="flex-shrink-0 w-40 h-28 rounded-xl border-2 border-dashed border-white/20 hover:border-primary-500/50 flex flex-col items-center justify-center text-gray-500 hover:text-primary-400 transition-all">
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs">添加图片</span>
                  </button>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-dark-800/50 border border-white/5">
                  <p className="text-sm text-gray-400 mb-3">时间轴预览</p>
                  <div className="flex gap-1 h-16">
                    {activeProduct.images.map((img, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-lg overflow-hidden relative group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-dark-950/80 text-xs text-white">
                          {index * 3}s
                        </div>
                        {index < activeProduct.images.length - 1 && (
                          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-dark-950/60 flex items-center justify-center">
                            <span className="text-xs text-primary-400">→</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0s</span>
                    <span>{activeProduct.images.length * 3}s</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="glass-card p-6">
            <h2 className="section-title">
              <ArrowLeftRight className="w-5 h-5 text-primary-400" />
              转场特效
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {transitions.map((transition) => (
                <button
                  key={transition.id}
                  onClick={() => setSelectedTransition(transition.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedTransition === transition.id
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-white/10 bg-dark-800/50 hover:border-primary-500/30"
                  }`}
                >
                  <div className="w-full h-12 rounded-lg bg-gradient-to-r from-primary-500/30 via-accent-cyan/30 to-primary-500/30 mb-3 flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-primary-300" />
                  </div>
                  <p className="text-white font-medium">{transition.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{transition.preview}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="section-title">
              <Music2 className="w-5 h-5 text-primary-400" />
              背景音乐
            </h2>
            <div className="space-y-3 mb-5">
              {bgmList.map((bgm) => (
                <button
                  key={bgm.id}
                  onClick={() => setSelectedBgm(bgm.id)}
                  className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                    selectedBgm === bgm.id
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-white/10 bg-dark-800/50 hover:border-primary-500/30"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedBgm === bgm.id
                        ? "bg-gradient-primary"
                        : "bg-dark-700"
                    }`}
                  >
                    <Music2 className={`w-5 h-5 ${selectedBgm === bgm.id ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{bgm.label}</p>
                    <p className="text-xs text-gray-500">{bgm.mood}</p>
                  </div>
                  <span className="text-sm text-gray-500">{bgm.duration}</span>
                  <button
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      selectedBgm === bgm.id
                        ? "bg-primary-500 text-white"
                        : "bg-dark-700 text-gray-400"
                    }`}
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </button>
                </button>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" />
                  背景音乐音量
                </label>
                <span className="text-sm text-primary-400 font-medium">{bgmVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVolume}
                onChange={(e) => setBgmVolume(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="section-title">
              <Crop className="w-5 h-5 text-primary-400" />
              封面设置
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50 border border-white/5">
                <span className="text-sm text-white">自动生成封面</span>
                <button
                  onClick={() => setAutoCover(!autoCover)}
                  className={`relative w-12 h-7 rounded-full transition-all ${
                    autoCover ? "bg-primary-500" : "bg-dark-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                      autoCover ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="aspect-[9/16] rounded-xl overflow-hidden border-2 border-primary-500/30 bg-dark-800">
                {activeProduct.images[0] && (
                  <img
                    src={activeProduct.images[0]}
                    alt="封面预览"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                  <div className="space-y-2">
                    <span className="badge bg-accent-orange/90 text-white border-0 w-fit">
                      {activeProduct.discount || "热卖推荐"}
                    </span>
                    <p className="text-white font-display text-xl font-bold leading-tight">
                      {activeProduct.name}
                    </p>
                    <p className="text-2xl font-bold text-accent-orange">
                      ¥{activeProduct.price}
                      {activeProduct.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2 font-normal">
                          ¥{activeProduct.originalPrice}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {activeProduct.images.map((img, i) => (
                  <button
                    key={i}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      i === 0 ? "border-primary-500" : "border-white/10 hover:border-primary-500/50"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                <button className="aspect-square rounded-lg border-2 border-dashed border-white/20 hover:border-primary-500/50 flex flex-col items-center justify-center text-gray-500 hover:text-primary-400 transition-all">
                  <Plus className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">上传</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                <p className="text-xs text-gray-500 mb-2">模板信息</p>
                {selectedTemplate && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg"
                      style={{ background: `linear-gradient(135deg, ${selectedTemplate.primaryColor}, ${selectedTemplate.secondaryColor})` }}
                    />
                    <div>
                      <p className="text-white font-medium">{selectedTemplate.name}</p>
                      <p className="text-xs text-gray-500">{selectedTemplate.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editing;
