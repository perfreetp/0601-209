import { useState, useEffect, useRef } from "react";
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
  Check,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Package,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { Product } from "@/types";

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
  const { products, selectedTemplate, generateVideo, currentScript, voiceConfig } = useAppStore();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [selectedCoverImg, setSelectedCoverImg] = useState<string | null>(null);
  const [selectedTransition, setSelectedTransition] = useState("fade");
  const [selectedBgmId, setSelectedBgmId] = useState("pop");
  const [bgmVolume, setBgmVolume] = useState(50);
  const [autoCover, setAutoCover] = useState(true);
  const [expandedImages, setExpandedImages] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (products.length > 0 && selectedProductId === null) {
      const latest = products[products.length - 1];
      setSelectedProductId(latest.id);
    }
  }, [products, selectedProductId]);

  const activeProduct: Product | undefined = products.find(
    (p) => p.id === selectedProductId
  );

  useEffect(() => {
    if (!activeProduct) return;
    if (prevIdRef.current === activeProduct.id) return;
    prevIdRef.current = activeProduct.id;

    const imgs = activeProduct.images || [];
    setImageList([...imgs]);
    setSelectedCoverImg(imgs.length > 0 ? imgs[0] : null);
  }, [activeProduct?.id]);

  useEffect(() => {
    if (selectedCoverImg && !imageList.includes(selectedCoverImg)) {
      setSelectedCoverImg(imageList.length > 0 ? imageList[0] : null);
    }
    if (!selectedCoverImg && imageList.length > 0) {
      setSelectedCoverImg(imageList[0]);
    }
  }, [imageList]);

  const selectedBgm = bgmList.find((b) => b.id === selectedBgmId) || bgmList[0];
  const selectedTransitionLabel = transitions.find((t) => t.id === selectedTransition)?.label || "淡入淡出";
  const hasImages = imageList.length > 0;
  const canGenerate = hasImages && !!activeProduct && !!selectedTemplate && !!currentScript;

  const getImageCoverIndex = (img: string) => imageList.indexOf(img);

  const moveImage = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === imageList.length - 1) return;
    const newList = [...imageList];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
    setImageList(newList);
  };

  const removeImage = (index: number) => {
    const target = imageList[index];
    const newList = imageList.filter((_, i) => i !== index);
    setImageList(newList);
    if (target === selectedCoverImg) {
      setSelectedCoverImg(newList.length > 0 ? newList[0] : null);
    }
  };

  const handleGenerateVideo = () => {
    if (!canGenerate || !activeProduct || !selectedTemplate) return;
    setIsGenerating(true);
    setGenerateSuccess(false);

    generateVideo(activeProduct.id, selectedTemplate.id, {
      imageOrder: imageList,
      transition: selectedTransitionLabel,
      backgroundMusic: selectedBgm.label,
      coverImage: selectedCoverImg || undefined,
    });

    setTimeout(() => {
      setIsGenerating(false);
      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);
    }, 2200);
  };

  if (!activeProduct && products.length === 0) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Scissors className="w-7 h-7 text-primary-400" />
            自动剪辑
          </h1>
          <p className="text-gray-400">调整图片顺序、转场特效和背景音乐</p>
        </div>
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <Package className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg mb-2">暂无商品</p>
          <p className="text-gray-500 text-sm">请先在「素材导入」页面添加商品</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Scissors className="w-7 h-7 text-primary-400" />
              自动剪辑
            </h1>
            <p className="text-gray-400">调整图片顺序、转场特效和背景音乐</p>
          </div>
          <div className="relative">
            <select
              value={selectedProductId || ""}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                prevIdRef.current = null;
              }}
              className="input-field pl-10 pr-10 appearance-none cursor-pointer min-w-[220px]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({(p.images || []).length}张图)
                </option>
              ))}
            </select>
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          {generateSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-green/15 border border-accent-green/30 text-accent-green text-sm animate-slide-up">
              <Check className="w-4 h-4" />
              生成成功！可在预览编辑查看
            </div>
          )}
          <button className="btn-secondary flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            智能排序
          </button>
          <button
            onClick={handleGenerateVideo}
            disabled={isGenerating || !canGenerate}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {!hasImages ? "请先添加图片" : "生成视频"}
              </>
            )}
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
                  ({imageList.length}张图片)
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
                {hasImages ? (
                  <div className="flex gap-3 overflow-x-auto pb-4">
                    {imageList.map((img, index) => {
                      const isCover = img === selectedCoverImg;
                      return (
                        <div
                          key={index}
                          className="group relative flex-shrink-0"
                        >
                          <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-primary text-white text-sm font-bold flex items-center justify-center shadow-glow z-10">
                            {index + 1}
                          </div>
                          <div className={`w-40 h-28 rounded-xl overflow-hidden border-2 transition-all relative ${
                            isCover
                              ? "border-accent-orange ring-2 ring-accent-orange/30"
                              : "border-primary-500/30 hover:border-primary-500"
                          }`}>
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveImage(index, "up");
                                }}
                                disabled={index === 0}
                                className="w-8 h-8 rounded-lg bg-dark-800/80 flex items-center justify-center hover:bg-dark-700 disabled:opacity-40"
                                title="上移"
                              >
                                <ArrowUp className="w-4 h-4 text-white" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCoverImg(img);
                                }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  isCover
                                    ? "bg-accent-orange"
                                    : "bg-dark-800/80 hover:bg-accent-orange/80"
                                }`}
                                title="设为封面"
                              >
                                <Crop className="w-4 h-4 text-white" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveImage(index, "down");
                                }}
                                disabled={index === imageList.length - 1}
                                className="w-8 h-8 rounded-lg bg-dark-800/80 flex items-center justify-center hover:bg-dark-700 disabled:opacity-40"
                                title="下移"
                              >
                                <ArrowDown className="w-4 h-4 text-white" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(index);
                                }}
                                className="w-8 h-8 rounded-lg bg-accent-red/80 flex items-center justify-center hover:bg-accent-red"
                                title="删除"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            {isCover && (
                              <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-accent-orange text-[10px] text-white font-medium">
                                封面
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-center mt-2 text-gray-500">
                            <GripVertical className="w-4 h-4" />
                            <span className="text-xs">上下按钮排序</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-white/20 bg-dark-800/30 p-8 mb-4 text-center">
                    <ImageIcon className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">当前商品无图片</p>
                    <p className="text-gray-600 text-xs mt-1">请在「素材导入」页面为该商品添加图片</p>
                  </div>
                )}

                <div className="mt-4 p-4 rounded-xl bg-dark-800/50 border border-white/5">
                  <p className="text-sm text-gray-400 mb-3">时间轴预览</p>
                  {hasImages ? (
                    <>
                      <div className="flex gap-1 h-16">
                        {imageList.map((img, index) => {
                          const isCover = img === selectedCoverImg;
                          return (
                            <div
                              key={index}
                              className="flex-1 rounded-lg overflow-hidden relative group"
                            >
                              <img
                                src={img}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-dark-950/80 text-xs text-white">
                                {index * 3}s
                              </div>
                              {index < imageList.length - 1 && (
                                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-dark-950/60 flex items-center justify-center">
                                  <span className="text-xs text-primary-400">→</span>
                                </div>
                              )}
                              {isCover && (
                                <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-accent-orange text-[9px] text-white">
                                  封面
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>0s</span>
                        <span>{imageList.length * 3}s</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-16 flex items-center justify-center text-gray-500 text-sm">
                      暂无图片
                    </div>
                  )}
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
                  onClick={() => setSelectedBgmId(bgm.id)}
                  className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                    selectedBgmId === bgm.id
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-white/10 bg-dark-800/50 hover:border-primary-500/30"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedBgmId === bgm.id
                        ? "bg-gradient-primary"
                        : "bg-dark-700"
                    }`}
                  >
                    <Music2 className={`w-5 h-5 ${selectedBgmId === bgm.id ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{bgm.label}</p>
                    <p className="text-xs text-gray-500">{bgm.mood}</p>
                  </div>
                  <span className="text-sm text-gray-500">{bgm.duration}</span>
                  <button
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      selectedBgmId === bgm.id
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

              <div className="aspect-[9/16] rounded-xl overflow-hidden border-2 border-primary-500/30 bg-dark-800 relative">
                {selectedCoverImg ? (
                  <img
                    src={selectedCoverImg}
                    alt="封面预览"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <Crop className="w-8 h-8 mb-2" />
                    <p className="text-sm">暂无封面图片</p>
                    <p className="text-xs text-gray-600 mt-1">请先在素材导入添加图片</p>
                  </div>
                )}
                {selectedCoverImg && (
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                    <div className="space-y-2">
                      <span className="badge bg-accent-orange/90 text-white border-0 w-fit">
                        {activeProduct?.discount || "热卖推荐"}
                      </span>
                      <p className="text-white font-display text-xl font-bold leading-tight">
                        {activeProduct?.name}
                      </p>
                      <p className="text-2xl font-bold text-accent-orange">
                        ¥{activeProduct?.price || 0}
                        {activeProduct?.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2 font-normal">
                            ¥{activeProduct.originalPrice}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {hasImages && (
                <div className="grid grid-cols-4 gap-2">
                  {imageList.map((img, i) => {
                    const isCover = img === selectedCoverImg;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedCoverImg(img)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                          isCover
                            ? "border-accent-orange ring-2 ring-accent-orange/30"
                            : "border-white/10 hover:border-primary-500/50"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {isCover && (
                          <div className="absolute inset-0 bg-accent-orange/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-accent-orange" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5">
                <p className="text-xs text-gray-500 mb-2">当前配置</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">商品</span>
                    <span className="text-sm text-white truncate max-w-[160px]">{activeProduct?.name}</span>
                  </div>
                  {selectedTemplate && (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${selectedTemplate.primaryColor}, ${selectedTemplate.secondaryColor})` }}
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">模板</p>
                        <p className="text-sm text-white">{selectedTemplate.name}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">转场特效</span>
                    <span className="text-sm text-white">{selectedTransitionLabel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">背景音乐</span>
                    <span className="text-sm text-white">{selectedBgm.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">图片数量</span>
                    <span className="text-sm text-white">{imageList.length}张</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">配音</span>
                    <span className="text-sm text-white">{voiceConfig.gender === "female" ? "女声" : "男声"} · {voiceConfig.tone}</span>
                  </div>
                  {selectedCoverImg && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">封面</span>
                      <span className="text-sm text-white">第{getImageCoverIndex(selectedCoverImg) + 1}张</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editing;
