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
                this.opacity = Math.random() * 0.6 + 0.2;
                // カラーバリエーション
                const colors = [
                    [255, 255, 255], // 白
                    [238, 119, 82],  // オレンジ
                    [231, 60, 126],  // ピンク
                    [35, 166, 213],  // ブルー
                    [35, 213, 171],  // エメラルド
                    [240, 147, 251], // パープル
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulsePhase = Math.random() * Math.PI * 2;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.size = Math.random() * 4 + 1;
                this.speedY = Math.random() * 0.8 + 0.3;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.6 + 0.2;
                // 新しい色を設定
                const colors = [
                    [255, 255, 255],
                    [238, 119, 82],
                    [231, 60, 126],
                    [35, 166, 213],
                    [35, 213, 171],
                    [240, 147, 251],
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.pulsePhase += this.pulseSpeed;

                // 画面外に出たらリセット
                if (this.y > canvas.height) {
                    this.reset();
                }

                if (this.x < 0 || this.x > canvas.width) {
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                // パルス効果
                const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
                const currentSize = this.size * pulse;
                const currentOpacity = this.opacity * pulse;

                // グロー効果
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, currentSize * 2
                );
                gradient.addColorStop(0, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${currentOpacity})`);
                gradient.addColorStop(0.5, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${currentOpacity * 0.5})`);
                gradient.addColorStop(1, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0)`);

                ctx.beginPath();
                ctx.arc(this.x, this.y, currentSize * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // コア
                ctx.beginPath();
                ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${currentOpacity})`;
                ctx.fill();
            }
        }

        // パーティクルの初期化
        function initParticles() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
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
