/* Popup 관련 */

/**
 * openHDPopup
 * popup ui를 오픈하는 함수(접근성 대응)
 *
 * @param {object} $triggerEl [필수]팝업을 호출한 DOM(팝업이 닫힌 뒤에 포커스할 엘리먼트)
 * @param {string} target [필수]Open할 popup id
 * @returns {void}
 */

let openScrollTop = null;
function openHDPopup($triggerEl, target) {
	if (target == undefined || target == null) {
		console.log("오픈할 팝업 타겟이 없습니다.");
		return false;
	}

	let $trigger;

	//$trigger 타입 유효성 체크
	try {
		if (!$triggerEl) { // null 또는 undefined
			$trigger = $(event.target);
		} else if ($triggerEl instanceof jQuery) {
			// jQuery 객체인 경우
			$trigger = $triggerEl;
		} else if (typeof $triggerEl === "string" || $triggerEl instanceof HTMLElement) {
			$trigger = $($triggerEl);
		} else {		
			$trigger = $("body");
		}
	} catch {
		$trigger = $("body");
	}
	
	const $target = $("#" + target);
	$target.removeAttr('aria-hidden');

	let $header = $target.find(".popup_head_title").length > 0 ? $target.find(".popup_head_title") : null;
	let $content = $target.find(".popup_cont").length > 0 ? $target.find(".popup_cont") : null;

	//$("[triggerId]").removeAttr("triggerId");
	//$("[opner]").removeAttr("opner");

	if (!$trigger.is("button, a")) {
		const $parentTrigger = $trigger.closest("button, a");
		if ($parentTrigger.length) {
			$trigger = $parentTrigger;
		}
	}

	//const getOpenerId = $trigger.attr("triggerId");
	let openerId;

	// if (!getOpenerId) {
	// 	openerId = generateUUID();
	// 	$trigger.attr("triggerId", openerId);
	// } else {
	// 	openerId = getOpenerId;
	// }

	openerId = generateUUID();
	$trigger.attr("triggerId", openerId);
	$target.attr("opner", openerId);

	// if ($(".wrap").attr("aria-hidden") == undefined || $(".wrap").attr("aria-hidden") == "false") {
	// 	$(".wrap").attr("aria-hidden", "true");
	// 	$(".wrap").attr("inert", "");
	// }

	// popup active
	// $("body").css("overscroll-behavior", "contain");
	// $("body").addClass("scroll_lock");
	// $target.addClass("active");

	// scrollTop 저장
  openScrollTop = $(window).scrollTop();
	const $winHeight = $(window).height();
	const $docHeight = $(document).height();

	console.log('마지막 저장 위치 : ', openScrollTop);

	//팝업 열기
	// $('#wrap').addClass('scroll_lock');
	$("body").addClass("scroll_lock");
	$target.addClass('active');

	const $prd = $('.prd_link_area');
	if($prd.length){
		setTimeout(function(){
			$prd.removeAttr().show();
	
			if(openScrollTop + $winHeight >= $docHeight){
				$prd.css('position', 'relative');
			}
		},100);
	}

	// scrollTop 복원
	if (openScrollTop !== null) {
		// $(window).scrollTop(openScrollTop);
		$('.wrap').scrollTop(openScrollTop);
		lastScrollTop = null; // 초기화
	}

	// bottom 팝업일 경우 - drag
	// if ($target.hasClass("bottom")) {
	// 	draggable($target);
	// }

	if($content) {
		$content.animate({
			scrollTop: 0 // 팝업 열 때 스크롤을 최상단으로 이동
		}, 0);
	}

	// $target.attr("aria-hidden", "false");
	// $target.find(".popup_inner").attr({
	// 	tabindex: 0,
	// 	"aria-hidden": "false",
	// });

	// pc tabindex 정리 0731
	// if ($header) $header.attr("tabindex", 0);
	// if ($content) $content.attr("tabindex", 0);
	// pc tabindex 정리 0731

	const focusTarget = $header || $content;

	const activePopups = $(".popup_wrap.active").not($target);
	if (focusTarget) {
		focusTarget.css("display", "none");
		focusTarget[0].offsetHeight; //강제 reflow
		focusTarget.css("display", "block");
	}

	if (event && event.type === 'click') {
		window.preventFocusSlide = true;
}

	setTimeout(() => {
		// if (focusTarget) {
		// 	focusTarget.focus();
		// 	focusTarget.attr("aria-live", "assertive"); //포커스 이동을 스크린 리더에 알림

		// 	setTimeout(() => {
		// 		focusTarget.attr("aria-live", null);
		// 	}, 0);
		// }
		// if (activePopups.length > 0) {
		// 	activePopups.attr("aria-hidden", "true");
		// 	activePopups.find(".popup_inner").attr("aria-hidden", "true");
		// }
		setTimeout(function(){
			//팝업 내부에 tabindex 설정
			setTabindex($target);
			//팝업 내부에서 focus순환
			focusTrap($target);
			// --- iframe 포커스 처리 추가 ---
			const $iframe = $target.find('iframe');
			if ($iframe.length) {
				$iframe.attr('tabindex', '0').focus(); // iframe 자체 포커스
				if($target.find('.sentinel').length === 0) {
					$target.prepend('<div class="sentinel first" tabindex="0"></div>');
					$target.append('<div class="sentinel last" tabindex="0"></div>');
				}
				// const iframeEl = $iframe[0];
				// iframeEl.addEventListener('load', function() {
				// 	try {
				// 	const innerDoc = iframeEl.contentWindow.document;
				// 	const firstFocusable = innerDoc.querySelector('input, button, a, textarea, select');
				// 	if (firstFocusable) {
				// 		firstFocusable.focus();
				// 	}
				// 	} catch (e) {
				// 	console.warn('iframe 내부 접근 불가:', e);
				// 	}
				// }, { once: true });
			}
			// --- iframe 포커스 처리 끝 ---
		},100);
	}, 350);
}

/**
 * closeHDPopup
 * - popup ui를 제거하는 함수(접근성 대응)
 * @param {string} target [필수]close할 popup id
 * @param {object} [returnTarget] [선택]팝업이 닫힌 뒤에 포커스할 엘리먼트
 * @returns {void}
 */
let closeScrollTop = null;
function closeHDPopup(target, returnTarget = null) {
	if (!target) {
		console.error("close할 팝업 id를 지정해주세요");
		return false;
	}

	const $target = $("#" + target);
	let $returnTarget;
	const getOpener = $('[triggerId="' + $target.attr("opner") + '"]');
	const $opener = (getOpener.length>0) && getOpener;
	$target.removeClass("active");

	//returnTarget 타입 유효성 체크
 	if(returnTarget) {		
		if (typeof returnTarget == "string" || returnTarget instanceof HTMLElement) {
			$returnTarget = $(returnTarget);
		} else if (returnTarget instanceof jQuery) {
			$returnTarget = returnTarget;
		}else {
			$returnTarget = null;
		}
	}

	const $triggerEl = $returnTarget || $opener;

	//하단에 다른 팝업이 열려있는 경우, 가장 최근 팝업으로 focus강제 이동
	const $prevPopup = $(".popup_wrap.active:last");
	if ($prevPopup.length > 0) {
		$($prevPopup).attr("aria-hidden", "false");

		$prevInner = $($prevPopup).find(".popup_inner");
		$prevInner.attr({
			tabindex: 0,
			"aria-hidden": "false",
		});

		const focusTarget = $triggerEl || $prevInner || $("body");	

		// ios 스크린리더가 dom의 변경사항을 인식하도록 상태변경
		// focusTarget.css("display", "none");
		// focusTarget[0].offsetHeight; //강제 reflow
		// focusTarget.css("display", "block");
		setTimeout(() => {
			$target.attr("aria-hidden", "true");
			$target.find(".popup_inner").attr("aria-hidden", "true").removeAttr("tabindex", 0);
			if(focusTarget) {
				focusTarget.focus();
				
				// 스크롤 위치 자동 조정
				const el = focusTarget[0];
				if (el && typeof el.scrollIntoView === "function") {
					setTimeout(() => {
						if (typeof el.scrollIntoViewIfNeeded === "function") {
							el.scrollIntoViewIfNeeded();
						} else {
							el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
						}
					}, 100);
				}
				focusTarget.attr("aria-live", "assertive"); //포커스 이동을 스크린 리더에 알림
				setTimeout(() => {
					focusTarget.attr("aria-live", null);
				}, 0);
			}
		}, 350);
	} else {
		// $(".wrap").attr("aria-hidden", "false");
		// $(".wrap").removeAttr("inert");
		// $("body").css("overscroll-behavior", "auto");
		// $("body").removeClass("scroll_lock");
		// $target.attr("aria-hidden", "true");
		// $target.find(".popup_inner").attr("aria-hidden", "true").removeAttr("tabindex", 0);

		// closeScrollTop = $('.wrap').scrollTop();
		closeScrollTop = $(window).scrollTop();
		// console.log('팝업 닫기 전 위치 : ', closeScrollTop);

		//팝업이 모두 닫힌 경우
		$("body").removeClass("scroll_lock");
		// $('#wrap').removeClass('scroll_lock');
		if (closeScrollTop !== null) {
			$(window).scrollTop(closeScrollTop);
			// $('.wrap').scrollTop(closeScrollTop);
			closeScrollTop = null; // 초기화
		}
		$target.find(".popup_inner").removeAttr("tabindex").off('keydown.focusTraversal');

		const $prd = $('.prd_link_area');
		if($prd.length){
			$prd.removeAttr('style');
		}

		const focusTarget = $triggerEl || $("body");

		setTimeout(() => {
			focusTarget.attr("tabindex", 0).focus();
			
			// 스크롤 위치 자동 조정
			const el = focusTarget[0];
			if (el && typeof el.scrollIntoView === "function") {
				setTimeout(() => {
					if (typeof el.scrollIntoViewIfNeeded === "function") {
						el.scrollIntoViewIfNeeded();
					} else {
						el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
					}
				}, 100);
			}
		}, 350);
	}	
	getOpener.removeAttr("triggerId");
	$target.removeAttr("opner");
	setTimeout(function(){
		$('body').removeAttr('tabindex');
		window.preventFocusSlide = false;
		console.log('preventFocusSlide 초기화:', window.preventFocusSlide);
	}, 360);
}


// UUID생성
function generateUUID() {
	var d = new Date().getTime();
	var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
	return uuid;
}

/* Toast 팝업 */
let toastTimer = null;
function toastAction(target, msg) {
	const $toast = $(".toast_wrap");
		//msg = $(target).data("msg");

	if (toastTimer != undefined) return;
	// console.log(toastTimer);

	$toast.find(".toast_msg").text("");
	toastMsg(msg);
	$toast.addClass("active");

	// clearTimeout(toastTimer);

	toastTimer = setTimeout(function () {
		$toast.removeClass("active");
		toastTimer = undefined;
	}, 1200);
}

function toastMsg(msg) {
	// const text = $('<div class='toast_msg'></div>').text(msg);
	$(".toast_msg").text(msg);
}

//팝업 내부에 tabindex 설정
function setTabindex($target){
	$target.find('.popup_inner').attr('tabindex', '0').focus();

			const $header = $target.find('.popup_head_title');
			const $content = $target.find('.popup_cont');
			// pc tabindex 정리 0731
			// if($header) {
			// 	const title = $header.text().trim();
			// 	if(title.length>0){
			// 		$header.attr('tabindex',0);
			// 	}
			// }
			// if($content){ $content.attr('tabindex',0); }
			// pc tabindex 정리 0731
}


//팝업 내부에서 focus순환
function focusTrap($target) {
  const focusable_selector= 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  $target.off('keydown.focusTraversal').on('keydown.focusTraversal', function(e) {
    if (e.key !== 'Tab') return;

    const focusableElements = $target.find(focusable_selector).filter(':visible');
    const firstElement = focusableElements.first()[0];
    const lastElement = focusableElements.last()[0];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });

  // Sentinel 방식 지원 (iframe이 있을 경우)
  if ($target.find('iframe').length) {
    const $firstSentinel = $target.find('.sentinel.first');
    const $lastSentinel = $target.find('.sentinel.last');

    if ($firstSentinel.length && $lastSentinel.length) {
      $firstSentinel.on('focus', () => {
        const focusable = $target.find(focusable_selector).filter(':visible');
        focusable.last().focus();
      });

      $lastSentinel.on('focus', () => {
        const focusable = $target.find(focusable_selector).filter(':visible');
        focusable.first().focus();
      });
    }
  }
}