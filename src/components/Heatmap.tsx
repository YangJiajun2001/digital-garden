import { useMemo, useEffect, useRef } from 'react';

export interface HeatmapItem {
  pubDate: Date;
  content: string;
}

interface HeatmapProps {
  items: HeatmapItem[];
}

const TOOLTIP_WIDTH = 130;
const TOOLTIP_HEIGHT = 56;
const TOOLTIP_OFFSET = 16;

export default function Heatmap({ items }: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const heatmapData = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const dayCounts: Record<string, number> = {};

    items.forEach((item) => {
      const date = new Date(item.pubDate);
      const dateStr = date.toISOString().split('T')[0];
      const wordCount = item.content.length;
      dayCounts[dateStr] = (dayCounts[dateStr] || 0) + wordCount;
    });

    const data: { date: string; count: number }[] = [];
    const current = new Date(oneYearAgo);
    
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      data.push({
        date: dateStr,
        count: dayCounts[dateStr] || 0,
      });
      current.setDate(current.getDate() + 1);
    }

    return data;
  }, [items]);

  const getColorClass = (count: number): string => {
    if (count === 0) return 'bg-gray-200 dark:bg-gray-800';
    if (count < 100) return 'bg-green-200 dark:bg-green-800';
    if (count < 500) return 'bg-green-400 dark:bg-green-600';
    if (count < 1000) return 'bg-green-500 dark:bg-green-500';
    return 'bg-green-600 dark:bg-green-400';
  };

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const CELL_SIZE = 14;
  const CELL_GAP = 3;
  const WEEK_WIDTH = CELL_SIZE + CELL_GAP;

  const weeks: { monthLabel: string; monthOffset: number; days: { date: string; count: number }[] }[] = [];
  const totalDays = heatmapData.length;
  
  let lastMonth = -1;
  for (let i = 0; i < totalDays; i += 7) {
    const weekData = heatmapData.slice(i, i + 7);
    const firstDayOfWeek = new Date(weekData[0]?.date || new Date());
    const currentMonth = firstDayOfWeek.getMonth();
    const monthLabel = currentMonth !== lastMonth ? months[currentMonth] : '';
    
    weeks.push({
      monthLabel,
      monthOffset: currentMonth,
      days: weekData,
    });
    
    lastMonth = currentMonth;
  }

  const monthPositions = useMemo(() => {
    const positions: { label: string; left: number }[] = [];
    const totalWeeks = weeks.length;
    const firstDate = new Date(weeks[0]?.days[0]?.date || new Date());
    
    for (let month = 0; month < 12; month++) {
      const targetMonth = (firstDate.getMonth() + month) % 12;
      const targetYear = firstDate.getFullYear() + (firstDate.getMonth() + month >= 12 ? 1 : 0);
      
      const monthStart = new Date(targetYear, targetMonth, 1);
      const nextMonthStart = new Date(targetYear, targetMonth + 1, 1);
      
      const startWeekIdx = Math.floor((monthStart.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const endWeekIdx = Math.floor((nextMonthStart.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      const centerWeekIdx = Math.floor((startWeekIdx + endWeekIdx) / 2);
      
      if (centerWeekIdx >= 0 && centerWeekIdx < totalWeeks) {
        positions.push({
          label: months[targetMonth],
          left: centerWeekIdx * WEEK_WIDTH + WEEK_WIDTH / 2 - 12,
        });
      }
    }
    
    return positions;
  }, [weeks]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cells = containerRef.current.querySelectorAll('.day-cell');
    let tooltip: HTMLDivElement | null = null;

    const getTooltipStyles = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        background: isDark ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        color: isDark ? '#f9fafb' : '#1f2937',
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.15)',
        border: isDark ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid rgba(209, 213, 219, 0.8)',
        arrowBg: isDark ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        arrowBorder: isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.8)',
        dateColor: isDark ? '#9ca3af' : '#6b7280',
        countGradient: isDark ? 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)' : 'linear-gradient(135deg, #059669 0%, #06b6d4 100%)'
      };
    };

    const createTooltip = () => {
      if (tooltip) return tooltip;
      
      tooltip = document.createElement('div');
      tooltip.className = 'heatmap-tooltip';
      tooltip.innerHTML = `
        <div class="heatmap-tooltip-date"></div>
        <div class="heatmap-tooltip-count"></div>
        <div class="heatmap-tooltip-arrow"></div>
      `;
      document.body.appendChild(tooltip);
      
      return tooltip;
    };

    const updateTooltipPosition = (clientX: number, clientY: number) => {
      if (!tooltip) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let tooltipX = clientX + TOOLTIP_OFFSET;
      let tooltipY = clientY + TOOLTIP_OFFSET;

      if (tooltipX + TOOLTIP_WIDTH > windowWidth - 8) tooltipX = clientX - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
      if (tooltipY + TOOLTIP_HEIGHT > windowHeight - 8) tooltipY = clientY - TOOLTIP_HEIGHT - TOOLTIP_OFFSET;

      tooltip.style.left = `${tooltipX}px`;
      tooltip.style.top = `${tooltipY}px`;
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const date = target.getAttribute('data-date');
      const count = target.getAttribute('data-count');
      
      if (!date || !count) return;

      const tip = createTooltip();
      const styles = getTooltipStyles();
      
      // 应用动态样式
      tip.style.background = styles.background;
      tip.style.color = styles.color;
      tip.style.boxShadow = styles.boxShadow;
      tip.style.border = styles.border;
      
      const dateEl = tip.querySelector('.heatmap-tooltip-date') as HTMLElement;
      const countEl = tip.querySelector('.heatmap-tooltip-count') as HTMLElement;
      const arrowEl = tip.querySelector('.heatmap-tooltip-arrow') as HTMLElement;
      
      dateEl.textContent = date;
      dateEl.style.color = styles.dateColor;
      
      countEl.textContent = `灌溉了 ${count} 字`;
      countEl.style.background = styles.countGradient;
      countEl.style.webkitBackgroundClip = 'text';
      countEl.style.webkitTextFillColor = 'transparent';
      countEl.style.backgroundClip = 'text';
      
      arrowEl.style.background = styles.arrowBg;
      arrowEl.style.borderLeft = `1px solid ${styles.arrowBorder}`;
      arrowEl.style.borderTop = `1px solid ${styles.arrowBorder}`;
      
      tip.classList.add('visible');
      
      updateTooltipPosition(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!tooltip || !tooltip.classList.contains('visible')) return;
      updateTooltipPosition(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      if (!tooltip) return;
      tooltip.classList.remove('visible');
    };

    cells.forEach((cell) => {
      cell.addEventListener('mouseenter', handleMouseEnter);
      cell.addEventListener('mousemove', handleMouseMove);
      cell.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      cells.forEach((cell) => {
        cell.removeEventListener('mouseenter', handleMouseEnter);
        cell.removeEventListener('mousemove', handleMouseMove);
        cell.removeEventListener('mouseleave', handleMouseLeave);
      });
      
      if (tooltip) {
        document.body.removeChild(tooltip);
        tooltip = null;
      }
    };
  }, [heatmapData]);

  return (
    <div className="w-full relative">
      <style>{`
        .heatmap-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 16px;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .heatmap-wrapper::-webkit-scrollbar { display: none; }

        .heatmap-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: max-content;
        }

        .heatmap-legend {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          align-self: center;
        }

        .legend-text {
          font-size: 12px;
          font-weight: 500;
          background: linear-gradient(135deg, #9ca3af 0%, #4ade80 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .legend-colors { display: flex; gap: 4px; }
        .legend-cell { width: 14px; height: 14px; border-radius: 3px; }

        .heatmap-container { display: flex; align-items: flex-start; gap: 12px; }

        .weekday-column {
          display: flex;
          flex-direction: column;
          gap: ${CELL_GAP}px;
          padding-top: 28px;
          flex-shrink: 0;
        }

        .weekday-item {
          height: ${CELL_SIZE}px;
          line-height: ${CELL_SIZE}px;
          font-size: 11px;
          font-weight: 500;
          text-align: right;
          min-width: 20px;
          background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .heatmap-grid-wrapper {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .month-labels {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 24px;
          display: flex;
          align-items: flex-end;
        }

        .month-label {
          position: absolute;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          background: linear-gradient(135deg, #6b7280 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .week-columns {
          display: flex;
          gap: ${CELL_GAP}px;
          padding-top: 28px;
        }

        .week-column { display: flex; flex-direction: column; gap: ${CELL_GAP}px; }

        .day-cell {
          width: ${CELL_SIZE}px;
          height: ${CELL_SIZE}px;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .day-cell:hover {
          transform: scale(1.3);
          box-shadow: 0 0 12px rgba(74, 222, 128, 0.5);
        }

        .heatmap-tooltip {
          position: fixed;
          z-index: 9999;
          padding: 8px 12px;
          backdrop-filter: blur(12px);
          border-radius: 8px;
          font-size: 12px;
          pointer-events: none;
          white-space: nowrap;
          width: ${TOOLTIP_WIDTH}px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .heatmap-tooltip.visible {
          opacity: 1;
        }

        .heatmap-tooltip-date {
          margin-bottom: 4px;
          font-size: 11px;
        }

        .heatmap-tooltip-count {
          font-weight: 600;
          font-size: 13px;
        }

        .heatmap-tooltip-arrow {
          position: absolute;
          left: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
        }
      `}</style>

      <div className="heatmap-wrapper">
        <div className="heatmap-inner">
          <div className="heatmap-legend">
            <span className="legend-text">少</span>
            <div className="legend-colors">
              <div className="legend-cell bg-gray-200 dark:bg-gray-800"></div>
              <div className="legend-cell bg-green-200 dark:bg-green-800"></div>
              <div className="legend-cell bg-green-400 dark:bg-green-600"></div>
              <div className="legend-cell bg-green-500"></div>
              <div className="legend-cell bg-green-600 dark:bg-green-400"></div>
            </div>
            <span className="legend-text">多</span>
          </div>

          <div className="heatmap-container">
            <div className="weekday-column">
              {weekDays.map((day, idx) => (
                <div key={idx} className="weekday-item">{day}</div>
              ))}
            </div>

            <div className="heatmap-grid-wrapper">
              <div className="month-labels">
                {monthPositions.map((pos, idx) => (
                  <div key={idx} className="month-label" style={{ left: `${pos.left}px` }}>
                    {pos.label}
                  </div>
                ))}
              </div>

              <div className="week-columns" ref={containerRef}>
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="week-column">
                    {week.days.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className={`day-cell ${getColorClass(day.count)}`}
                        data-date={day.date}
                        data-count={day.count}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
