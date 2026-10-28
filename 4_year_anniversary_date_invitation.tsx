import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Heart,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Send,
  Calendar,
  Utensils,
  Camera,
  Shirt,
  Cake,
  X,
  PartyPopper,
  Flame,
  Coffee,
  Palette,
  Film,
  Sparkle
} from 'lucide-react';

/**
 * ============================================================================
 * 1. FLOATING ROMANTIC BACKGROUND (Nền hạt sáng, cánh hoa & trái tim pastel)
 * ============================================================================
 */
const FloatingBackground = () => {
  const particles = useMemo(() => {
    const items = ['💗', '✨', '🌸', '💖', '🌷', '💕', '🫧', '⭐'];
    return Array.from({ length: 22 }, (_, index) => ({
      id: index,
      symbol: items[index % items.length],
      left: `${(index * 16 + 5) % 92 + 4}%`,
      size: 14 + (index % 4) * 5,
      duration: 11 + (index % 6) * 2.5,
      delay: -(index * 1.4),
      opacity: 0.22 + (index % 3) * 0.15,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
      {/* Quầng sáng pastel dịu mắt */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pink-200/45 blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-28 w-80 h-80 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute -bottom-28 left-1/4 w-96 h-96 rounded-full bg-amber-100/60 blur-3xl" />

      {/* Các hạt bay lơ lửng */}
      {particles.map((item) => (
        <span
          key={item.id}
          className="floating-particle absolute inline-block"
          style={{
            left: item.left,
            fontSize: `${item.size}px`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            opacity: item.opacity,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
};

/**
 * ============================================================================
 * 2. CELEBRATION BURST (Hiệu ứng pháo hoa trái tim khi ấn "Có 💖")
 * ============================================================================
 */
const CelebrationHearts = ({ active }) => {
  const burstItems = useMemo(() => {
    const icons = ['💖', '💗', '💕', '✨', '🌸', '💘', '🥰', '🎉'];
    return Array.from({ length: 36 }, (_, idx) => {
      const angle = (idx / 36) * Math.PI * 2;
      const distance = 95 + (idx % 6) * 40;
      return {
        id: idx,
        icon: icons[idx % icons.length],
        tx: `${Math.cos(angle) * distance}px`,
        ty: `${Math.sin(angle) * distance - 60}px`,
        rot: `${(idx % 2 === 0 ? 1 : -1) * (20 + (idx % 4) * 25)}deg`,
        delay: `${(idx % 5) * 0.05}s`,
        size: 18 + (idx % 3) * 8,
      };
    });
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden" aria-hidden="true">
      {burstItems.map((particle) => (
        <span
          key={particle.id}
          className="celebration-heart absolute select-none"
          style={{
            fontSize: `${particle.size}px`,
            '--tx': particle.tx,
            '--ty': particle.ty,
            '--rot': particle.rot,
            animationDelay: particle.delay,
          }}
        >
          {particle.icon}
        </span>
      ))}
    </div>
  );
};

/**
 * ============================================================================
 * 3. PAGE 1: LỜI MỜI ĐI CHƠI (AnniversaryQuestion)
 * ============================================================================
 */
const AnniversaryQuestion = ({ onAcceptSuccess }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [noBtnPos, setNoBtnPos] = useState(null);
  const [dodgeCount, setDodgeCount] = useState(0);

  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);
  const dodgeLockRef = useRef(0);

  const playfulHints = [
    'Ơ kìa, sao lại định bấm Không thế? 🥺',
    'Nút Không ngại lắm, đừng đuổi theo nữa nha! 🏃‍♂️💨',
    'Hihi không bấm được đâu, bấm nút "Có 💖" đi mà! ✨',
    '4 năm bên nhau rồi, chỉ có thể chọn "Có 💖" thôi! 🥰',
    'Nút "Có 💖" đang đợi em kìa! 💗',
  ];

  // Tính toán vị trí ngẫu nhiên an toàn tuyệt đối cho nút "Không 🙈"
  const moveNoButtonSafely = useCallback(
    (pointerClientX = null, pointerClientY = null) => {
      if (isAccepted) return;

      const now = performance.now();
      if (now - dodgeLockRef.current < 40) return;
      dodgeLockRef.current = now;

      const noEl = noBtnRef.current;
      const yesEl = yesBtnRef.current;
      if (!noEl) return;

      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      const noRect = noEl.getBoundingClientRect();
      const btnWidth = noRect.width || 135;
      const btnHeight = noRect.height || 52;

      const SAFE_MARGIN = 20;
      const minX = SAFE_MARGIN;
      const maxX = Math.max(SAFE_MARGIN, viewportW - btnWidth - SAFE_MARGIN);
      const minY = SAFE_MARGIN;
      const maxY = Math.max(SAFE_MARGIN, viewportH - btnHeight - SAFE_MARGIN);

      // Vùng cấm quanh nút "Có 💖"
      const yesRect = yesEl
        ? yesEl.getBoundingClientRect()
        : { left: viewportW / 2 - 80, right: viewportW / 2 + 80, top: viewportH / 2, bottom: viewportH / 2 + 60 };
      const YES_SAFE_PADDING = 34;

      const forbiddenZone = {
        left: yesRect.left - YES_SAFE_PADDING,
        right: yesRect.right + YES_SAFE_PADDING,
        top: yesRect.top - YES_SAFE_PADDING,
        bottom: yesRect.bottom + YES_SAFE_PADDING,
      };

      const currentX = noBtnPos ? noBtnPos.x : noRect.left;
      const currentY = noBtnPos ? noBtnPos.y : noRect.top;

      let chosenX = minX;
      let chosenY = minY;
      let foundValidSpot = false;

      for (let attempt = 0; attempt < 35; attempt++) {
        const candidateX = minX + Math.random() * (maxX - minX);
        const candidateY = minY + Math.random() * (maxY - minY);
        const candidateRight = candidateX + btnWidth;
        const candidateBottom = candidateY + btnHeight;

        // Tránh che nút Có
        const overlapsYes =
          candidateX < forbiddenZone.right &&
          candidateRight > forbiddenZone.left &&
          candidateY < forbiddenZone.bottom &&
          candidateBottom > forbiddenZone.top;

        if (overlapsYes) continue;

        // Tránh ngay đầu ngón tay / con trỏ
        if (pointerClientX !== null && pointerClientY !== null) {
          const distToPointer = Math.hypot(
            candidateX + btnWidth / 2 - pointerClientX,
            candidateY + btnHeight / 2 - pointerClientY
          );
          if (distToPointer < 110) continue;
        }

        // Đảm bảo khoảng cách di chuyển đủ xa
        const distFromPrev = Math.hypot(candidateX - currentX, candidateY - currentY);
        if (distFromPrev < 70 && attempt < 25) continue;

        chosenX = Math.round(candidateX);
        chosenY = Math.round(candidateY);
        foundValidSpot = true;
        break;
      }

      if (!foundValidSpot) {
        chosenX = Math.round(minX + Math.random() * (maxX - minX));
        chosenY = Math.round(minY + Math.random() * (maxY - minY));
      }

      const clampedX = Math.min(Math.max(chosenX, minX), maxX);
      const clampedY = Math.min(Math.max(chosenY, minY), maxY);

      setNoBtnPos({ x: clampedX, y: clampedY });
      setDodgeCount((prev) => prev + 1);
    },
    [isAccepted, noBtnPos]
  );

  // Resize handler giữ nút trong màn hình
  useEffect(() => {
    if (!noBtnPos) return;
    const handleResize = () => {
      const noEl = noBtnRef.current;
      if (!noEl) return;
      const btnW = noEl.offsetWidth || 135;
      const btnH = noEl.offsetHeight || 52;
      const margin = 20;

      const maxX = Math.max(margin, window.innerWidth - btnW - margin);
      const maxY = Math.max(margin, window.innerHeight - btnH - margin);

      setNoBtnPos((prev) => (prev ? {
        x: Math.min(Math.max(prev.x, margin), maxX),
        y: Math.min(Math.max(prev.y, margin), maxY),
      } : null));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [noBtnPos]);

  // Cảm biến con trỏ chuột trên desktop
  const handleMouseMove = useCallback(
    (e) => {
      if (isAccepted || !noBtnRef.current) return;
      if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

      const rect = noBtnRef.current.getBoundingClientRect();
      const distance = Math.hypot(
        e.clientX - (rect.left + rect.width / 2),
        e.clientY - (rect.top + rect.height / 2)
      );
      if (distance < 70) {
        moveNoButtonSafely(e.clientX, e.clientY);
      }
    },
    [isAccepted, moveNoButtonSafely]
  );

  const handleYesClick = () => {
    if (isAccepted) return;
    setIsAccepted(true);
    setTimeout(() => setIsExiting(true), 1800);
    setTimeout(() => {
      if (typeof onAcceptSuccess === 'function') {
        onAcceptSuccess();
      }
    }, 2300);
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className={`relative w-screen h-screen overflow-hidden flex items-center justify-center px-4 select-none transition-all duration-500 ease-in-out ${
        isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <CelebrationHearts active={isAccepted} />

      <section className="relative z-10 w-full max-w-lg mx-auto bg-white/85 backdrop-blur-md border border-pink-200/80 rounded-[2.2rem] shadow-[0_20px_60px_-15px_rgba(244,114,182,0.3)] px-6 py-9 sm:px-10 sm:py-12 text-center transition-all duration-500">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 via-rose-50 to-amber-50 border border-pink-200/80 text-rose-600 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Happy 4th Anniversary 🥂✨</span>
        </div>

        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-200/50 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 flex items-center justify-center shadow-lg shadow-rose-200">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-white animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <span className="absolute -top-1 -right-1 text-xl sm:text-2xl animate-pulse">💖</span>
          <span className="absolute -bottom-1 -left-1 text-lg sm:text-xl animate-pulse">🌸</span>
        </div>

        <h1 className="font-romantic-title text-2xl sm:text-4xl font-extrabold text-rose-900 leading-snug sm:leading-tight mb-3">
          Em có muốn đi anni với anh không? 💗
        </h1>

        <p className="text-sm sm:text-base text-rose-700/85 font-medium mb-8 max-w-md mx-auto leading-relaxed">
          Anh có một bất ngờ dành cho em...
        </p>

        {isAccepted ? (
          <div className="py-4 px-5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border border-pink-200 shadow-inner animate-fade-in">
            <p className="text-xl sm:text-2xl font-bold text-rose-600 mb-1">
              Yayyy! Anh biết mà! 💕
            </p>
            <p className="text-xs sm:text-sm text-rose-500 font-medium">
              Đang mở phần chuẩn bị cho buổi hẹn hò của hai đứa mình... ✨
            </p>
          </div>
        ) : (
          <>
            <div className="relative flex flex-row items-center justify-center gap-4 sm:gap-6 min-h-[64px]">
              <button
                ref={yesBtnRef}
                type="button"
                onClick={handleYesClick}
                style={{
                  transform: `scale(${Math.min(1 + dodgeCount * 0.03, 1.18)})`,
                }}
                className="yes-btn-pulse relative z-20 inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full font-bold text-base sm:text-lg text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:via-pink-600 hover:to-rose-500 active:scale-95 shadow-[0_10px_25px_-5px_rgba(244,63,94,0.55)] cursor-pointer focus:outline-none focus:ring-4 focus:ring-rose-300 transition-all duration-300"
              >
                <span>Có 💖</span>
              </button>

              {noBtnPos && (
                <div className="w-[132px] h-[52px] pointer-events-none opacity-0" aria-hidden="true" />
              )}

              {!noBtnPos && (
                <button
                  ref={noBtnRef}
                  type="button"
                  onMouseEnter={(e) => moveNoButtonSafely(e.clientX, e.clientY)}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    moveNoButtonSafely(e.clientX, e.clientY);
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const touch = e.touches && e.touches[0];
                    moveNoButtonSafely(touch ? touch.clientX : null, touch ? touch.clientY : null);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    moveNoButtonSafely(e.clientX, e.clientY);
                  }}
                  tabIndex={-1}
                  className="relative z-20 inline-flex items-center justify-center gap-1.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 shadow-sm transition-all duration-200 cursor-pointer select-none"
                >
                  <span>Không 🙈</span>
                </button>
              )}
            </div>

            <div className="mt-5 min-h-[24px] flex items-center justify-center">
              {dodgeCount > 0 && (
                <p className="text-xs sm:text-sm font-medium text-rose-500/90 animate-bounce">
                  {playfulHints[(dodgeCount - 1) % playfulHints.length]}
                </p>
              )}
            </div>
          </>
        )}
      </section>

      {/* Nút "Không 🙈" tự do trên màn hình */}
      {!isAccepted && noBtnPos && (
        <button
          ref={noBtnRef}
          type="button"
          onMouseEnter={(e) => moveNoButtonSafely(e.clientX, e.clientY)}
          onPointerDown={(e) => {
            e.preventDefault();
            moveNoButtonSafely(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches && e.touches[0];
            moveNoButtonSafely(touch ? touch.clientX : null, touch ? touch.clientY : null);
          }}
          onClick={(e) => {
            e.preventDefault();
            moveNoButtonSafely(e.clientX, e.clientY);
          }}
          tabIndex={-1}
          style={{
            position: 'fixed',
            left: `${noBtnPos.x}px`,
            top: `${noBtnPos.y}px`,
            transition: 'left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.2s ease',
          }}
          className="z-30 inline-flex items-center justify-center gap-1.5 px-7 py-3.5 rounded-full font-bold text-base sm:text-lg text-rose-600 bg-white/95 hover:bg-rose-50 border-2 border-rose-300 shadow-[0_10px_25px_-5px_rgba(244,114,182,0.45)] cursor-pointer select-none whitespace-nowrap"
        >
          <span>Không 🙈</span>
        </button>
      )}
    </main>
  );
};

/**
 * ============================================================================
 * 4. DỮ LIỆU CÁC HẠNG MỤC CHO PAGE 2
 * ============================================================================
 */
const ANNIVERSARY_OPTIONS = {
  dressCode: {
    id: 'dressCode',
    title: 'Gợi ý Dress Code / Trang phục',
    icon: Shirt,
    type: 'single',
    items: [
      { id: 'dc_fairy', title: 'Nàng thơ dịu dàng', desc: 'Váy hoa/voan thướt tha, tone pastel ngọt ngào 🌸', emoji: '👗' },
      { id: 'dc_tone', title: 'Tone-sur-tone thanh lịch', desc: 'Trang phục đồng điệu, matchy-matchy cực xịn 🤍', emoji: '✨' },
      { id: 'dc_active', title: 'Thoải mái năng động', desc: 'Áo đôi, sneaker & outfit dễ dàng di chuyển 👟', emoji: '👟' },
      { id: 'dc_vintage', title: 'Vintage cổ điển', desc: 'Phong cách retro ấm áp, chụp hình siêu thơ 🎞️', emoji: '🤎' },
    ],
  },
  dinner: {
    id: 'dinner',
    title: 'Bữa tối lãng mạn',
    icon: Utensils,
    type: 'single',
    items: [
      { id: 'dn_steak', title: 'Bò bít tết & Pasta nến lung linh', desc: 'Không gian ấm cúng, vang đỏ và ánh nến lãng mạn 🍷', emoji: '🥩' },
      { id: 'dn_hotpot', title: 'Lẩu nướng ấm cúng trò chuyện', desc: 'Xì xèo ấm cúng, vừa ăn vừa tâm sự thỏa thích 🍲', emoji: '🥘' },
      { id: 'dn_sushi', title: 'Sushi & Đồ Nhật tươi ngon', desc: 'Tinh tế, thanh nhẹ và đúng chuẩn món em thích 🍣', emoji: '🍣' },
      { id: 'dn_memory', title: 'Quán quen kỷ niệm', desc: 'Nơi gắn liền với những ngày đầu mới yêu nhau 🛵', emoji: '🍝' },
    ],
  },
  activities: {
    id: 'activities',
    title: 'Hoạt động chúng mình cùng làm',
    icon: Camera,
    type: 'multiple',
    items: [
      { id: 'ac_photo', title: 'Chụp photobooth lưu giữ khoảnh khắc', desc: 'Chụp ảnh dán film, lấy ảnh liền dán sổ kỷ niệm 📸', emoji: '📸' },
      { id: 'ac_walk', title: 'Đi dạo phố & Cà phê chill ngắm cảnh', desc: 'Tận hưởng gió mát, tâm sự dưới ánh đèn đêm ☕', emoji: '🌆' },
      { id: 'ac_movie', title: 'Xem phim rạp suất tối', desc: 'Ngồi cạnh nhau cùng xem bộ phim cả hai cùng thích 🍿', emoji: '🎬' },
      { id: 'ac_workshop', title: 'Workshop làm đồ lưu niệm đôi', desc: 'Tự tay làm gốm / nến thơm / nhẫn đôi ý nghĩa 🎨', emoji: '🎨' },
    ],
  },
  dessert: {
    id: 'dessert',
    title: 'Tráng miệng & Ngọt ngào',
    icon: Cake,
    type: 'single',
    items: [
      { id: 'ds_cake', title: 'Bánh kem mini 4th Anniversary', desc: 'Bánh kem viết tên 2 đứa, thổi nến cầu nguyện 🎂', emoji: '🎂' },
      { id: 'ds_milktea', title: 'Trà sữa full topping', desc: 'Ngọt ngào gấp đôi với hương vị mà em mê nhất 🧋', emoji: '🧋' },
      { id: 'ds_icecream', title: 'Kem hoa quả mát lạnh', desc: 'Tươi mát, thanh ngọt tròn vị cho một buổi tối trọn vẹn 🍨', emoji: '🍨' },
    ],
  },
};

/**
 * ============================================================================
 * 5. PAGE 2: KẾ HOẠCH HẸN HÒ KỶ NIỆM (PageTwoSurprise)
 * ============================================================================
 */
const PageTwoSurprise = ({ onBackToPageOne }) => {
  // Trạng thái lưu trữ lựa chọn của người dùng
  const [selections, setSelections] = useState({
    dressCode: 'dc_fairy', // Mặc định gợi ý đầu tiên
    dinner: 'dn_steak',
    activities: ['ac_photo', 'ac_walk'], // Mặc định 2 hoạt động
    dessert: 'ds_cake',
  });

  // Trạng thái modal popup chốt kèo
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Xử lý chọn mục single-select hoặc multiple-select
  const handleToggleItem = (categoryKey, itemId, isMulti) => {
    setSelections((prev) => {
      if (isMulti) {
        const currentList = prev[categoryKey] || [];
        const exists = currentList.includes(itemId);
        let updated;
        if (exists) {
          // Cho phép bỏ chọn nhưng tối thiểu giữ 1 hoạt động
          if (currentList.length === 1) return prev;
          updated = currentList.filter((id) => id !== itemId);
        } else {
          updated = [...currentList, itemId];
        }
        return { ...prev, [categoryKey]: updated };
      }
      return { ...prev, [categoryKey]: itemId };
    });
  };

  // Helper lấy tên hiển thị từ id
  const getItemTitle = (categoryKey, id) => {
    const found = ANNIVERSARY_OPTIONS[categoryKey]?.items.find((item) => item.id === id);
    return found ? `${found.emoji} ${found.title}` : '';
  };

  // Tạo nội dung văn bản để copy gửi qua Messenger/Zalo
  const planSummaryText = useMemo(() => {
    const dc = getItemTitle('dressCode', selections.dressCode);
    const dn = getItemTitle('dinner', selections.dinner);
    const acs = (selections.activities || [])
      .map((id) => getItemTitle('activities', id))
      .join(', ');
    const ds = getItemTitle('dessert', selections.dessert);

    return `💌 KẾ HOẠCH HẸN HÒ KỶ NIỆM 4 NĂM YÊU NHAU 💖\n\n👗 Trang phục: ${dc}\n🍽️ Bữa tối: ${dn}\n📸 Hoạt động: ${acs}\n🍰 Tráng miệng: ${ds}\n\nEm đã chốt kèo rồi nhé anh người yêu ơi! Hẹn gặp anh tối hôm đó nha! 🥰🥂`;
  }, [selections]);

  const handleCopyPlan = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(planSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto overflow-x-hidden pt-8 pb-16 px-4 sm:px-6 z-10 animate-page-two-enter">
      <div className="max-w-4xl mx-auto">
        {/* Header PAGE 2 */}
        <header className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-600 text-xs sm:text-sm font-bold mb-3 border border-pink-200">
            <Sparkle className="w-4 h-4 fill-rose-500 text-rose-500 animate-spin" style={{ animationDuration: '7s' }} />
            <span>Kỷ niệm 4 năm yêu nhau • 4 Years of Love</span>
          </div>

          <h1 className="font-romantic-title text-2xl sm:text-4xl font-extrabold text-rose-950 mb-3 tracking-tight">
            Chuẩn bị cho buổi anni 💐
          </h1>

          <p className="text-sm sm:text-base text-rose-700/90 font-medium max-w-xl mx-auto leading-relaxed">
            Em hãy bấm vào và lựa chọn những thứ em thích cho buổi kỉ niệm nhé.
          </p>
        </header>

        {/* Danh sách 4 Hạng mục lựa chọn */}
        <div className="space-y-8">
          {Object.entries(ANNIVERSARY_OPTIONS).map(([catKey, category]) => {
            const IconComponent = category.icon;
            const isMulti = category.type === 'multiple';

            return (
              <section
                key={catKey}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-pink-100 shadow-[0_12px_35px_-10px_rgba(244,114,182,0.18)]"
              >
                {/* Tiêu đề hạng mục */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-100/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-sm">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-rose-900 font-romantic-title">
                      {category.title}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-pink-200">
                    {isMulti ? 'Có thể chọn nhiều 💖' : 'Chọn 1 mục 🌸'}
                  </span>
                </div>

                {/* Các thẻ lựa chọn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {category.items.map((item) => {
                    const isSelected = isMulti
                      ? (selections[catKey] || []).includes(item.id)
                      : selections[catKey] === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleItem(catKey, item.id, isMulti)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-3.5 select-none ${
                          isSelected
                            ? 'bg-gradient-to-br from-rose-50 to-pink-50/80 border-rose-400 shadow-[0_8px_20px_-6px_rgba(244,63,94,0.28)] ring-1 ring-rose-400 scale-[1.01]'
                            : 'bg-white/70 hover:bg-rose-50/50 border-pink-100 hover:border-pink-200'
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl shrink-0 mt-0.5">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-sm sm:text-base text-rose-950">
                              {item.title}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 fill-rose-50" />
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-rose-700/80 mt-1 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Phần TỔNG HỢP LỰA CHỌN: Danh sách hẹn hò của chúng mình */}
        <section className="mt-9 bg-gradient-to-br from-rose-50/90 via-pink-50/80 to-amber-50/60 rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-lg text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-romantic-title text-xl sm:text-2xl font-bold text-rose-900 flex items-center justify-center sm:justify-start gap-2">
                <span>Danh sách hẹn hò của chúng mình</span>
                <span>✨</span>
              </h3>
              <p className="text-xs sm:text-sm text-rose-600/85 mt-1">
                Tất cả đã được lưu lại, chỉ chờ em chốt kèo với anh thôi!
              </p>
            </div>

            {/* Nút chốt kèo gửi cho anh */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 active:scale-95 shadow-[0_10px_25px_-5px_rgba(244,63,94,0.45)] cursor-pointer transition-all duration-200"
            >
              <Send className="w-5 h-5" />
              <span>Chốt kèo gửi cho anh 💌</span>
            </button>
          </div>

          {/* Grid tóm tắt nhanh các mục đã chọn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 bg-white/80 rounded-2xl border border-pink-200/70">
              <span className="text-xs font-semibold text-rose-500 block mb-1">👗 Trang phục:</span>
              <p className="text-xs sm:text-sm font-bold text-rose-900 truncate">
                {getItemTitle('dressCode', selections.dressCode)}
              </p>
            </div>

            <div className="p-3.5 bg-white/80 rounded-2xl border border-pink-200/70">
              <span className="text-xs font-semibold text-rose-500 block mb-1">🍽️ Bữa tối:</span>
              <p className="text-xs sm:text-sm font-bold text-rose-900 truncate">
                {getItemTitle('dinner', selections.dinner)}
              </p>
            </div>

            <div className="p-3.5 bg-white/80 rounded-2xl border border-pink-200/70">
              <span className="text-xs font-semibold text-rose-500 block mb-1">📸 Hoạt động ({selections.activities.length}):</span>
              <p className="text-xs sm:text-sm font-bold text-rose-900 truncate">
                {selections.activities.map((id) => getItemTitle('activities', id)).join(', ')}
              </p>
            </div>

            <div className="p-3.5 bg-white/80 rounded-2xl border border-pink-200/70">
              <span className="text-xs font-semibold text-rose-500 block mb-1">🍰 Tráng miệng:</span>
              <p className="text-xs sm:text-sm font-bold text-rose-900 truncate">
                {getItemTitle('dessert', selections.dessert)}
              </p>
            </div>
          </div>

          {/* Nút xem lại Page 1 */}
          <div className="mt-6 pt-5 border-t border-pink-200/60 flex items-center justify-center">
            <button
              type="button"
              onClick={onBackToPageOne}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 bg-white/70 hover:bg-white px-5 py-2.5 rounded-full border border-pink-200 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Quay lại xem lại Page 1</span>
            </button>
          </div>
        </section>
      </div>

      {/* =========================================================================
       * MODAL POPUP CHÚC MỪNG KỶ NIỆM 4 NĂM NGỌT NGÀO
       * ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-rose-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-pink-200 text-center animate-scale-up">
            {/* Nút đóng modal */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon chúc mừng */}
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 flex items-center justify-center text-white shadow-lg shadow-rose-200 mb-4">
              <PartyPopper className="w-8 h-8" />
            </div>

            <h3 className="font-romantic-title text-xl sm:text-2xl font-extrabold text-rose-950 mb-2">
              Kế hoạch Anni 4 Năm Đã Chốt! 🎉💖
            </h3>

            <p className="text-xs sm:text-sm text-rose-700/85 mb-5 leading-relaxed">
              Cảm ơn em vì 4 năm qua đã luôn đồng hành, yêu thương và mang lại bao nụ cười cho anh. Mọi thứ em chọn anh sẽ chuẩn bị thật chu đáo cho công chúa của anh! 🥰✨
            </p>

            {/* Hộp tóm tắt đẹp mắt bên trong modal */}
            <div className="bg-rose-50/70 border border-pink-200 rounded-2xl p-4 text-left text-xs sm:text-sm text-rose-900 space-y-2 mb-6">
              <p>👗 <span className="font-semibold text-rose-700">Trang phục:</span> {getItemTitle('dressCode', selections.dressCode)}</p>
              <p>🍽️ <span className="font-semibold text-rose-700">Bữa tối:</span> {getItemTitle('dinner', selections.dinner)}</p>
              <p>📸 <span className="font-semibold text-rose-700">Hoạt động:</span> {selections.activities.map((id) => getItemTitle('activities', id)).join(', ')}</p>
              <p>🍰 <span className="font-semibold text-rose-700">Tráng miệng:</span> {getItemTitle('dessert', selections.dessert)}</p>
            </div>

            {/* Các nút hành động */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                type="button"
                onClick={handleCopyPlan}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md cursor-pointer transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép tin nhắn! 💕' : 'Sao chép gửi cho anh 📋'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onBackToPageOne();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full font-bold text-sm text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Xem lại Page 1</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * ============================================================================
 * 6. ROOT APP COMPONENT (Điều phối chuyển trang và cấu hình font/CSS)
 * ============================================================================
 */
export default function App() {
  const [currentStep, setCurrentStep] = useState('PAGE_1');

  const navigateToPageTwo = useCallback(() => {
    setCurrentStep('PAGE_2');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToPageOne = useCallback(() => {
    setCurrentStep('PAGE_1');
  }, []);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-[#fff5f7] via-[#ffe4ec] to-[#fff8eb] font-romantic-body text-rose-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800&family=Quicksand:wght@500;600;700&display=swap');

        .font-romantic-title {
          font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .font-romantic-body {
          font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes floatUpSoft {
          0% {
            transform: translateY(105vh) rotate(0deg) scale(0.85);
          }
          50% {
            transform: translateY(50vh) rotate(180deg) scale(1.05);
          }
          100% {
            transform: translateY(-15vh) rotate(360deg) scale(0.9);
          }
        }

        .floating-particle {
          top: 0;
          animation-name: floatUpSoft;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        @keyframes softPulseGlow {
          0%, 100% {
            box-shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.55), 0 0 0 0 rgba(244, 114, 182, 0.45);
          }
          50% {
            box-shadow: 0 14px 30px -5px rgba(244, 63, 94, 0.7), 0 0 0 10px rgba(244, 114, 182, 0);
          }
        }

        .yes-btn-pulse {
          animation: softPulseGlow 2.2s infinite ease-in-out;
        }

        @keyframes heartBurstOut {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.3) rotate(0deg);
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(1.35) rotate(var(--rot));
          }
        }

        .celebration-heart {
          animation: heartBurstOut 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes pageTwoFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-page-two-enter {
          animation: pageTwoFadeIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes scaleUpModal {
          from {
            opacity: 0;
            transform: scale(0.93);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-up {
          animation: scaleUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInKey {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeInKey 0.3s ease-out forwards;
        }
      `}</style>

      {/* Lớp nền hạt sáng và trái tim */}
      <FloatingBackground />

      {/* Điều hướng PAGE 1 & PAGE 2 */}
      {currentStep === 'PAGE_1' && (
        <AnniversaryQuestion onAcceptSuccess={navigateToPageTwo} />
      )}

      {currentStep === 'PAGE_2' && (
        <PageTwoSurprise onBackToPageOne={navigateToPageOne} />
      )}
    </div>
  );
}