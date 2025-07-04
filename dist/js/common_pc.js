(function() {
})();

$(function() {  // DOM이 준비되었을 때 실행
	const $DOM = $(document),
				$WIN = $(window),
				$WRAP = $('.wrap'),
				$FOOTER = $('.footer'),
				$FLOATING_ITEM = $('.pageTop');
	
	// DOM과 윈도우 크기를 기준으로 필요한 값들을 초기화
	let wHeight, sTop, wrapHeight, footerHeight;

	function updateDimensions() {
		wHeight = $WIN.height();
		sTop = $WIN.scrollTop();
		wrapHeight = $WRAP.outerHeight();
		footerHeight = $FOOTER.outerHeight();
		// console.log('wrapHeight : ', wrapHeight);
	}

	function floatingItem() {
		// console.log(wrapHeight, footerHeight, sTop, wHeight);
		if (wrapHeight - footerHeight < sTop + wHeight) {
			$FLOATING_ITEM.addClass('active');
		} else {
			$FLOATING_ITEM.removeClass('active');
		}
	}

	updateDimensions();  // 초기 크기 설정
	floatingItem();      // 초기 floating 상태 설정

	// 스크롤 이벤트 처리
	$WIN.on('scroll', function() {
		updateDimensions();
		floatingItem();
	});

	// 윈도우 로드 상태에서 실행
	$WIN.on('load', function() {
		updateDimensions();
		floatingItem();
	});


	// 헤더 이벤트 스크립트
	let lastScrollTop = 0;
  $(window).on('scroll', function() {
    let st = $(this).scrollTop();
		// console.log(st);

    if (st > lastScrollTop) {
      // 아래로 스크롤
      $('body').removeClass('sc_up').addClass('sc_down');
    } else if (st < lastScrollTop) {
      // 위로 스크롤
      $('body').removeClass('sc_down').addClass('sc_up');
    }

    lastScrollTop = st;
  });

	// 헤더 gnb
	$DOM.on('mouseenter', '.nav_list > li', function() {
		$(this).siblings().find('*').blur();
	});

	// 고양이/강아지 변환 
	$DOM.on('click', '.change_mode .cm_btn', function(e) {
		$(this).closest('.change_mode').find('.cm_btn').removeClass('active');
		$(this).addClass('active');
	});


	// selectbox 스타일 처리 스크립트
	$('.selectbox').each(function(index, element) {
		const $this = $(element);
		const selectedValue = $this.val();  // 현재 선택된 option의 value 값
		console.log(selectedValue);
	
		if (selectedValue === 'default') {
			$this.addClass('default');
		} else {
			$this.removeClass('default'); // 필요에 따라 제거도 처리
		}
	});


	

	
});


// ready
$(function(){

	

});


// /* Popup 관련 */
// 	// Popup 열기
// 	function openPop(target){
// 		const $target = $('#' + target);
	
// 		if($target.length){
// 			$('#wrap').addClass('scroll_lock');
// 			$target.addClass('active');
	
// 			//렌더링 후, focus 이동
// 			setTimeout(function(){
// 				$target.find('.popup_inner').attr('tabindex', '0').focus();
// 			},100);
	
// 			$target.find('.popup_inner').on('keydown', function(e) {
// 				if (e.key === 'Tab') {
// 					const focusableEle = $target.find('button, input, select, textarea, a, .popup_inner').filter(':not([disabled])'); // 포커스 가능한 요소들만
// 					const firstEle = focusableEle.first();
// 					const lastEle = focusableEle.last();
					
// 					if (e.shiftKey) {
// 						if (document.activeElement === firstEle[0]) {
// 							lastEle.focus();
// 							e.preventDefault();
// 						}
// 					} else {
// 						if (document.activeElement === lastEle[0]) {
// 							firstEle.focus();
// 							e.preventDefault();
// 						}
// 					}
// 				}
// 			});
// 		}
// 	}
	
// 	// Popup 닫기
// 	function closePop(target) {
// 		const $target = $('#' + target);
	
// 		$('#wrap').removeClass('scroll_lock');
// 		$target.removeClass('active');
// 		$target.find('.popup_inner').removeAttr('tabindex');
// 	}
	
	$(window).on('click', function(e) {
		var $target = $(e.target);
		// console.log($target);
		// 범용
		var $test_item = $('.test_item, .test_item2');
		if (!$target.closest($test_item).length) {
			$test_item.removeClass('active');
		}
		
		// // 팝업 영역 외 클릭 시 팝업 닫기
		// var $close_popup = $('.popup_inner');
		// if (!$target.closest($close_popup).length) {
		// 	console.log('this : ', $target);
		// 	$('#wrap').removeClass('scroll_lock');
		// 	$target.closest('.popup_wrap').removeClass('active').find('.popup_inner').removeAttr('tabindex');
		// }
	});
