$(function() {  // DOM이 준비되었을 때 실행
	const $DOM = $(document),
				$WIN = $(window),
				$WRAP = $('.wrap'),
				$FOOTER = $('.footer'),
				$FLOATING_ITEM = $('.quick_menu');
	
	// DOM과 윈도우 크기를 기준으로 필요한 값들을 초기화
	let wHeight, sTop, wrapHeight, footerHeight;

	function updateDimensions() {
		wHeight = $WIN.height();
		sTop = $WIN.scrollTop();
		wrapHeight = $WRAP.outerHeight();
		footerHeight = $FOOTER.outerHeight();
	}

	function floatingItem() {
		const footerIs = $('.footer').css('display');
		if(footerIs === 'none') {
			return; // 푸터가 없으면 항상 활성화 상태로 유지
		}

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
		if ( $('.footer').length || !$('.footer').css('display') === 'none' ) {
			updateDimensions();
			floatingItem();
		}
	});

	// 윈도우 로드 상태에서 실행
	$WIN.on('load', function() {
		if ( $('.footer').length || !$('.footer').css('display') === 'none' ) {
			updateDimensions();
			floatingItem();
		}
	});

	// 헤더 이벤트 스크립트
	if($('.hpi_top').length){
		let lastScrollTop = 0;
		
		if(!$('.main_evt_tab.main_sticky').length){
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
		}
	}

	// 헤더 gnb
	$DOM.on('mouseenter', '.nav_list > li', function() {
		$(this).siblings().find('*').blur();
	});

	// 고양이/강아지 변환 
	$DOM.on('click', '.change_mode .cm_btn', function(e) {
		$(this).closest('.change_mode').find('.cm_btn').removeClass('active');
		$(this).addClass('active');
	});

	// 페이지 상단으로 스크롤
	$DOM.on('click', '.qm_btn_pagetop', function(e) {
		e.preventDefault();
		$('html, body').animate({ scrollTop: 0 }, 300);
	});
	
	
});


// ready
