import { onMounted, onUnmounted, ref, watch } from "vue";

export function useLimitPage(callback: (page: number) => Promise<any>, hasMore:()=>boolean) {
  const page = ref(1);
  const lock = ref(false);
  let lastScrollY = document.querySelector('.router_view')?.scrollTop ?? 0;
  const handleScroll = async () => {
    const el = document.querySelector('.router_view');
    if (!el || lock.value) return;
        const currentScrollY = document.querySelector('.router_view')?.scrollTop ?? 0;
        // console.log("滚动距离", currentScrollY);
        // console.log("文档总高度",document.querySelector('.router_view')!.scrollHeight);
        // console.log("窗口高度",window.innerHeight);
        const isScrollDown = currentScrollY > lastScrollY; // 滚动方向
        lastScrollY = currentScrollY;
        const scrollBottom = window.innerHeight + currentScrollY >= document.querySelector('.router_view')!.scrollHeight;
        
      if (hasMore() && scrollBottom && isScrollDown) {
        lock.value = true;
        page.value++;
        await callback(page.value);
          lock.value = false;
      }
  };

  const resetPage = () => {
    page.value = 1;
    callback(page.value);
  };

  onMounted(() => {
    document.querySelector('.router_view')?.addEventListener("scroll", handleScroll);
  });

  onUnmounted(() => {
    document.querySelector('.router_view')?.removeEventListener("scroll", handleScroll);
  });

  return {
    page,
    resetPage
  };
}