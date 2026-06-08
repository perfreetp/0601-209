import {
  Mic,
  Volume2,
  Gauge,
  Globe,
  User,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const voiceTones = [
  { id: "warm", label: "温暖亲切", desc: "适合日常推荐" },
  { id: "energetic", label: "热情活力", desc: "适合促销活动" },
  { id: "professional", label: "专业稳重", desc: "适合高端品牌" },
  { id: "cute", label: "可爱俏皮", desc: "适合年轻群体" },
];

const dialects = [
  { id: "mandarin", label: "普通话", flag: "🇨🇳" },
  { id: "cantonese", label: "粤语", flag: "🇭🇰" },
  { id: "sichuan", label: "四川话", flag: "🌶️" },
  { id: "northeast", label: "东北话", flag: "❄️" },
  { id: "taiwan", label: "台湾腔", flag: "🏝️" },
  { id: "shanghai", label: "上海话", flag: "🏙️" },
];

const Voice = () => {
  const { voiceConfig, updateVoiceConfig } = useAppStore();

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Mic className="w-7 h-7 text-primary-400" />
          配音设置
        </h1>
        <p className="text-gray-400">选择适合您品牌调性的配音风格和语速</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="section-title">
              <User className="w-5 h-5 text-primary-400" />
              声音选择
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {(["female", "male"] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => updateVoiceConfig({ gender })}
                  className={`relative p-6 rounded-2xl border-2 transition-all overflow-hidden ${
                    voiceConfig.gender === gender
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-white/10 bg-dark-800/50 hover:border-primary-500/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                        gender === "female"
                          ? "bg-gradient-to-br from-pink-500 to-rose-600"
                          : "bg-gradient-to-br from-blue-500 to-indigo-600"
                      }`}
                    >
                      {gender === "female" ? "👩" : "👨"}
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white">
                        {gender === "female" ? "女声" : "男声"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {gender === "female" ? "温柔甜美 · 亲和力强" : "沉稳磁性 · 专业感"}
                      </p>
                    </div>
                  </div>
                  {voiceConfig.gender === gender && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="section-title">
              <Volume2 className="w-5 h-5 text-primary-400" />
              音色风格
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {voiceTones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => updateVoiceConfig({ tone: tone.label })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    voiceConfig.tone === tone.label
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-white/10 bg-dark-800/50 hover:border-primary-500/30"
                  }`}
                >
                  <p className="text-white font-medium mb-0.5">{tone.label}</p>
                  <p className="text-xs text-gray-500">{tone.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="section-title">
              <Gauge className="w-5 h-5 text-primary-400" />
              语速调节
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">0.5x</span>
                <span className="text-3xl font-display font-bold text-white">
                  {voiceConfig.speed.toFixed(1)}x
                </span>
                <span className="text-sm text-gray-400">2.0x</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceConfig.speed}
                  onChange={(e) => updateVoiceConfig({ speed: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-primary-500"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((voiceConfig.speed - 0.5) / 1.5) * 100}%, #374151 ${((voiceConfig.speed - 0.5) / 1.5) * 100}%, #374151 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between">
                {[0.75, 1, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateVoiceConfig({ speed: s })}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      voiceConfig.speed === s
                        ? "bg-primary-500 text-white"
                        : "bg-dark-700 text-gray-400 hover:text-white"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500">
                当前语速：
                {voiceConfig.speed < 0.9
                  ? "慢速 - 适合强调重点"
                  : voiceConfig.speed > 1.2
                  ? "快速 - 适合促销场景"
                  : "正常 - 平衡适中"}
              </p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="section-title">
              <Globe className="w-5 h-5 text-primary-400" />
              方言 / 口音
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {dialects.map((dialect) => (
                <button
                  key={dialect.id}
                  onClick={() => updateVoiceConfig({ dialect: dialect.label })}
                  className={`p-4 rounded-xl border transition-all ${
                    voiceConfig.dialect === dialect.label
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-white/10 bg-dark-800/50 hover:border-primary-500/30"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{dialect.flag}</span>
                  <p className="text-white font-medium">{dialect.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="glass-card p-6 sticky top-24">
            <h2 className="section-title">
              <Play className="w-5 h-5 text-primary-400" />
              配音预览
            </h2>

            <div className="aspect-[9/16] rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 border border-white/10 overflow-hidden mb-5 flex flex-col items-center justify-center p-6 relative">
              <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bottom-0 bg-gradient-to-t from-primary-500 to-accent-cyan rounded-t-full animate-pulse"
                    style={{
                      width: "4px",
                      height: `${20 + Math.random() * 60}%`,
                      left: `${i * 5 + 2}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <p className="text-white font-medium mb-1">
                  {voiceConfig.gender === "female" ? "小柔" : "小凯"}
                </p>
                <p className="text-xs text-gray-400">
                  {voiceConfig.tone} · {voiceConfig.dialect}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-5">
              <button className="w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-all">
                <SkipBack className="w-4 h-4 text-gray-300" />
              </button>
              <button className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow hover:scale-105 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" />
              </button>
              <button className="w-10 h-10 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-all">
                <SkipForward className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            <div className="h-1.5 rounded-full bg-dark-700 overflow-hidden mb-2">
              <div className="h-full w-1/3 rounded-full bg-gradient-primary" />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>00:08</span>
              <span>00:24</span>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-dark-800/50 border border-white/5">
              <p className="text-xs text-gray-500 mb-2">示例文案：</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                朋友们注意啦！今天给大家推荐一款超好吃的招牌红烧牛肉面，精选牛腱肉慢炖4小时，现在下单立享7.4折优惠！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voice;
