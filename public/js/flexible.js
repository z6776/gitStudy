(function flexible(window, document) {
    var docEl = document.documentElement;
    var dpr = window.devicePixelRatio || 1;
  
    // 调整 body 字体大小
    function setBodyFontSize() {
      if (document.body) {
        // body 字体大小默认为 16px
        document.body.style.fontSize = 16 * dpr + "px";
      } else {
        document.addEventListener("DOMContentLoaded", setBodyFontSize);
      }
    }
    setBodyFontSize();
  
   function setRemUnit() {
      const docEl = document.documentElement;
      const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

      const logicalWidth = docEl.clientWidth;
      const physicalWidth = screen.width;

      const dpr = Math.min(Math.max(physicalWidth / logicalWidth, 1), 2);

      const baseSplitNum = 24;
      
      const splitNum = isMobile ? 10 : baseSplitNum * dpr;

      // 计算并设置根字体大小
      const rem = logicalWidth / splitNum;
      docEl.style.fontSize = rem + 'px';

      docEl.setAttribute('data-dpr', dpr);
    }
  
    setRemUnit();
  
    // 页面调整大小时重置 rem 单位
    window.addEventListener("resize", setRemUnit);
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) {
        setRemUnit();
      }
    });
    // 检测 0.5px 支持
    if (dpr >= 2) {
      var fakeBody = document.createElement("body");
      var testElement = document.createElement("div");
      testElement.style.border = ".5px solid transparent";
      fakeBody.appendChild(testElement);
      docEl.appendChild(fakeBody);
      if (testElement.offsetHeight === 1) {
        docEl.classList.add("hairlines");
      }
      docEl.removeChild(fakeBody);
    }
  })(window, document);
