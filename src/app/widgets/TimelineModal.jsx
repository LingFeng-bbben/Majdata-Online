"use client";
import React, { useEffect, useState } from "react";
import { getActiveEvents, isEventOngoing, isEventUpcoming } from "../utils/eventsData";
import { loc } from "../utils";

// 时间轴甘特图弹窗组件
export default function TimelineModal({ isOpen, onClose }) {
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [timelineData, setTimelineData] = useState({
    startDate: null,
    endDate: null,
    totalDays: 0,
    events: [],
    timeScale: []
  });

  useEffect(() => {
    if (isOpen) {
      const events = getActiveEvents();
      setOngoingEvents(events);
      
      if (events.length > 0) {
        // 计算时间轴范围
        const dates = events.map(event => ({
          start: new Date(event.createDate),
          end: new Date(event.endDate),
          duration: Math.ceil((new Date(event.endDate) - new Date(event.createDate)) / (1000 * 60 * 60 * 24))
        }));
        
        const minStart = new Date(Math.min(...dates.map(d => d.start)));
        const maxEnd = new Date(Math.max(...dates.map(d => d.end)));
        const totalDays = Math.ceil((maxEnd - minStart) / (1000 * 60 * 60 * 24));
        
        // 应用智能时间轴压缩
        const compressedTimelineData = applyTimelineCompression(events, minStart, maxEnd, totalDays);
        
        // 生成压缩后的时间刻度
        const timeScale = generateCompressedTimeScale(compressedTimelineData.segments);
        
        setTimelineData({
          startDate: minStart,
          endDate: maxEnd,
          totalDays,
          events: compressedTimelineData.events,
          timeScale,
          segments: compressedTimelineData.segments,
          isCompressed: compressedTimelineData.isCompressed
        });
      }
    }
  }, [isOpen]);

  // 按category排序事件
  const sortEventsByCategory = (events) => {
    // 定义category的优先级顺序
    const categoryOrder = {
      "大型赛事": 1,
      "高校赛事": 2,
      "私立赛事": 3,
      "私立企划": 4
    };
    
    return events.sort((a, b) => {
      const orderA = categoryOrder[a.category] || 999;
      const orderB = categoryOrder[b.category] || 999;
      
      // 首先按category排序
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // 如果category相同，按开始时间排序
      return new Date(a.createDate) - new Date(b.createDate);
    });
  };

  // 智能时间轴压缩算法
  const applyTimelineCompression = (events, minStart, maxEnd, totalDays) => {
    // 先按category排序
    const sortedEvents = sortEventsByCategory([...events]);
    
    // 如果总时间跨度小于120天，不需要压缩
    if (totalDays <= 120) {
      const eventsWithPosition = sortedEvents.map((event, index) => {
        const eventStart = new Date(event.createDate);
        const eventEnd = new Date(event.endDate);
        const eventDuration = Math.ceil((eventEnd - eventStart) / (1000 * 60 * 60 * 24));
        const startOffset = Math.ceil((eventStart - minStart) / (1000 * 60 * 60 * 24));
        
        return {
          ...event,
          startOffset: (startOffset / totalDays) * 100,
          width: (eventDuration / totalDays) * 100,
          duration: eventDuration,
          isOngoing: isEventOngoing(event),
          isUpcoming: isEventUpcoming(event),
          row: index
        };
      });
      
      return {
        events: eventsWithPosition,
        segments: [{ start: minStart, end: maxEnd, compressed: false }],
        isCompressed: false
      };
    }

    // 分析活动密度，找出活动集中的时间段
    const activitySegments = analyzeActivityDensity(sortedEvents, minStart, maxEnd);
    
    // 创建压缩段
    const segments = createCompressedSegments(activitySegments, minStart, maxEnd);
    
    // 重新计算事件位置
    const eventsWithPosition = sortedEvents.map((event, index) => {
      const eventStart = new Date(event.createDate);
      const eventEnd = new Date(event.endDate);
      const eventDuration = Math.ceil((eventEnd - eventStart) / (1000 * 60 * 60 * 24));
      
      const position = calculateCompressedPosition(eventStart, eventEnd, segments);
      
      return {
        ...event,
        startOffset: position.start,
        width: position.width,
        duration: eventDuration,
        isOngoing: isEventOngoing(event),
        isUpcoming: isEventUpcoming(event),
        row: index
      };
    });
    
    return {
      events: eventsWithPosition,
      segments,
      isCompressed: true
    };
  };

  // 分析活动密度
  const analyzeActivityDensity = (events, minStart, maxEnd) => {
    const totalDays = Math.ceil((maxEnd - minStart) / (1000 * 60 * 60 * 24));
    const densityMap = new Array(totalDays).fill(0);
    
    // 计算每天的活动数量
    events.forEach(event => {
      const eventStart = new Date(event.createDate);
      const eventEnd = new Date(event.endDate);
      const startDay = Math.floor((eventStart - minStart) / (1000 * 60 * 60 * 24));
      const endDay = Math.floor((eventEnd - minStart) / (1000 * 60 * 60 * 24));
      
      for (let day = startDay; day <= endDay; day++) {
        if (day >= 0 && day < totalDays) {
          densityMap[day]++;
        }
      }
    });
    
    // 找出高密度和低密度区域
    const segments = [];
    let currentSegment = null;
    const threshold = Math.max(1, events.length * 0.3); // 密度阈值
    
    for (let day = 0; day < totalDays; day++) {
      const isHighDensity = densityMap[day] >= threshold;
      
      if (!currentSegment || currentSegment.isHighDensity !== isHighDensity) {
        if (currentSegment) {
          segments.push(currentSegment);
        }
        currentSegment = {
          startDay: day,
          endDay: day,
          isHighDensity,
          density: densityMap[day]
        };
      } else {
        currentSegment.endDay = day;
        currentSegment.density = Math.max(currentSegment.density, densityMap[day]);
      }
    }
    
    if (currentSegment) {
      segments.push(currentSegment);
    }
    
    return segments;
  };

  // 创建压缩段
  const createCompressedSegments = (activitySegments, minStart, maxEnd) => {
    const segments = [];
    let currentPosition = 0;
    
    activitySegments.forEach(segment => {
      const segmentStart = new Date(minStart.getTime() + segment.startDay * 24 * 60 * 60 * 1000);
      const segmentEnd = new Date(minStart.getTime() + (segment.endDay + 1) * 24 * 60 * 60 * 1000);
      const segmentDays = segment.endDay - segment.startDay + 1;
      
      let segmentWidth;
      if (segment.isHighDensity) {
        // 高密度区域按实际比例分配空间
        segmentWidth = Math.max(15, (segmentDays / Math.ceil((maxEnd - minStart) / (1000 * 60 * 60 * 24))) * 70);
      } else {
        // 低密度区域压缩，最小5%，最大15%
        const naturalWidth = (segmentDays / Math.ceil((maxEnd - minStart) / (1000 * 60 * 60 * 24))) * 100;
        segmentWidth = Math.min(15, Math.max(5, naturalWidth * 0.3));
      }
      
      segments.push({
        start: segmentStart,
        end: segmentEnd,
        startPosition: currentPosition,
        endPosition: currentPosition + segmentWidth,
        compressed: !segment.isHighDensity,
        density: segment.density,
        days: segmentDays
      });
      
      currentPosition += segmentWidth;
    });
    
    // 标准化到100%
    const totalWidth = currentPosition;
    segments.forEach(segment => {
      segment.startPosition = (segment.startPosition / totalWidth) * 100;
      segment.endPosition = (segment.endPosition / totalWidth) * 100;
    });
    
    return segments;
  };

  // 计算压缩后的位置
  const calculateCompressedPosition = (eventStart, eventEnd, segments) => {
    let startPosition = 0;
    let endPosition = 0;
    
    for (const segment of segments) {
      if (eventStart >= segment.start && eventStart <= segment.end) {
        const segmentProgress = (eventStart - segment.start) / (segment.end - segment.start);
        startPosition = segment.startPosition + (segment.endPosition - segment.startPosition) * segmentProgress;
      }
      
      if (eventEnd >= segment.start && eventEnd <= segment.end) {
        const segmentProgress = (eventEnd - segment.start) / (segment.end - segment.start);
        endPosition = segment.startPosition + (segment.endPosition - segment.startPosition) * segmentProgress;
        break;
      }
    }
    
    // 如果事件跨越多个段，需要特殊处理
    if (endPosition === 0) {
      endPosition = segments[segments.length - 1].endPosition;
    }
    
    return {
      start: Math.max(0, startPosition),
      width: Math.max(1, endPosition - startPosition)
    };
  };

  // 生成压缩后的时间刻度
  const generateCompressedTimeScale = (segments) => {
    const scale = [];
    
    segments.forEach(segment => {
      const segmentDays = Math.ceil((segment.end - segment.start) / (1000 * 60 * 60 * 24));
      const stepDays = segment.compressed ? Math.max(7, Math.floor(segmentDays / 3)) : 
                      segmentDays > 30 ? 3 : 1;
      
      const current = new Date(segment.start);
      while (current <= segment.end) {
        const segmentProgress = (current - segment.start) / (segment.end - segment.start);
        const position = segment.startPosition + (segment.endPosition - segment.startPosition) * segmentProgress;
        
        scale.push({
          date: new Date(current),
          position,
          isMonth: current.getDate() === 1,
          isWeek: current.getDay() === 1 && stepDays >= 7,
          compressed: segment.compressed
        });
        
        current.setDate(current.getDate() + stepDays);
      }
    });
    
    return scale;
  };


  // 获取当前语言的locale
  const getDateLocale = () => {
    const lang = localStorage.getItem("language") || "zh";
    const localeMap = {
      "zh": "zh-CN",
      "en": "en-US",
      "ja": "ja-JP",
      "ko": "ko-KR"
    };
    return localeMap[lang] || "zh-CN";
  };

  // 格式化日期显示
  const formatDate = (date) => {
    return date.toLocaleDateString(getDateLocale(), {
      month: "short",
      day: "numeric"
    });
  };

  // 格式化紧凑日期显示
  const formatCompactDate = (date) => {
    return date.toLocaleDateString(getDateLocale(), {
      month: "numeric",
      day: "numeric"
    });
  };


  // 获取事件颜色
  const getEventColor = (event) => {
    const baseColors = {
      "大型赛事": "#3b82f6", // 蓝色
      "私立赛事": "#10b981", // 绿色
      "高校赛事": "#f59e0b", // 橙色
      "私立企划": "#8b5cf6", // 紫色
    };
    
    const baseColor = baseColors[event.category] || "#6b7280"; // 默认灰色
    
    // 如果是即将开始的活动，使用更淡的颜色
    if (event.isUpcoming) {
      // 将颜色转换为更淡的版本
      const upcomingColors = {
        "#3b82f6": "#93c5fd", // 淡蓝色
        "#10b981": "#6ee7b7", // 淡绿色
        "#f59e0b": "#fbbf24", // 淡橙色
        "#8b5cf6": "#c4b5fd", // 淡紫色
        "#6b7280": "#9ca3af"  // 淡灰色
      };
      return upcomingColors[baseColor] || "#9ca3af";
    }
    
    return baseColor;
  };

  if (!isOpen) return null;

  return (
    <div className="timeline-modal-overlay" onClick={onClose}>
      <div className="timeline-modal" onClick={(e) => e.stopPropagation()}>
        <div className="timeline-modal-header">
          <h2 className="timeline-modal-title">{loc("EventTimeline")}</h2>
          <button className="timeline-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="timeline-modal-content">
          {ongoingEvents.length === 0 ? (
            <div className="timeline-empty">
              <p>{loc("NoActiveEvents")}</p>
            </div>
          ) : (
            <>
              <div className="timeline-info">
                <div className="timeline-stats">
                  <span className="timeline-stat">
                    <strong>{ongoingEvents.length}</strong> {loc("ActiveEvents")}
                  </span>
                  <span className="timeline-stat">
                    {loc("TimeSpan")}<strong>{timelineData.totalDays}</strong> {loc("Days")}
                  </span>
                </div>
                <div className="timeline-date-range">
                  <span className="timeline-start-date">
                    {timelineData.startDate && formatDate(timelineData.startDate)}
                  </span>
                  <span className="timeline-separator">—</span>
                  <span className="timeline-end-date">
                    {timelineData.endDate && formatDate(timelineData.endDate)}
                  </span>
                </div>
              </div>

              <div className="timeline-gantt">

                {/* 紧密排列的活动条 */}
                <div className="timeline-chart">
                  <div className="timeline-grid">
                    {timelineData.timeScale.map((tick, index) => (
                      <div 
                        key={index}
                        className={`timeline-grid-line ${tick.isMonth ? 'major' : tick.isWeek ? 'minor' : 'micro'}`}
                        style={{ left: `${tick.position}%` }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="timeline-events-compact">
                    {timelineData.events.map((event) => (
                      <div key={event.id} className="timeline-event-row-compact">
                        <div className="timeline-event-label">
                          <div className="timeline-event-title-compact">{event.title}</div>
                          <div className="timeline-event-meta-compact">
                            <span 
                              className="timeline-event-category-compact"
                              style={{ color: getEventColor(event) }}
                            >
                              {event.category}
                            </span>
                            <span className="timeline-event-dates">
                              {formatCompactDate(new Date(event.createDate))} - {formatCompactDate(new Date(event.endDate))}
                            </span>
                          </div>
                        </div>
                         <div className="timeline-event-track">
                           <a
                             href={event.href}
                             className="timeline-event-bar-compact timeline-event-link"
                             style={{
                               left: `${event.startOffset}%`,
                               width: `${event.width}%`,
                               backgroundColor: getEventColor(event),
                             }}
                             title={`${event.title}\n${formatCompactDate(new Date(event.createDate))} - ${formatCompactDate(new Date(event.endDate))}\n${loc("Duration")} ${event.duration} ${loc("Days")}\n${loc("ClickToViewDetails")}`}
                             target="_blank"
                             rel="noopener noreferrer"
                           >
                             <div className="timeline-event-bar-inner">
                               <span className="timeline-event-bar-text-compact">
                                 {event.title}
                               </span>
                               <div className="timeline-event-progress" style={{ width: '100%' }}></div>
                             </div>
                           </a>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
