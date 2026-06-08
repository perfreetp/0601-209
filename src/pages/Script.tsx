import { useState } from "react";
import {
  FileText,
  Sparkles,
  Type,
  Target,
  ArrowRight,
  Clock,
  RefreshCw,
  Edit3,
  Check,
  X,
  MessageSquare,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const openingTemplates = [
  "朋友们注意啦！今天给大家带来一道超绝美食！",
  "天哪！这家店的招牌菜居然这么好吃！",
  "本地人都在排队的宝藏小店，今天终于来打卡了！",
  "干饭人集合！今天安利一家我私藏的宝藏餐厅！",
  "一口惊艳！这味道我能连吃三天！",
];

const sellingPointTemplates = [
  "精选上等食材，每日新鲜直送",
  "独家秘制配方，口感层次丰富",
  "开业限时特惠，错过再等一年",
  "老师傅匠心手作，传承二十年味道",
  "分量十足性价比超高，朋友聚会首选",
  "零添加健康烹饪，老人小孩都爱吃",
];

const ctaTemplates = [
  "点击左下角链接立即抢购，手慢无！",
  "评论区扣1获取专属优惠，到店出示即可使用！",
  "关注收藏不迷路，到店报暗号有惊喜！",
  "转发给你的饭搭子，约起来！",
  "限时福利，先到先得，马上冲！",
];

const Script = () => {
  const { currentScript, updateScript, products, store } = useAppStore();
  const [editingOpening, setEditingOpening] = useState(false);
  const [editingSellingPoint, setEditingSellingPoint] = useState<number | null>(null);
  const [editingCta, setEditingCta] = useState(false);
  const [sellPointInput, setSellPointInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const activeProduct = products[0];

  const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const generateSubtitles = (opening: string, sellingPoints: string[], cta: string) => {
    const subs: { timestamp: number; text: string }[] = [];
    let timestamp = 0;

    const openingChars = opening.length;
    if (openingChars > 0) {
      const chunkSize = 15;
      for (let i = 0; i < opening.length; i += chunkSize) {
        subs.push({ timestamp, text: opening.slice(i, i + chunkSize) });
        timestamp += 2;
      }
    }

    sellingPoints.forEach((point) => {
      const chunkSize = 12;
      for (let i = 0; i < point.length; i += chunkSize) {
        subs.push({ timestamp, text: point.slice(i, i + chunkSize) });
        timestamp += 2;
      }
    });

    if (cta.length > 0) {
      const chunkSize = 15;
      for (let i = 0; i < cta.length; i += chunkSize) {
        subs.push({ timestamp, text: cta.slice(i, i + chunkSize) });
        timestamp += 2;
      }
    }

    return subs;
  };

  const syncSubtitles = (opening: string, sellingPoints: string[], cta: string) => {
    updateScript({ subtitles: generateSubtitles(opening, sellingPoints, cta) });
  };

  const generateAIScript = () => {
    if (!currentScript) return;
    setIsGenerating(true);

    setTimeout(() => {
      const productName = activeProduct?.name || "招牌商品";
      const storeName = store?.name || "我们的店铺";
      const price = activeProduct?.price ? `仅需¥${activeProduct.price}` : "";
      const discount = activeProduct?.discount || "";

      const openingOptions = [
        `朋友们注意啦！今天${storeName}给大家带来${productName}！`,
        `天哪！${storeName}的${productName}居然这么好吃！${price}！`,
        `本地人都在排队的宝藏小店${storeName}，今天终于来打卡${productName}了！`,
        `干饭人集合！今天安利${storeName}的${productName}！${discount ? discount + "！" : ""}`,
        `一口惊艳！${storeName}的${productName}这味道我能连吃三天！${price}！`,
      ];

      const baseSellingPoints = [
        `精选上等食材，每日新鲜直送，${productName}品质保证`,
        `独家秘制配方，口感层次丰富，${storeName}匠心出品`,
        `${discount || "开业限时特惠"}，错过再等一年！${price}`,
        `老师傅匠心手作，传承二十年味道，${productName}正宗地道`,
        `分量十足性价比超高，朋友聚会首选${storeName}`,
        `零添加健康烹饪，老人小孩都爱吃的${productName}`,
      ];

      const shuffledPoints = [...baseSellingPoints].sort(() => Math.random() - 0.5);
      const selectedPoints = shuffledPoints.slice(0, 3);

      const ctaOptions = [
        `点击左下角链接立即抢购${productName}，手慢无！`,
        `评论区扣1获取${storeName}专属优惠，到店出示即可使用！`,
        `关注收藏不迷路，到店报暗号有惊喜！${storeName}等你！`,
        `转发给你的饭搭子，约起来去${storeName}吃${productName}！`,
        `限时福利${price}，先到先得，${storeName}马上冲！`,
      ];

      const opening = randomPick(openingOptions);
      const cta = randomPick(ctaOptions);
      const subtitles = generateSubtitles(opening, selectedPoints, cta);

      updateScript({
        opening,
        sellingPoints: selectedPoints,
        callToAction: cta,
        subtitles,
      });

      setIsGenerating(false);
    }, 800);
  };

  const regenerateOpening = () => {
    if (!currentScript) return;
    const newOpening = randomPick(openingTemplates);
    updateScript({ opening: newOpening });
    syncSubtitles(newOpening, currentScript.sellingPoints, currentScript.callToAction);
  };

  const regenerateSellingPoint = (index: number) => {
    if (!currentScript) return;
    const newPoints = [...currentScript.sellingPoints];
    const available = sellingPointTemplates.filter((p) => !newPoints.includes(p));
    newPoints[index] = available.length > 0 ? randomPick(available) : randomPick(sellingPointTemplates);
    updateScript({ sellingPoints: newPoints });
    syncSubtitles(currentScript.opening, newPoints, currentScript.callToAction);
  };

  const regenerateCta = () => {
    if (!currentScript) return;
    const newCta = randomPick(ctaTemplates);
    updateScript({ callToAction: newCta });
    syncSubtitles(currentScript.opening, currentScript.sellingPoints, newCta);
  };

  const addSellingPoint = () => {
    if (!currentScript || !sellPointInput.trim()) return;
    const newPoints = [...currentScript.sellingPoints, sellPointInput.trim()];
    updateScript({ sellingPoints: newPoints });
    syncSubtitles(currentScript.opening, newPoints, currentScript.callToAction);
    setSellPointInput("");
  };

  const removeSellingPoint = (index: number) => {
    if (!currentScript) return;
    const newPoints = currentScript.sellingPoints.filter((_, i) => i !== index);
    updateScript({ sellingPoints: newPoints });
    syncSubtitles(currentScript.opening, newPoints, currentScript.callToAction);
  };

  const updateSellingPoint = (index: number, value: string) => {
    if (!currentScript) return;
    const newPoints = [...currentScript.sellingPoints];
    newPoints[index] = value;
    updateScript({ sellingPoints: newPoints });
    syncSubtitles(currentScript.opening, newPoints, currentScript.callToAction);
    setEditingSellingPoint(null);
  };

  if (!currentScript) return null;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary-400" />
            脚本生成
          </h1>
          <p className="text-gray-400">AI智能生成开场、卖点和引导文案，一键生成字幕</p>
        </div>
        <button
          onClick={generateAIScript}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2 disabled:opacity-60"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "生成中..." : "一键AI生成"}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">
                <Type className="w-5 h-5 text-primary-400" />
                开场文案
              </h2>
              <button
                onClick={regenerateOpening}
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                换一条
              </button>
            </div>
            {editingOpening ? (
              <div className="flex gap-2">
                <textarea
                  defaultValue={currentScript.opening}
                  className="input-field flex-1 min-h-[80px] resize-none"
                  autoFocus
                  onBlur={(e) => {
                    const newOpening = e.target.value;
                    updateScript({ opening: newOpening });
                    syncSubtitles(newOpening, currentScript.sellingPoints, currentScript.callToAction);
                    setEditingOpening(false);
                  }}
                />
              </div>
            ) : (
              <div
                onClick={() => setEditingOpening(true)}
                className="p-5 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-cyan/10 border border-primary-500/20 cursor-pointer hover:border-primary-500/40 transition-all group"
              >
                <p className="text-lg text-white leading-relaxed">{currentScript.opening}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-gray-500">
                    {currentScript.opening.length} 字 · 约 {(currentScript.opening.length / 4).toFixed(1)} 秒
                  </span>
                  <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">
                <Target className="w-5 h-5 text-primary-400" />
                核心卖点
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({currentScript.sellingPoints.length}条)
                </span>
              </h2>
            </div>
            <div className="space-y-3">
              {currentScript.sellingPoints.map((point, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-cyan text-white text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    {editingSellingPoint === index ? (
                      <input
                        defaultValue={point}
                        className="input-field flex-1 text-sm"
                        autoFocus
                        onBlur={(e) => updateSellingPoint(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") updateSellingPoint(index, (e.target as HTMLInputElement).value);
                        }}
                      />
                    ) : (
                      <p
                        className="flex-1 text-white pt-1 cursor-pointer"
                        onClick={() => setEditingSellingPoint(index)}
                      >
                        {point}
                      </p>
                    )}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => regenerateSellingPoint(index)}
                        className="w-8 h-8 rounded-lg bg-dark-700 hover:bg-primary-500/20 flex items-center justify-center transition-all"
                        title="换一条"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button
                        onClick={() => removeSellingPoint(index)}
                        className="w-8 h-8 rounded-lg bg-dark-700 hover:bg-accent-red/20 flex items-center justify-center transition-all"
                        title="删除"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sellPointInput}
                  onChange={(e) => setSellPointInput(e.target.value)}
                  className="input-field flex-1 text-sm"
                  placeholder="自定义添加卖点..."
                  onKeyDown={(e) => e.key === "Enter" && addSellingPoint()}
                />
                <button onClick={addSellingPoint} className="btn-primary text-sm flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  添加
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">
                <ArrowRight className="w-5 h-5 text-primary-400" />
                行动引导
              </h2>
              <button
                onClick={regenerateCta}
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                换一条
              </button>
            </div>
            {editingCta ? (
              <textarea
                defaultValue={currentScript.callToAction}
                className="input-field w-full min-h-[80px] resize-none"
                autoFocus
                onBlur={(e) => {
                  const newCta = e.target.value;
                  updateScript({ callToAction: newCta });
                  syncSubtitles(currentScript.opening, currentScript.sellingPoints, newCta);
                  setEditingCta(false);
                }}
              />
            ) : (
              <div
                onClick={() => setEditingCta(true)}
                className="p-5 rounded-xl bg-gradient-to-r from-accent-orange/10 to-amber-500/10 border border-accent-orange/20 cursor-pointer hover:border-accent-orange/40 transition-all group"
              >
                <p className="text-lg text-white leading-relaxed flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-orange animate-pulse" />
                  {currentScript.callToAction}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-gray-500">
                    {currentScript.callToAction.length} 字
                  </span>
                  <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-accent-orange transition-colors" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="section-title mb-0">
              <Clock className="w-5 h-5 text-primary-400" />
              字幕时间轴
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              共 {currentScript.subtitles.length} 条字幕 · 总时长约{" "}
              {currentScript.subtitles[currentScript.subtitles.length - 1]?.timestamp + 2 || 0}秒
            </p>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {currentScript.subtitles.map((sub, index) => (
                <div
                  key={index}
                  className="group p-3 rounded-lg bg-dark-800/50 border border-white/5 hover:border-primary-500/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 text-xs font-mono">
                      {sub.timestamp}s
                    </span>
                    <p className="flex-1 text-sm text-white pt-0.5">{sub.text}</p>
                    <button className="w-7 h-7 rounded-md bg-dark-700 hover:bg-primary-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl bg-dark-900/50 border border-white/10">
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">脚本字数统计</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="text-center p-2 rounded-lg bg-dark-800/50">
                  <p className="text-xl font-bold text-white">
                    {currentScript.opening.length +
                      currentScript.sellingPoints.reduce((acc, p) => acc + p.length, 0) +
                      currentScript.callToAction.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">总字数</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-dark-800/50">
                  <p className="text-xl font-bold text-primary-400">
                    {Math.round(
                      (currentScript.opening.length +
                        currentScript.sellingPoints.reduce((acc, p) => acc + p.length, 0) +
                        currentScript.callToAction.length) /
                        4
                    )}
                    s
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">预计时长</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-dark-800/50">
                  <p className="text-xl font-bold text-accent-green">
                    {currentScript.subtitles.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">字幕条数</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Script;
