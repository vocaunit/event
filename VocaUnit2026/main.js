document.addEventListener('DOMContentLoaded', () => {
    // === モバイルハンバーガーメニュー ===
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');

    // ハンバーガーメニューの開閉トグル
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // メニュー内のリンクが押されたら閉じる
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    // ====== イースターエッグ（キャラクターカラー変更） ======
    const vocaColors = {
        'miku': { primary: '#39c5bb', primaryLight: '#5ce1d6', secondary: '#ff2d55', secondaryLight: '#ff5c77', name: 'Hatsune Miku' },
        'rin': { primary: '#ffcc11', primaryLight: '#ffe066', secondary: '#f3f4f6', secondaryLight: '#ffffff', name: 'Kagamine Rin' },
        'len': { primary: '#ffee11', primaryLight: '#fff266', secondary: '#111111', secondaryLight: '#333333', name: 'Kagamine Len' },
        'luka': { primary: '#ffbacc', primaryLight: '#ffd6e0', secondary: '#ffeccc', secondaryLight: '#fff2e0', name: 'Megurine Luka' },
        'meiko': { primary: '#d80000', primaryLight: '#ff3333', secondary: '#412019', secondaryLight: '#663327', name: 'MEIKO' },
        'kaito': { primary: '#3366cc', primaryLight: '#5c8cff', secondary: '#ffffff', secondaryLight: '#f3f4f6', name: 'KAITO' },
        'gumi': { primary: '#33cc66', primaryLight: '#5ce68a', secondary: '#ff9900', secondaryLight: '#ffb347', name: 'GUMI' },
        'ia': { primary: '#ffccff', primaryLight: '#ffe6ff', secondary: '#cc99cc', secondaryLight: '#e6b3e6', name: 'IA' },
        'una': { primary: '#0055aa', primaryLight: '#3377cc', secondary: '#ffea00', secondaryLight: '#fff266', name: 'Otomachi Una' },
        'kafu': { primary: '#a3a6cd', primaryLight: '#c2c4de', secondary: '#eb8686', secondaryLight: '#f2abab', name: 'KAFU' },
    };

    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    let keyBuffer = '';
    const maxBufferLength = 20;
    
    // Glitch text element update
    const glitchText = document.querySelector('.glitch');

    window.addEventListener('keydown', (e) => {
        // Ignore keypresses if typing in input/textarea (like form)
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // 特殊キーなどで1文字以上なら無視（Shift, Ctrlなど）ただし矢印キーはコナミコマンドで使うため許可
        let key = e.key;
        if(key.length === 1) {
            key = key.toLowerCase();
        }

        keyBuffer += key;
        
        // バッファが長くなりすぎたら古いものを消す
        if (keyBuffer.length > maxBufferLength * 10) { 
            // 矢印キーが長いため余裕を持たせる
            keyBuffer = keyBuffer.slice(-maxBufferLength * 10);
        }

        const currentStr = keyBuffer.toLowerCase();
        
        // コナミコマンドのチェック (アローキーは小文字化されるので全て小文字で比較)
        const konamiStr = konamiCode.join('').toLowerCase();
        if (currentStr.endsWith(konamiStr)) {
            resetColors();
            showEasterEggMessage('COLORS RESET');
            keyBuffer = '';
            return;
        }

        // キャラクター名チェック
        for (const charName in vocaColors) {
            if (currentStr.endsWith(charName)) {
                applyCharacterTheme(vocaColors[charName]);
                showEasterEggMessage(`THEME: ${vocaColors[charName].name.toUpperCase()}`);
                keyBuffer = ''; // リセット
                
                // 画面を少し揺らすエフェクト
                document.body.classList.add('animate-pulse');
                setTimeout(() => document.body.classList.remove('animate-pulse'), 500);
                break;
            }
        }
    });

    function applyCharacterTheme(theme) {
        const root = document.documentElement;
        
        // Helper to convert hex to rgba
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
        };
        
        const primaryRgb = hexToRgb(theme.primary);
        const secondaryRgb = hexToRgb(theme.secondary);

        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-primary-light', theme.primaryLight);
        root.style.setProperty('--color-secondary', theme.secondary);
        root.style.setProperty('--color-secondary-light', theme.secondaryLight);
        root.style.setProperty('--color-primary-dark', `rgba(${primaryRgb}, 0.3)`);
        root.style.setProperty('--color-secondary-dark', `rgba(${secondaryRgb}, 0.3)`);
        
        // 背景のぼかし円の色も更新したい場合
        const blobs = document.querySelectorAll('.rounded-full.blur-\\[100px\\], .rounded-full.md\\:blur-\\[150px\\]');
        if(blobs.length >= 2) {
            blobs[0].style.backgroundColor = theme.primary;
            blobs[1].style.backgroundColor = theme.secondary;
        }
        
        if(glitchText) {
            glitchText.setAttribute('data-text', `VOCA UNIT - ${theme.name}`);
            glitchText.textContent = `VOCA UNIT`;
        }
    }

    function resetColors() {
        const root = document.documentElement;
        root.style.removeProperty('--color-primary');
        root.style.removeProperty('--color-primary-light');
        root.style.removeProperty('--color-secondary');
        root.style.removeProperty('--color-secondary-light');
        root.style.removeProperty('--color-primary-dark');
        root.style.removeProperty('--color-secondary-dark');
        
        const blobs = document.querySelectorAll('.rounded-full.blur-\\[100px\\], .rounded-full.md\\:blur-\\[150px\\]');
        if(blobs.length >= 2) {
            blobs[0].style.backgroundColor = '';
            blobs[1].style.backgroundColor = '';
        }
        
        if(glitchText) {
            glitchText.setAttribute('data-text', `VOCA UNIT`);
            glitchText.textContent = `VOCA UNIT`;
        }
    }

    function showEasterEggMessage(text) {
        let toast = document.getElementById('easter-egg-toast');
        
        // なければ新しく作る
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'easter-egg-toast';
            toast.className = 'fixed bottom-4 right-4 bg-black/80 border border-cyan-500/50 text-white px-4 py-2 rounded backdrop-blur font-cyber z-[100] shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2 text-sm opacity-0 transition-opacity duration-500';
            document.body.appendChild(toast);
        }

        // テキスト内容の更新 (もし「RESET」なら消す処理に分岐)
        if (text === 'COLORS RESET') {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
            setTimeout(() => {
                const oldToast = document.getElementById('easter-egg-toast');
                if(oldToast) oldToast.remove();
            }, 500); // フェードアウトを待ってから削除
            return;
        }

        // 常時表示時のデザインとテキスト
        toast.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-current animate-ping"></span> ${text}`;
        toast.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-light') || '#22d3ee';
        toast.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#06b6d4';

        // フェードインして表示し続ける
        requestAnimationFrame(() => {
            toast.classList.remove('opacity-0');
            toast.classList.add('opacity-100');
        });
    }

    // グローバルスコープからHTMLのonclickで呼び出せるように定義
    window.copyHashtag = function() {
        const textToCopy = '#VocaUnit2026';
        
        // クリップボードAPIを使用してコピー
        navigator.clipboard.writeText(textToCopy).then(() => {
            // コピー成功時のトースト通知
            const oldToast = document.getElementById('copy-toast');
            if (oldToast) oldToast.remove();

            const toast = document.createElement('div');
            toast.id = 'copy-toast';
            toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-cyan-900/90 border border-cyan-400 text-white px-6 py-3 rounded-full backdrop-blur font-body font-bold z-[100] transform transition-all duration-300 translate-y-10 opacity-0 shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center gap-2';
            
            toast.innerHTML = `
                <svg class="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                コピーしました！
            `;

            document.body.appendChild(toast);

            // アニメーション表示
            requestAnimationFrame(() => {
                toast.classList.remove('translate-y-10', 'opacity-0');
                toast.classList.add('translate-y-0', 'opacity-100');
            });

            // 2.5秒後に消す
            setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('translate-y-10', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 2500);
        }).catch(err => {
            console.error('コピーに失敗しました', err);
            alert('コピーに失敗しました。お手数ですが手動でコピーしてください。');
        });
    };
});
