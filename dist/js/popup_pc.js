
/* Popup 관련 */

//trigger요소의 타입을 제이쿼리 객체로 변환
function convertObj($triggerEl=null){

	let $trigger;
	
	// $trigger 타입 유효성 체크
	if ((typeof $triggerEl == "string"&&$triggerEl.trim() != '') || $triggerEl instanceof HTMLElement) {
		$trigger = $($triggerEl);
	} else if ($triggerEl instanceof jQuery) {
		// jQuery 객체인 경우
		$trigger = $triggerEl;
	} else {
		//그 외의 경우 body로 설정
		$trigger = $("body");
	}

	return $trigger;
}

//팝업 내부에 tabindex 설정
function setTabindex($target){
	$target.find('.popup_inner').attr('tabindex', '0').focus();

			const $header = $target.find('.popup_head_title');
			const $content = $target.find('.popup_cont');
			if($header) {
				const title = $header.text().trim();
				if(title.length>0){
					$header.attr('tabindex',0);
				}
			}
			if($content){ $content.attr('tabindex',0); }
}


//팝업 내부에서 focus순환
function focusTrap($target){
	$target.find('.popup_inner, .event_pop_ele_inner').off('keydown.focusTraversal').on('keydown.focusTraversal', function(e) {
		if (e.key === 'Tab') {
			const focusableEle = $target.find('button, input, select, textarea, a, .popup_inner').filter(':not([disabled])'); // 포커스 가능한 요소들만
			const firstEle = focusableEle.first();
			const lastEle = focusableEle.last();
			
			if (e.shiftKey) {
				if (document.activeElement === firstEle[0]) {
					lastEle.focus();
					e.preventDefault();
				}
			} else {
				if (document.activeElement === lastEle[0]) {
					firstEle.focus();
					e.preventDefault();
				}
			}
		}
	});
}


/**
 * openHDPopup
 * popup ui를 오픈하는 함수(접근성 대응)
 *
 * @param {string|HTMLElement|jQuery} $triggerEl [필수]팝업이 닫힌 뒤에 포커스할 엘리먼트(팝업이 닫힌 뒤에 포커스할 엘리먼트)
 * @param {string} target [필수]Open할 popup id
 * @returns {void}
 */
	function openHDPopup($triggerEl, target){

		if(typeof target !== 'string') throw new Error("Open할 popup id를 확인해주세요.");

		const $target = $('#' + target);
		if (target == undefined || target == null || $target.length <= 0) {
			throw new Error("오픈할 팝업 타겟이 없습니다.");
		}
		
		//trigger 정보 저장
		const $trigger = convertObj($triggerEl);
		window.popupInfo.set(target, {
			'trigger': $trigger,
		});

		//팝업 열기
		$('#wrap').addClass('scroll_lock');
		$target.addClass('active');
		
		//렌더링 후, focus 이동
		setTimeout(function(){
			//팝업 내부에 tabindex 설정
			setTabindex($target);
			//팝업 내부에서 focus순환
			focusTrap($target);
		},100);
	}
	
	

	/**
 * closeHDPopup
 * - popup ui를 제거하는 함수(접근성 대응)
 * @param {string} target [필수]close할 popup id
 * @returns {void}
 */
	function closeHDPopup(target) {

		if(typeof target !== 'string') throw new Error("close할 popup id를 확인해주세요.");

		const $target = $('#' + target);
		if ( !target || $target.length <= 0) {
			throw new Error("팝업 타겟이 없습니다.");
		}

		//popup닫기
		// console.log("외부 영역 클릭 시 팝업 닫기");
		$target.removeClass("active");

		let $triggerEl = $("body");
		if(window.popupInfo.has(target)){
			$triggerEl = window.popupInfo.get(target).trigger;
			//팝업 관리객체에서 제거
			window.popupInfo.delete(target);
		}

		//하단에 다른 팝업이 열려있는 경우, 가장 최근 팝업으로 focus강제 이동
		const $prevPopup = $(".popup_wrap.active:last");
		if ($prevPopup.length > 0) {

			$prevInner = $($prevPopup).find(".popup_inner");
			$prevInner.attr("tabindex", 0);

			if($triggerEl[0]==document.querySelector("body")){
				$triggerEl = null;
			}

			const focusTarget = $triggerEl || $prevInner || $("body");
			setTimeout(() => {
				focusTarget.focus();
				$target.find(".popup_inner").removeAttr("tabindex");
			}, 350);

		} else {
			//팝업이 모두 닫힌 경우
			$('#wrap').removeClass('scroll_lock');
			$target.find(".popup_inner").removeAttr("tabindex").off('keydown.focusTraversal');

			const focusTarget = $triggerEl || $("body");
			setTimeout(() => {
				focusTarget.attr("tabindex", 0).focus();
			}, 350);
		}

	}


	$(document).ready(function() {
		//팝업관리 객체 생성
		window.popupInfo = new Map();
	});


	//window click이벤트
	// $(window).on('click', function(e) {
	// 	var $target = $(e.target);
	// 	
	// 	// 팝업 영역 외 클릭 시 팝업 닫기
	// 	var $close_popup = $('.popup_inner');
	// 	if (!$target.closest($close_popup).length) {
	// 		const targetPopup = $target.closest('.popup_wrap').attr('id');
	// 		if (targetPopup) {
	// 			closeHDPopup(targetPopup);
	// 		}
	// 	}
	// });


	// 개선 버젼 250714
	$(window).on('click', function(e) {
		var $target = $(e.target);
		var $close_popup = $('.popup_inner, .event_pop_ele_inner');
		if (!$target.closest($close_popup).length) {
			const $popup = $target.closest('.popup_wrap, .event_pop_ele_inner');
			const targetPopupId = $popup.attr('id');
			if (targetPopupId) {
				closeHDPopup(targetPopupId);
			}
		}
	});

	