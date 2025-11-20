// ========================================
// モバイルメニュートグル機能
// ========================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// メニューボタンクリック時の処理
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// ========================================
// スムーススクロール機能
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // リンク先の要素を取得
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // スムーズにスクロール
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // モバイルメニューを閉じる
            navMenu.classList.remove('active');
        }
    });
});

// ========================================
// スクロール時のヘッダー背景変更
// ========================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});