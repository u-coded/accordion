const DETAILS_SEL = "[data-details]"; // <details> 要素のセレクター
const DETAILS_CONTENT_SEL = "[data-details-content]"; // コンテンツ部分のセレクター

// 全ての <details> 要素を取得
const detailsElements = document.querySelectorAll(DETAILS_SEL);

detailsElements.forEach((detail) => {
  const summary = detail.querySelector("summary"); // 各 <summary> 要素を取得
  const content = detail.querySelector(DETAILS_CONTENT_SEL); // 各コンテンツ部分を取得

  // ページロード時の初期状態設定
  if (detail.hasAttribute("open")) {
    content.style.height = `${content.scrollHeight}px`; // 開いている場合、コンテンツの高さを設定
  } else {
    content.style.height = "0px"; // 閉じている場合、コンテンツの高さを0に設定
  }

  // <summary> クリック時の処理
  summary.addEventListener("click", (e) => {
    e.preventDefault(); // デフォルトのクリック動作を防ぐ

    const isOpen = detail.hasAttribute("open"); // <details> が開いているかどうかを判定
    const durationVal =
      getComputedStyle(content).getPropertyValue("--duration"); // カスタムプロパティからアニメーションの継続時間を取得
    const duration = durationVal
      ? parseFloat(durationVal.replace("s", "")) * 1000 // 秒をミリ秒に変換
      : 150; // デフォルトの継続時間は150ms

    if (!isOpen) {
      // <details> が閉じている場合
      detail.setAttribute("open", "true"); // open 属性を追加
      summary.setAttribute("aria-expanded", "true"); // アクセシビリティ属性を更新
      content.setAttribute("aria-hidden", "false"); // アクセシビリティ属性を更新
      content.style.height = "auto"; // 自動高さに設定し直す
      const contentHeight = content.scrollHeight; // 現在の高さを取得
      content.style.height = "0px"; // 高さを0に設定してからアニメーションを開始
      requestAnimationFrame(() => {
        content.style.transition = `height ${duration}ms ease`; // アニメーションの設定
        content.style.height = `${contentHeight}px`; // 実際の高さにアニメーション
      });
      content.addEventListener(
        "transitionend",
        () => {
          content.style.height = "auto"; // アニメーション終了後に高さを自動に戻す
        },
        { once: true } // イベントを一度だけリスン
      );
    } else {
      // <details> が開いている場合
      const contentHeight = content.scrollHeight; // 現在の高さを取得
      content.style.height = `${contentHeight}px`; // アニメーション開始前に現在の高さを設定
      requestAnimationFrame(() => {
        content.style.transition = `height ${duration}ms ease`; // アニメーションの設定
        content.style.height = "0px"; // 高さを0にアニメーション
      });
      content.addEventListener(
        "transitionend",
        () => {
          detail.removeAttribute("open"); // open 属性を削除
          summary.setAttribute("aria-expanded", "false"); // アクセシビリティ属性を更新
          content.setAttribute("aria-hidden", "true"); // アクセシビリティ属性を更新
          content.style.height = ""; // 高さをリセット
        },
        { once: true } // イベントを一度だけリスン
      );
    }
  });
});
