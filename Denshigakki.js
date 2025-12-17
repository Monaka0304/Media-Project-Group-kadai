// ========================================
// DOM読み込み完了を待つ（統合版 - パフォーマンス最適化）
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
    // パーティクルアニメーション背景（泡のような控えめな演出）
    // ========================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;
        let reasonSectionTop = 0;

        // キャンバスサイズの設定
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;

            // #reason セクションの位置を取得
            const reasonSection = document.getElementById('reason');
            if (reasonSection) {
                reasonSectionTop = reasonSection.offsetTop;
            }
        }

        // 泡のようなパーティクルクラス
        class Bubble {
            constructor() {
                this.reset();
                // 初期位置をランダムに設定（#reason以降の範囲）
                this.y = reasonSectionTop + Math.random() * (canvas.height - reasonSectionTop);
                this.opacity = Math.random() * 0.15 + 0.1; // 控えめな透明度
                this.pulseSpeed = Math.random() * 0.01 + 0.005;
                this.pulsePhase = Math.random() * Math.PI * 2;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                // 画面下部からスタート
                this.y = canvas.height + 10;
                // 泡らしいサイズ（小さめ〜中くらい）
                this.baseSize = Math.random() * 8 + 3;
                this.size = this.baseSize;
                // ゆっくり上昇（泡が浮かぶイメージ）
                this.speedY = -(Math.random() * 0.5 + 0.3);
                // 横方向の揺れ
                this.speedX = Math.random() * 0.3 - 0.15;
                this.swayAmount = Math.random() * 0.5 + 0.2;
                this.swaySpeed = Math.random() * 0.02 + 0.01;
                this.swayPhase = Math.random() * Math.PI * 2;
                // 控えめな透明度
                this.opacity = Math.random() * 0.15 + 0.1;
                // 白系の色（泡らしい）
                this.color = [255, 255, 255]; // 純白
            }

            update() {
                // 上昇
                this.y += this.speedY;

                // 横揺れ（サイン波）
                this.swayPhase += this.swaySpeed;
                this.x += Math.sin(this.swayPhase) * this.swayAmount;

                // パルス効果（泡の膨張・縮小）
                this.pulsePhase += this.pulseSpeed;
                const pulseFactor = Math.sin(this.pulsePhase) * 0.2 + 1;
                this.size = this.baseSize * pulseFactor;

                // #reason セクションより上に到達したらリセット
                if (this.y < reasonSectionTop - 10) {
                    this.reset();
                }

                // 左右の端に到達したら位置を調整
                if (this.x < -10) {
                    this.x = canvas.width + 10;
                } else if (this.x > canvas.width + 10) {
                    this.x = -10;
                }
            }

            draw() {
                // #reason セクションより上では描画しない
                if (this.y < reasonSectionTop) {
                    return;
                }

                // 泡のグラデーション効果（控えめ）
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.8})`);
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.4})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

                // 外側のグロー
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // 泡本体
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();

                // 泡のハイライト（光沢）
                const highlightGradient = ctx.createRadialGradient(
                    this.x - this.size * 0.3, this.y - this.size * 0.3, 0,
                    this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.5
                );
                highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 1.5})`);
                highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

                ctx.beginPath();
                ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = highlightGradient;
                ctx.fill();
            }
        }

        // パーティクルの初期化
        function initParticles() {
            particles = [];
            // 控えめな数（画面サイズに応じて調整）
            const particleCount = Math.min(25, Math.floor((canvas.width * canvas.height) / 60000));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Bubble());
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

        // ウィンドウリサイズ時の処理（デバウンス付き）
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                initParticles();
            }, 200);
        });

        // スクロール時のキャンバス高さ更新
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const newHeight = document.documentElement.scrollHeight;
                if (canvas.height !== newHeight) {
                    canvas.height = newHeight;
                }
            }, 150);
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

    // ========================================
    // ページトップへ戻るボタン
    // ========================================
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'ページトップへ戻る');
    document.body.appendChild(scrollTopBtn);

    // クリックでトップへ
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========================================
    // 読み進み度プログレスバー
    // ========================================
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    document.body.appendChild(progressBar);

    // ========================================
    // スクロールアニメーション（フェードイン）
    // ========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // セクションをアニメーション
    document.querySelectorAll('section:not(#home)').forEach(section => {
        section.classList.add('fade-element');
        fadeInObserver.observe(section);
    });

    // カード類をアニメーション（遅延を削減）
    document.querySelectorAll('.member-card, .method-card, .tech-card, .timeline-item').forEach((card, index) => {
        card.classList.add('fade-element');
        card.style.transitionDelay = `${Math.min(index * 0.05, 0.3)}s`; // 遅延を短縮
        fadeInObserver.observe(card);
    });

}); // DOMContentLoaded終了

// ========================================
// スクロールイベント（統合版 - パフォーマンス最適化）
// ========================================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const header = document.querySelector('.main-header');
            const scrollTopBtn = document.getElementById('scroll-top-btn');
            const progressBar = document.getElementById('reading-progress');

            // ヘッダーの影変更
            if (header) {
                if (scrollY > 100) {
                    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                } else {
                    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }
            }

            // トップボタンの表示/非表示
            if (scrollTopBtn) {
                if (scrollY > 500) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            }

            // プログレスバーの更新
            if (progressBar) {
                const winScroll = document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + '%';
            }

            ticking = false;
        });

        ticking = true;
    }
});
