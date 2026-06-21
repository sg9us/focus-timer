import { useCallback, useState } from 'react';

const isSupported = typeof window !== 'undefined' && 'documentPictureInPicture' in window;

// PiP 창은 빈 document라서 메인 문서의 스타일시트를 그대로 복사해야 .app-container 등 클래스가 동작함
function copyStyles(pipWindow) {
  [...document.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('\n');
      const style = pipWindow.document.createElement('style');
      style.textContent = cssRules;
      pipWindow.document.head.appendChild(style);
    } catch {
      // cross-origin이라 cssRules를 읽을 수 없으면 link 태그로 재요청 (Pretendard CDN 등)
      if (styleSheet.href) {
        const link = pipWindow.document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleSheet.href;
        pipWindow.document.head.appendChild(link);
      }
    }
  });
}

export default function usePictureInPicture({ width = 300, height = 400 } = {}) {
  const [pipWindow, setPipWindow] = useState(null);

  const open = useCallback(async () => {
    if (!isSupported || pipWindow) return;
    try {
      const pip = await window.documentPictureInPicture.requestWindow({ width, height });
      copyStyles(pip);
      // #root의 flex 중앙 정렬을 portal 타겟인 body에도 동일하게 적용
      Object.assign(pip.document.body.style, {
        margin: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      });
      pip.addEventListener('pagehide', () => setPipWindow(null), { once: true });
      setPipWindow(pip);
    } catch (err) {
      console.error('Picture-in-Picture 창을 열지 못했습니다.', err);
    }
  }, [pipWindow, width, height]);

  const close = useCallback(() => {
    pipWindow?.close();
    setPipWindow(null);
  }, [pipWindow]);

  return { pipWindow, isSupported, open, close };
}
