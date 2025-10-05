// 从JSON文件加载活动数据
import eventsData from "./events.json";

// 获取所有活动数据
export function getAllEvents() {
  return eventsData;
}

// 获取活动总数
export function getEventsCount() {
  return eventsData.length;
}

// 获取其他活动数量（除了主页轮播显示的）
export function getNonFeaturedEventsCount() {
  const ongoingEvents = getOngoingEvents();
  const displayedCount = Math.min(ongoingEvents.length, 2);
  return Math.max(0, eventsData.length - displayedCount);
}

// 根据ID获取单个活动
export function getEventById(id) {
  return eventsData.find((event) => event.id === id);
}

// 智能计算时间差距（多少天前）
export function getTimeAgo(createDate) {
  const eventDate = new Date(createDate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - eventDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return "今天";
  } else if (diffDays === 1) {
    return "1天前";
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}个月前`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years}年前`;
  }
}

// 获取带智能时间显示的活动数据
export function getEventsWithTimeAgo() {
  return eventsData.map((event) => ({
    ...event,
    timeAgo: getTimeAgo(event.createDate),
    createDateFormatted: new Date(event.createDate).toLocaleDateString(
      "zh-CN",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    ),
  }));
}

// 检查活动是否正在进行中（基于当前日期和结束日期）
export function isEventOngoing(event) {
  const currentDate = new Date();
  const endDate = new Date(event.endDate);
  return currentDate <= endDate;
}

// 获取所有进行中的活动
export function getOngoingEvents() {
  return eventsData.filter((event) => isEventOngoing(event));
}

// 获取所有已结束的活动
export function getEndedEvents() {
  return eventsData.filter((event) => !isEventOngoing(event));
}

// 智能轮播管理器 - 用于主页活动展示
class EventCarouselManager {
  constructor() {
    this.currentIndex = 0;
    this.eventPool = [];
    this.displayedEvents = [];
    this.isInitialized = false;
  }

  // 初始化事件池
  initialize() {
    const ongoingEvents = getOngoingEvents();

    if (ongoingEvents.length === 0) {
      // 没有进行中的活动，使用最新的活动
      const recentEvents = getEventsWithTimeAgo()
        .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
        .slice(0, 2);
      this.eventPool = recentEvents;
      this.displayedEvents = [...this.eventPool];
      this.isInitialized = true;
      return { events: this.displayedEvents, shouldRotate: false };
    }

    // 为每个活动添加时间信息
    this.eventPool = ongoingEvents.map((event) => ({
      ...event,
      timeAgo: getTimeAgo(event.createDate),
      createDateFormatted: new Date(event.createDate).toLocaleDateString(
        "zh-CN",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      ),
    }));

    // 初始显示前两个
    this.displayedEvents = this.eventPool.slice(0, 2);
    this.isInitialized = true;

    return {
      events: this.displayedEvents,
      shouldRotate: this.eventPool.length > 2,
    };
  }

  // 获取下一组活动（智能轮播）
  getNextEvents() {
    if (!this.isInitialized) {
      return this.initialize();
    }

    // 如果活动数量 <= 2，不进行轮播
    if (this.eventPool.length <= 2) {
      return {
        events: this.displayedEvents,
        shouldRotate: false,
      };
    }

    // 滚动式轮播：每次只换一个活动
    this.currentIndex = (this.currentIndex + 1) % this.eventPool.length;

    // 计算新的两个活动位置
    const firstIndex = this.currentIndex;
    const secondIndex = (this.currentIndex + 1) % this.eventPool.length;

    this.displayedEvents = [
      this.eventPool[firstIndex],
      this.eventPool[secondIndex],
    ];

    return {
      events: this.displayedEvents,
      shouldRotate: true,
    };
  }

  // 重置管理器（当活动数据更新时调用）
  reset() {
    this.currentIndex = 0;
    this.eventPool = [];
    this.displayedEvents = [];
    this.isInitialized = false;
  }
}

// 创建全局轮播管理器实例
const carouselManager = new EventCarouselManager();

// 获取轮播活动数据（供组件使用）
export function getCarouselEvents() {
  return carouselManager.initialize();
}

// 获取下一组轮播活动
export function getNextCarouselEvents() {
  return carouselManager.getNextEvents();
}

// 重置轮播状态（当活动数据变化时使用）
export function resetCarousel() {
  carouselManager.reset();
}

// 检查是否应该进行轮播
export function shouldEnableCarousel() {
  const ongoingEvents = getOngoingEvents();
  return ongoingEvents.length > 2;
}

// 保留原有函数作为兼容（已废弃，建议使用新的轮播管理器）
export function getRandomOngoingEvents() {
  const result = carouselManager.initialize();
  return result.events;
}

// 获取活动状态的中文显示
export function getEventStatusText(event) {
  if (isEventOngoing(event)) {
    return "进行中";
  }
  return "已结束";
}

// 获取活动状态的样式类名
export function getEventStatusClass(event) {
  if (isEventOngoing(event)) {
    return "status-ongoing";
  }
  return "status-ended";
}

// 预构建搜索关键词到活动的映射表（性能优化）
let searchKeywordToEventMap = null;

function buildSearchKeywordMap() {
  if (searchKeywordToEventMap) return searchKeywordToEventMap;
  
  searchKeywordToEventMap = new Map();
  
  eventsData.forEach((event) => {
    // 检查href是否包含search参数
    if (event.href && event.href.includes("?search=")) {
      try {
        const searchParam = event.href.split("?search=")[1];
        // URL解码
        const decodedSearchParam = decodeURIComponent(searchParam);
        searchKeywordToEventMap.set(decodedSearchParam, event);
      } catch (error) {
        // 忽略URL解码错误
        console.warn("Failed to decode search parameter:", event.href);
      }
    }
  });
  
  return searchKeywordToEventMap;
}

// 根据搜索关键词获取对应的活动（高性能版本）
export function getEventBySearchKeyword(searchKeyword) {
  if (!searchKeyword) return null;
  
  const map = buildSearchKeywordMap();
  return map.get(searchKeyword) || null;
}