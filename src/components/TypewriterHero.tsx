import { useState, useEffect } from 'react';

const phrases = [
  { emoji: '🌱', text: '一名数字园丁' },
  { emoji: '💻', text: '正在培育思想的种子' },
  { emoji: '📚', text: '用代码编织知识网络' },
];

const TYPING_SPEED = 80;    // 打字速度（毫秒）
const DELETING_SPEED = 40;  // 删除速度（毫秒）
const PAUSE_DURATION = 2000; // 停顿时间（毫秒）

export default function TypewriterHero() {
  const [displayText, setDisplayText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // 光标闪烁效果
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const fullLength = currentPhrase.text.length;
    const currentLength = displayText.length;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      // 打字阶段
      if (currentLength < fullLength) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.text.slice(0, currentLength + 1));
        }, TYPING_SPEED);
      } else {
        // 打完后停顿
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_DURATION);
      }
    } else {
      // 删除阶段
      if (currentLength > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.text.slice(0, currentLength - 1));
        }, DELETING_SPEED);
      } else {
        // 切换到下一个短语
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        return;
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhraseIndex]);

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <div className="flex justify-center gap-4 mb-8">
        <a
          href="/garden"
          className="group px-6 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-300 border border-purple-600/30 hover:border-purple-500/50 backdrop-blur-sm"
        >
          <span className="flex items-center gap-2.5 btn-text">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 013.001-3.001h1.987a.75.75 0 01.75.75v11.998a3.001 3.001 0 01-3.001 3.001H3.36m11.14 0a3.001 3.001 0 003.001-3.001V15a.75.75 0 00-.75-.75h-2.25" />
            </svg>
            知识图谱
          </span>
        </a>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold mb-6 font-sans tracking-tight">
        Hi, I'm Yangjiajun
      </h1>

      <div className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 font-light tracking-wide mt-2 min-h-[2.5rem]">
        {/* emoji 保持原始颜色 */}
        <span>{phrases[currentPhraseIndex].emoji}</span>
        {/* 文字应用渐变效果 */}
        <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
          {displayText}
        </span>
        <span
          className={`inline-block w-1 h-8 md:h-10 ml-1 bg-emerald-500 dark:bg-emerald-400 align-middle transition-opacity duration-100 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </section>
  );
}
