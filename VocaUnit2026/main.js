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
            glitchText.setAttribute('data-text', `ボカユニット - ${theme.name}`);
            glitchText.textContent = `ボカユニット`;
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
            glitchText.setAttribute('data-text', `ボカユニット`);
            glitchText.textContent = `ボカユニット`;
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

    // ====== 本日の3本 (Today's 3 Videos) ======
    const videoGrid = document.getElementById('video-grid');
    if (videoGrid) {
        // TODO: Googleスプレッドシートの「ウェブに公開」→「カンマ区切り形式 (CSV)」のURLをここに入力してください。
        // 現在はダミーの空文字セットアップです。
        const SPREADSHEET_CSV_URL = '';

        if (!SPREADSHEET_CSV_URL) {
            videoGrid.innerHTML = `
                <div class="text-center col-span-3 text-cyan-500 py-10 font-cyber">
                    <!-- SPREADSHEET_CSV_URL is not configured -->
                    STAY TUNED...
                </div>
            `;
        } else {
            fetchVideosFromCSV(SPREADSHEET_CSV_URL);
        }
    }

    async function fetchVideosFromCSV(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const csvText = await response.text();
            
            // 簡易的なCSVパース（1行目はヘッダー想定）
            const rows = csvText.split('\n').map(row => row.trim()).filter(row => row.length > 0);
            if (rows.length <= 1) throw new Error('No data found');
            
            const dataRows = rows.slice(1);
            const selectedVideos = pickRandomVideos(dataRows, 3);
            renderVideos(selectedVideos);
        } catch (error) {
            console.error('Error fetching videos:', error);
            const errorMsg = document.getElementById('youtube-api-error');
            if(errorMsg) errorMsg.classList.remove('hidden');
            videoGrid.innerHTML = '';
        }
    }

    function pickRandomVideos(allRows, count) {
        // localStorage から履歴を取得
        let seenData = JSON.parse(localStorage.getItem('vocaunit_seen_videos') || '[]');
        const allIds = allRows.map((_, i) => i.toString());
        let unseenIds = allIds.filter(id => !seenData.includes(id));
        
        // 未表示の動画が指定数未満なら、履歴をリセットして一巡させる
        if (unseenIds.length < count) {
            seenData = []; // リセット
            unseenIds = allIds.filter(id => !seenData.includes(id));
        }
        
        let pickedRows = [];
        let pickedIds = [];
        
        // もし全体件数が count 未満の場合への対応
        const pickCount = Math.min(count, unseenIds.length);
        
        for (let i = 0; i < pickCount; i++) {
            const rIndex = Math.floor(Math.random() * unseenIds.length);
            const selectedId = unseenIds.splice(rIndex, 1)[0];
            pickedIds.push(selectedId);
            pickedRows.push(allRows[parseInt(selectedId)]);
        }
        
        // 履歴を保存
        localStorage.setItem('vocaunit_seen_videos', JSON.stringify([...seenData, ...pickedIds]));
        
        return pickedRows;
    }

    function renderVideos(videoRows) {
        if(!videoGrid) return;
        videoGrid.innerHTML = '';
        
        videoRows.forEach(row => {
            // 簡易カンマ分割
            const cols = row.split(',');
            // 汎用的に URL らしきものを探す
            const urlCol = cols.find(c => c.includes('http'));
            // もし配列長が3以上ならコラム2をタイトルと仮定
            const titleCol = cols.length > 2 ? cols[2] : (cols[1] || 'No Title');
            
            const displayUrl = urlCol ? urlCol.replace(/"/g, '').trim() : '#';
            const displayTitle = titleCol ? titleCol.replace(/"/g, '').trim() : 'Video';
            
            // YouTubeの場合のサムネイル取得
            let thumbnailUrl = '';
            let isYT = false;
            if (displayUrl.includes('youtube.com/watch') || displayUrl.includes('youtu.be/')) {
                isYT = true;
                const ytMatch = displayUrl.match(/(?:v=|youtu\.be\/)([^&]+)/);
                if (ytMatch && ytMatch[1]) {
                    thumbnailUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
                }
            }
            
            const thumbHtml = isYT && thumbnailUrl 
                ? `<img src="${thumbnailUrl}" alt="${displayTitle}" class="w-full h-48 object-cover rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity">`
                : `<div class="w-full h-48 bg-dark flex items-center justify-center rounded-t-lg border-b border-cyan-900/50">
                     <span class="text-cyan-500 font-cyber font-bold tracking-widest text-sm">VIDEO LINK</span>
                   </div>`;

            const card = document.createElement('a');
            card.href = displayUrl;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.className = 'group bg-panel/80 backdrop-blur border border-cyan-900/60 rounded-lg hover:border-cyan-400/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all overflow-hidden flex flex-col h-full hover:-translate-y-1 block';
            card.innerHTML = `
                ${thumbHtml}
                <div class="p-5 flex-grow flex flex-col justify-between">
                    <h4 class="font-bold text-gray-200 group-hover:text-white line-clamp-2 mb-3 leading-snug">${displayTitle}</h4>
                    <div class="flex items-center text-cyan-400 text-sm font-cyber mt-auto group-hover:text-cyan-300">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        WATCH
                    </div>
                </div>
            `;
            videoGrid.appendChild(card);
        });
    }
});
