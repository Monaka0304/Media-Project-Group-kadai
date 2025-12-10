// ========================================
// DOM読み込み完了を待つ
// ========================================
document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // モバイルメニュートグル機能
    // ========================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    // メニューボタンクリック時の処理
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

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
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // ========================================
    // パーティクルアニメーション背景
    // ========================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;

        // キャンバスサイズの設定
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
        }

        // パーティクルクラス
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.size = Math.random() * 3 + 1;
                this.speedY = Math.random() * 0.5 + 0.2;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                // 画面外に出たらリセット
                if (this.y > canvas.height) {
                    this.reset();
                }

                if (this.x < 0 || this.x > canvas.width) {
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // パーティクルの初期化
        function initParticles() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        // アニメーションループ
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrame = requestAnimationFrame(animate);
        }

        // ウィンドウリサイズ時の処理
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        // スクロール時のキャンバス高さ更新
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (canvas.height !== document.documentElement.scrollHeight) {
                    resizeCanvas();
                }
            }, 100);
        });

        // 初期化
        resizeCanvas();
        initParticles();
        animate();

        // ページアンロード時のクリーンアップ
        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationFrame);
        });
    }

}); // DOMContentLoaded終了

// ========================================
// スクロール時のヘッダー背景変更
// ========================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    }
});
