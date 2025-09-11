(function() {  
  const $DOM = $(document),
        $WIN = $(window),
        wHeight = $WIN.height();

	$(document).on('keydown', function(e) {
		if (e.key === 'Enter') {
			const focusedElement = document.activeElement; // 현재 포커스된 요소
			// console.log('현재 포커스된 요소:', focusedElement);
			// console.log('jQuery this로는:', $(focusedElement));
		}
	});

	$DOM.on('click', '.hsu_search', function () {
		// e.stopPropagation();
		// 추후 알림, 장바구니 팝업 완료 시 사용
		// $('.wrap').toggleClass('scroll_lock');
		$(this).toggleClass('active');
		const $wrap = $('.all_menu_search_wrap');
		const $btn = $(this);
		const $text = $btn.find('.text');
	
		$wrap.toggleClass('active');
	
		const isActive = $wrap.hasClass('active');
	
		$btn.attr('aria-expanded', isActive);
		$text.text(isActive ? '메뉴검색 팝업 닫기' : '메뉴검색 팝업 열기');
	});

  /* Accordion */   
  $DOM.on('click', '.acd_item .acd_head .acd_btn', function(){
    const $this = $(this),
					$head = $this.parent('.acd_head'),
          $inner = $head.next('.acd_cont').children('.inner'),
          $click_item = $head.parent('.acd_item');

    if($inner.css('display') == 'none'){
      $click_item.children('.acd_head').removeClass('active').children('.acd_btn').attr('aria-expanded', 'false');
      $click_item.children('.acd_cont').children('.inner').hide();
      $head.addClass('active');
      $inner.slideDown();
			$this.attr('aria-expanded', 'true');
    }else {
			$this.attr('aria-expanded', 'false');
      $inner.slideUp();
			$head.removeClass('active');
    }
  });

	//리뷰 아코디언
	$DOM.on('click', '.review_acd_item .acd_btn', function(){
		const $this = $(this);
		$this.parent('.review_acd_item').toggleClass('active');
	});

	/* 펼치기/접히기 */
	$DOM.on('click', '.acd_item .btn_toggle', function(){
		const $this = $(this),
					$parent = $this.closest('.acd_item'),
					$item = $this.closest('.acd_item').children('.tg_item');

		if(!$item.hasClass('active')){
			$item.addClass('active');
			$item.find('.select_radio_item .rd_btn:nth-child(5) input').focus();
		}else {
			$item.removeClass('active');
		}
	})

  /* Tooltip */
  $DOM.on('click', '.tooltip_wrap button', function(){
    const $click = $(this).closest('.tooltip_wrap'),
					$t_head = $click.children('.tooltip_head'),
					$t_text = $click.find('.tooltip_panel').children('.inner'),
					$focus_btn = $click.find('.open');

			if($(this).hasClass('open')){
				$('.tooltip_wrap .tooltip_head').removeClass('active').find('.open').attr('aria-expanded', 'false');
				$t_head.addClass('active').find('.open').attr('aria-expanded', 'true');
				$('.tooltip_wrap .tooltip_panel .inner').hide();
				$t_text.css('display', 'block').focus();
			}else {
				$('.tooltip_wrap .tooltip_head').removeClass('active').find('.open').attr('aria-expanded', 'false');
				$('.tooltip_wrap .tooltip_panel .inner').hide();
				$focus_btn.focus();
			}
  });

	/* Anchor */
	$DOM.on('click', '.anchor_wrap .anchor_btn', function(){
    const $this = $(this),
					btnIdx = $this.index(),
					text = $this.find('.hd_badge').text(),
					count = text.match(/\d+/)[0];

		// 보장상태가 0일 때
		if(count !== '0') {
			$this.closest('.anchor_wrap').find('.anchor_btn').removeClass('active');
			$this.addClass('active');

			$('.anchor_move').each(function(idx){
				const headerH = $('.header').innerHeight(),
							fixH = $('.anchor_wrap.stikcy').innerHeight();
				const moveIdx = idx,
							positionVal = $(this).position().top,
							scrollTop = $('.container').scrollTop(),
							newVal = positionVal  + scrollTop - headerH - fixH;

				if(moveIdx == btnIdx){
					$('.container').animate({
						scrollTop : newVal
					}, 500)

					// console.log($('.anchor_move').eq(idx).children('.is_coverage_graph').attr('class'));
					$('.anchor_move').eq(moveIdx).focus();
				}
			})
		}
	})

  /* Input */
  $DOM.on('focus input', '.input_text .inp > input', function(){
    const $this = $(this),
          $wrap = $this.closest('.inp'),
          $del = $this.siblings('.del'),
		  isDisabled = $this.prop('disabled'),
		  isReadonly = $this.prop('readonly');
		let val = $this.val();
      
    if($del.length) {
      $del.attr('tabindex', '0');
    }

		if (!isDisabled && !isReadonly) {
			if(val){
				$wrap.addClass('active');
			}else {
				$wrap.removeClass('active');
			}
		}

		//전화번호
		// if($this.closest('.input_text').hasClass('phone')){
		if( $this.closest('.input_text').hasClass('phone') && !$this.prop('readonly') && !$this.prop('disabled') ){
			if(val){
				const newVal = val.replace(/ - /g, '');
				$this.attr('maxlength', 8);
				$this.val(newVal).removeClass('isVal');
			}
		}
    
  }).on('blur', '.inp > input', function(){
    const $this = $(this),
		  		$del = $this.siblings('.del'),
          $wrap = $this.closest('.inp');
		let val = $this.val(),
				newVal = 0;

		setTimeout(() => {
			if (!$wrap.find('.del').is(':focus') ) {
				$wrap.removeClass('active');
			}	
		}, 100);
		$wrap.find('.del').on('blur', function(){
			$(this).closest('.inp').removeClass('active');
		});

		// 전화번호
		// if($this.closest('.input_text').hasClass('phone')){
		if( $this.closest('.input_text').hasClass('phone') && !$this.prop('readonly') && !$this.prop('disabled') ){
			$this.attr('maxlength', 14);
			if(val){
				val = val.replace(/[^0-9*]/g, '');
				newVal = ' - ' + val.replace(/([0-9*]{4})(?=[0-9*])/g, '$1 - ');
				$this.val(newVal).addClass('isVal');
			}else {
				$this.removeClass('isVal');
			}
		}

  }).on('click', '.inp > .del:not(.del_not)', function(e){
    const $this = $(this);
    e.preventDefault();
	
		setTimeout(() => {
			// $this.siblings('input').val('').trigger("input").focus();
			const $input = $this.siblings("input");
			$input.val("").focus();
			$input[0].dispatchEvent(new Event("input", { bubbles: true }));
		}, 100);

		if($this.closest('.comp_wrap').hasClass('phone')){
			$this.siblings('input').removeClass('isVal');
		}
		if($(this).closest('.length_check').length){
			$(this).closest('.length_check').find('.counter').attr('aria-label', '입력한 숫자 없음').find('.c_input').text('0');
		}
  });
	
	// comma
	$DOM.on('keyup', '.price .inp input, .comma .inp input', function()	{
		const $this = $(this),
					$val = $this.val();
		$this.val($val.replace(/[^0-9]/gi, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
	});

	// file
	$DOM.on('change', '.inp_file input[type=file]', function() {
		const fileName = $(this).val().split('\\').pop();
		$(this).closest('.inp_file').find('.file_name').text(fileName);
	});

	// 약관 동의
	const $chkAll = function(click){
    const $group = click.closest('.chk_group_wrap'),
          $total = $group.find('.chk_point:not(:disabled)').length,
          $chked = $group.find('.chk_point:not(:disabled):checked').length;

    if ($total === $chked) {
      $group.find('.chk_point_all').prop('checked', true);
    } else {
      $group.find('.chk_point_all').prop("checked", false);
    }
  }

  $DOM.on('change', '.chk_group_wrap .chk_point', function () {
    const $sub_status = $(this).is(":checked"),
          $sub_list = $(this).closest('.inp_checkbox').find('.chk_lby');

    if ($sub_status) {
      $sub_list.find('.chk_point_sub:not(:disabled)').prop('checked', true);
    }else {
      $sub_list.find('.chk_point_sub:not(:disabled)').prop('checked', false);
    }
    $chkAll($(this));

  }).on('change', '.chk_group_wrap .chk_point_sub', function () {
    const $group_sub = $(this).closest('.chk_list'),
          $sub_total = $group_sub.find('.chk_point_sub:not(:disabled)').length,
          $sub_chked = $group_sub.find('.chk_point_sub:not(:disabled):checked').length;

    if ($sub_chked === $sub_total) {
			$group_sub.closest('.inp_checkbox').find('.chk_point').prop('checked', true);
			
    }else {
			$group_sub.closest('.inp_checkbox').find('.chk_point').prop('checked', false);
    }
    $chkAll($(this));

  }).on('change', '.chk_group_wrap .chk_point_all', function () {
    const allChked = $(this).is(":checked");

    if (allChked) {
      $(this).closest('.chk_group_wrap').find('input[type=checkbox]:not(:disabled)').prop('checked', true);
    } else {
      $(this).closest('.chk_group_wrap').find('input[type=checkbox]:not(:disabled)').prop('checked', false);
    }
  });
	// 약관 동의
  	
	
	//toggle-swich
	$DOM.on('change', '.inp_checkbox input[role="switch"]', function(){
		$isChecked = $(this).is(":checked");
		$(this).attr('aria-checked', $isChecked ? 'true' : 'false');
	});
	
  /* Textarea */
	// byte check
  $DOM.on('blur keyup', '.byte_check > textarea', function(){
    const str = $(this).val(),
          str2 = '',
          maxByte = 500;

		let rlen = 0,
				one_char = '',
				strLng = str.length,
				rbyte = 0;

    for(let i=0; i<strLng; i++){
      one_char = str.charAt(i);
      if(escape(one_char).length > 4){
        rbyte += 2;
      }else {
        rbyte++;
      }

      if(rbyte <= maxByte){
        rlen = i+1;
      }
    }

    if(rbyte > maxByte){
      str2 = str.substr(0,rlen);
      $(this).val(str2);
    }else {
      $(this).next().find('em').html(rbyte);
    }
  });

	// length check
	$DOM.on('keyup', '.length_check > textarea, .length_check > .input_text input', function (e){
    const str = $(this).val(),
					$count = $(this).closest('.length_check').find('.counter em');
			
    if(str.length == 0 || str == ''){
			$count.closest('.counter').attr('aria-label', '입력한 숫자 없음');
			$count.text('0');
      // $count.text('0');
    }else{
			$count.closest('.counter').attr('aria-label', '15개 중 ' + str.length + '개 입력');
			$count.text(str.length);
			// $count.text(str.length);
    }

    if (str.length > 500) {
    	$(this).val($(this).val().substring(0, 500));
		}
  });

	/* Tab */
	$DOM.on('click', '.tab_btn:not(.tab_btn_block)', function(){
		const idx = $(this).index();
		$(this).closest('[class^=tab_wrap_list]').children('.tab_btn').removeClass('active').attr('aria-selected', 'false');
		$(this).addClass('active').attr('aria-selected', 'true');
		$(this).closest('.tab_wrap').children('.tab_wrap_content').removeClass('active');
		$(this).closest('.tab_wrap').children('.tab_wrap_content').eq(idx).addClass('active');
	});

	// select_driver
	$DOM.on('change', '.select_driver_range [class^="radio_group_wrap"] input[type="radio"]', function(){
		const $relGroup = $('.driver_relationship_state').find('.relationship_box');
		const $relGroup2 = $('.driver_relationship_cont');
		const idx = $(this).closest('.inp_radio').index() + 1;
		let newClass = 'pick' + idx;

		const $parent = $(this).closest('[class*="pick"]');

		// 지정된 순으로
		if($(this).closest('.select_driver_range').hasClass('direct')){
			let newVal = $parent.attr('class');
			$relGroup.removeAttr('class').addClass('relationship_box ' + newVal);
			$relGroup2.removeAttr('class').addClass('driver_relationship_cont ' + newVal);
		
		// 순차적으로
		}else {
			$relGroup.removeAttr('class').addClass('relationship_box ' + newClass);
			$relGroup2.removeAttr('class').addClass('driver_relationship_cont ' + newClass);
		}
	})

	// 해제가능 radio group
	// 
	// $DOM.on('click', '.radio_group_resetable .inp_radio input[type="radio"]', function(){
	// 	// console.log('change');
	// 	const $this = $(this);
	// 	setTimeout(function(){
	// 		if($this.is(':checked')) {
	// 			// $this.closest('.radio_group_resetable').removeClass('active');
	// 			// $this.prop('checked', false);
	// 			console.log('checked');
	// 		} else {
	// 			console.log('false');
	// 		}
	// 	}, 0);
	// })

	// var inputs = $('input');
	// var checked = inputs.filter(':checked').val();
	// inputs.on('click', function(){
	// 	console.log('x');
	// 	if($(this).val() === checked) {
	// 		$(this).prop('checked', false);
	// 		checked = '';
	// 	} else {
	// 		$(this).prop('checked', true);
	// 		checked = $(this).val();
	// 	}
	// });


	//radio_comb(2개의 라디오 버튼 중 택1 콤비네이션)
	// $DOM.on('change', '.radio_comb input[type="radio"]', function(){
	// 	const parentCont = $(this).closest('.radio_comb');

	// 	if(parentCont.length > 0){
	// 		parentCont.removeClass('origin').addClass('active');
	// 	}
	// });

	// $DOM.ready(function(){
	// 	const target = $('.radio_comb input[type="radio"]:checked');
	// 	target.each(function(){
	// 		const parentCont = $(this).closest('.radio_comb');
	// 		if(parentCont.length > 0){
	// 			parentCont.removeClass('origin').addClass('active');
	// 		}
	// 	});
	// });

	// 수령지 일괄 선택
	$DOM.on('change', '.sa_change', function() {
		var $wrap = $(this).closest('.sa_wrap');
		var selectedPos = $(this).data('getpos');

		$wrap.find('.scp_list li').each(function() {
			var $li = $(this);
			$li.find('input[type="radio"][data-getpos="' + selectedPos + '"]').prop('checked', true);
		});

		// 하위 변경 후, 상단 상태 체크
		updateTopRadio($wrap);
	});

	$DOM.on('change', '.scp_list input[type="radio"]', function() {
		var $wrap = $(this).closest('.sa_wrap');
		
		// 하위 선택 변경되면 상단 상태도 체크
		updateTopRadio($wrap);
	});

	function updateTopRadio($wrap) {
		var allPos = [];

		// 하위에서 체크된 getpos 수집
		$wrap.find('.scp_list li').each(function() {
			var $checked = $(this).find('input[type="radio"]:checked');
			allPos.push($checked.data('getpos'));
		});

		// 모두 같은 값인지 확인
		var isAllSame = allPos.every(function(pos) {
			return pos === allPos[0];
		});

		if (isAllSame && allPos[0]) {
			// 모두 같은 getpos면 상단 해당 버튼 체크
			$wrap.find('.sa_change[data-getpos="' + allPos[0] + '"]').prop('checked', true);
		} else {
			// 하나라도 다르면 상단 버튼 체크 해제
			$wrap.find('.sa_change').prop('checked', false);
		}
	}

	let ri = $('.radio_group_resetable input');
	let richecked = ri.filter(':checked').val();
	$DOM.on('click', '.radio_group_resetable input[type="radio"]', function() {
		if($(this).val() === richecked) {
			$(this).prop('checked', false);
			richecked = '';
		} else {
			$(this).prop('checked', true);
			richecked = $(this).val();
		}
	});

	// 선택목록 active 처리
	$DOM.on('click', '.opt_select_list.opt_case3 .option', function(e){
		$(this).closest('.opt_select_list').find('.option').removeClass('active').removeAttr('title');
		$(this).addClass('active').attr('title', '선택됨');
	});

	// inp_only_num
	$DOM.on('keyup', '.inp_only_num', function() {
		const $this = $(this),
					val = $this.val().replace(/[^0-9]/g, ''); // 숫자만 허용
		$this.val(val);
	});

	// input[type="tel"]
	$DOM.on('keyup', 'input[type="tel"]', function() {
		const $this = $(this),
					val = $this.val().replace(/[^0-9]/g, ''); // 숫자만 허용
		$this.val(val);
	});

	// 달력 날짜 입력 항목 focus 시 attr 추가 및 blur 시 자리수 정리 기능 추가
	$DOM.on('focus', '.inp_picker', function() {
		const $this = $(this);
		let val = $this.val();
		$this.attr('maxlength', '8'); // focus 시 maxlength 속성 추가
		const raw = val.replace(/\D/g, ''); // 모든 숫자만 남김
		if (raw.length === 8) {
			$this.val(raw);
		}
	});
	$DOM.on('blur', '.inp_picker', function () {
		const $this = $(this);
		let val = $this.val().replace(/\D/g, ''); // 숫자만 추출
	
		if (val.length === 8) {
			const formatted = val.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1.$2.$3');
			$this.val(formatted);
		}
	});

	$DOM.on('click', '.ftr_sns_open', function (e) {
		e.stopPropagation(); // ← window 클릭 방지 핵심

		const $this = $(this);	
		const $snsTarget = $('.ftr_sns_list');
		$snsTarget.toggleClass('active');
		
		const isActive = $snsTarget.hasClass('active');
		// console.log('SNS 목록 : ' + isActive);
		$this.attr('aria-expanded', isActive);
		// $this.text(isActive ? '메뉴검색 팝업 닫기' : '메뉴검색 팝업 열기');
		$this.attr('title', isActive ? '다이렉트 SNS 목록닫기' : '다이렉트 SNS 목록보기');
		// return false; // 링크 기본동작 방지
	});


	$('.ftr_sns_list').on('focusout', function () {
    setTimeout(function () {
      if (!$(document.activeElement).closest('.ftr_sns_list').length) {
				$('.ftr_sns_list').removeClass('active');
				$('.ftr_sns_open').attr('title', '다이렉트 SNS 목록보기');
      }
    }, 10);
  });	

	// 이벤트 위임 - 탭 클릭 이벤트
	$(document).off('click.positionEventTab').on('click.positionEventTab', '.position_event_wrap .position_event_tab .tag_item', function () {
		const $tab = $(this);
		const $wrap = $tab.closest('.position_event_wrap');
		const $tabBtns = $wrap.find('.position_event_tab .tag_item');
		const $contents = $wrap.find('.position_event_content .pec_point');
		const $scrollArea = $wrap.find('.position_event_content');


		const idx = $tab.index();
		const $target = $contents.eq(idx);

		let expHeight = 0;
		let sHeight = 0;

		let tab1Scroll = null;

		if ($wrap.find('.pew_exception').length) {
			const $simpleInfoWrap = $wrap.find('.simple_info_wrap');
			const $tagItemWrap = $wrap.find('.tag_item_wrap');
			const $titleWrap = $wrap.find('.pec_point .title_h3');
			const hasActivePoEtc1 = $wrap.find('.tag_item_wrap_po_etc1.active').length > 0;

			const simpleInfoHeight = $simpleInfoWrap.outerHeight() || 0;
			const tagItemHeight = $tagItemWrap.outerHeight() || 0;
			const titleWrapHeight = $titleWrap.outerHeight() || 0;

			const exceptionHeight = simpleInfoHeight + tagItemHeight;

			expHeight = hasActivePoEtc1
				? exceptionHeight - titleWrapHeight * 2
				: exceptionHeight + titleWrapHeight + 2;
		}

		// if($wrap.find('.sii_wrap').length){
		// 	const $sii = $wrap.find('.sii_wrap').children('.position_event_tab');
		// 	let siiHeight = 0;
			
		// 	if($('.position_event_content').hasClass('summary_ii')){
		// 		// siiHeight = parseFloat($sii.css('padding-bottom'));
		// 		siiHeight = parseFloat($scrollArea.css('margin-top'));
		// 	}else {
		// 		const silSickty = parseFloat($wrap.find('.position_event_tab').css('top'))
		// 		const mTop = parseFloat($contents.css('margin-bottom'));
		// 		siiHeight = parseFloat($sii.css('padding-bottom')) + mTop + 16 - silSickty;
		// 	}
		// 	sHeight = siiHeight;
		// }
		

		if ($target.length) {
			$wrap.data('scrolling', true);

			$tabBtns.removeClass('active');
			$tab.addClass('active');

			const containerTop = $scrollArea.offset().top;
			const targetTop = $target.offset().top;
			const scrollY = targetTop - containerTop + expHeight + sHeight;
		

			if ($(this).closest('.amc_nav').length && scrollY == 0 ) {
				$('.amc_nav').removeClass('active');
			} else {
				$('.amc_nav').addClass('active');
			}

			$wrap.stop().animate({
				scrollTop: scrollY
			}, 300, function () {
				$wrap.data('scrolling', false);

				// 포커스 가능한 첫 요소 탐색
				const $focusable = $target.find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').filter(':visible').first();

				if (!$wrap.hasClass('prd_car')) {
					if ($focusable.length) {
						$focusable.focus();
					} else {
						$target.attr('tabindex', '-1').focus();
					}
				}
			});
		}
	});

})();


/* Tab Scroll */
// 탭 버튼 클릭 시 중앙에 위치하는 기능 - 접근성 관련 기능
function tabScroll(){
	let scrollPosition = 0;

	// $('[class^=tab_scroll_box]').on('scroll', function() {
	// 	scrollPosition = $(this).scrollLeft();
	// 	$('#scroll_position span').text(scrollPosition);
	// });

	$('[class^=tab_scroll_box] .tab_btn').on('click', function(){
		const $this = $(this),
					$scrollBox = $this.closest('[class^=tab_scroll_box]')
					$scrollList = $scrollBox.children('.scroll');

		// const btn_offset = $this.closest('.wrap').length ? $this.offset().left - 20 : $this.position().left,
		const btn_offset = $this.position().left,
					scrollBox_w = $scrollList.width();
		let scrollMove = btn_offset - ($scrollBox.width() / 2) + ($this.outerWidth() / 2);

		// console.log('move : ' + scrollMove);
		// console.log('버튼 위치 : ' + btn_offset, '스크롤 위치 : ' + scrollPosition);
		$scrollBox.animate({
			scrollLeft: scrollMove
		}, 200);
	})
}
	
// 간편정보 노출 방식
function simpleInfo(){
	$('#container, .popup_cont, .container_form').on('scroll', function() {
		if ($('.simple_info_wrap.ty2').length) {
			const $wrapper = $(this);
			const $target = $wrapper.find('.simple_info_wrap.ty2');
			const $targetChild = $target.children('.simple_info_item');
			
			const simpleHeight = $targetChild.height();

			// 보여지는 상태일 때만 위치 계산
			let targetOffsetTop = ($target.css('display') !== 'none') ? $target.position().top : null;
			
			if ($target.length) {
				$target.parent().css('position', 'relative');

				// 펼치기
				if (targetOffsetTop <= 0 && !$targetChild.hasClass('active')) {
					$targetChild.addClass('active').stop().show();
					$target.closest('.position_event_wrap')
						.find('.tag_item_wrap.sticky')
						.css('top', simpleHeight)
						.addClass('active');

				// 접기
				} else if (targetOffsetTop > 0 && $targetChild.hasClass('active')) {
					$target.removeAttr('style').removeClass('active');
					$targetChild.removeClass('active').stop().hide();
					$target.closest('.position_event_wrap')
						.find('.tag_item_wrap.sticky')
						.css('top', 0)
						.removeClass('active');
				}
			}
		}

	});
}
// 간편정보 노출 방식

// 최근설계내역
function currentPlan() {
	const $bottom = $('.bottom_fix_wrap'),
				$bottom_h = $bottom.outerHeight(),
				$plan_area = $('.fixed_link_wrap'),
				$link_btn = $plan_area.find('.link_btn_box').children('.btn_current'),
				$close_btn = $plan_area.find('.link_btn_box').children('.link_close');

	if($bottom.length) {
		$plan_area.css('bottom', $bottom_h + 12);
	}

	$(document).on('click', '.link_btn_box .link_close', function(){
		$(this).closest('.fixed_link_wrap').remove();
	});
}

function fixedMenuPlay() {
	const $state = $('.fixed_link_wrap').find('.current_state');

	setTimeout(function(){
		$state.addClass('effect');
	}, 500);
	
	$state.one('transitionend', function () {
		setTimeout(function(){
			$state.removeClass('effect').attr('aria-hidden', 'true');

			setTimeout(function(){
				$state.hide();
			}, 500);
		}, 3000);
	});
}

// 초기화 함수 (동적 요소가 생성될 때마다 호출)
function initPositionEventWrap($wrap) {
	if (!$wrap.length) return;

	const $tabBtns = $wrap.find('.position_event_tab .tag_item');
	const $contents = $wrap.find('.position_event_content .pec_point');
	const $scrollArea = $wrap.find('.position_event_content');

	$wrap.data('scrolling', false);

	// 스크롤 이벤트 (요소 개별) - 이벤트 중복 방지 (off, on)
	$wrap.off('scroll.positionEvent').on('scroll.positionEvent', function () {
		if ($wrap.data('scrolling')) return;

		const scrollTop = $wrap.scrollTop();
		let expHeight = 0;

		if ($(this).hasClass('am_content') && scrollTop == 0 ) {
			$('.amc_nav').removeClass('active');
		} else {
			$('.amc_nav').addClass('active');
		}


		if ($wrap.find('.pew_exception').length) {
			const $simpleInfoWrap = $wrap.find('.simple_info_wrap');
			const $tagItemWrap = $wrap.find('.tag_item_wrap');
			const hasPoEtc1 = $wrap.find('.tag_item_wrap_po_etc1').length > 0;
			const $titWrap = $wrap.find('.pec_point .title_h3');

			const simpleInfoHeight = $simpleInfoWrap.outerHeight() || 0;
			const tagItemHeight = $tagItemWrap.outerHeight() || 0;
			const titWrapHeight = $titWrap.outerHeight() || 0;

			const exceptionHeight = simpleInfoHeight + tagItemHeight;
			expHeight = hasPoEtc1 ? exceptionHeight - titWrapHeight * 2 : exceptionHeight;
		}


		let activeIdx = -1;

		$contents.each(function (index) {
			const targetTop = $(this).offset().top;
			const containerTop = $scrollArea.offset().top;
			const scrollY = targetTop - containerTop + expHeight;

			if (scrollY < scrollTop + 10) {
				activeIdx = index;
			}
		});

		if (activeIdx !== -1) {
			$tabBtns.removeClass('active').eq(activeIdx).addClass('active');
		}
	});
}

// input 상태값 표현식
function inputState() {
	//input disabled&readonly	
	$('.input_text input').each(function() {
		if( $(this).closest('.comp_wrap').find('.input_text').length > 1 ) {
			if( $(this).closest('.comp_wrap').find('.comp_wrap_keypad_call').length ) {
				const $parent =  $(this).closest('.comp_wrap');				
				const lngInp = $parent.find('.input_text').length;
				const lngInpReadonly = $parent.find('.input_text input[readonly]').length;
				const lngInpDisabled = $parent.find('.input_text input[disabled]').length;
				const $keyPad = $parent.find('.comp_wrap_keypad_call');
				if( lngInp === lngInpReadonly && $keyPad.attr('aria-disabled') === 'true' ) {
					$(this).closest('.comp_wrap').addClass('readonly');
				} else if (lngInp === lngInpDisabled && $keyPad.attr('aria-disabled') === 'true') {
					$(this).closest('.comp_wrap').addClass('disabled');
				}
			} else {
				const lngInp = $(this).closest('.comp_wrap').find('.input_text').length;
				const lngInpReadonly = $(this).closest('.comp_wrap').find('.input_text input').prop('readonly').length;
				const lngInpDisabled = $(this).closest('.comp_wrap').find('.input_text input').prop('disabled').length;
				if( lngInp === lngInpReadonly ) {
					$(this).closest('.comp_wrap').addClass('readonly');
				} else if (lngInp === lngInpDisabled) {
					$(this).closest('.comp_wrap').addClass('disabled');
				}
			}
		} else {
			const $this = $(this),
					$wrapBox = $this.closest('.comp_wrap'),
					$wrapCard = $this.closest('.card'),
					$inpBox = $this.closest('.input_text'),
					$wrapCalendar = $this.closest('.calendar'),
					isDisabled = $this.prop('disabled'),
					isReadonly = $this.prop('readonly');
		
			if (isReadonly) {
				if($wrapCard.length) {
					$wrapBox.addClass('readonly');
				} else if($wrapCalendar.length) {
					$this.siblings('.calendar_call').prop('disabled', true);
				} 
				if(!$wrapBox.length) {
					$inpBox.addClass('readonly');
				} else if ($wrapBox.length) {
					$inpBox.addClass('readonly');
				}
				if ( $wrapBox.find('.comp_wrap_keypad_call').attr('aria-disabled') === 'true' ) {
					$wrapBox.addClass('readonly');
				}
			} 
			if (isDisabled) {
				if($wrapCard.length) {
						$wrapBox.addClass('disabled');
				} else if($wrapCalendar.length) {
					$this.siblings('.calendar_call').prop('disabled', true);
				}
				if(!$wrapBox.length) {
					$inpBox.addClass('disabled');
				} else if ($wrapBox.length) {
					$inpBox.addClass('disabled');
				}
				if ( $wrapBox.find('.comp_wrap_keypad_call').attr('aria-disabled') === 'true' ) {
					$wrapBox.addClass('disabled');
				}
			}
		}
	});
	inpPhoneFormat();
}

function inpPhoneFormat() {
	$('.input_text').each(function() {
		if( $(this).hasClass('phone') && $(this).hasClass('readonly') || $(this).hasClass('phone') && $(this).hasClass('disabled') ){
			const $inp = $(this).children('.inp').find('input');
			let val = $inp.val();
			val = val.replace(/[^0-9*]/g, '');
			newVal = ' - ' + val.replace(/([0-9*]{4})(?=[0-9*])/g, '$1 - ');
			$inp.val(newVal).addClass('isVal');
		}
	});
}

$(window).on('load', function() {
	inputState();
	
	// 폼요소 라디오, 체크박스 타이틀 연결 필요시 살릴 소스
	// $('.form_line').each(function(index) {
	// 	const $formBox = $(this);
	// 	const $formLabel = $formBox.find('.label_tit');
	// 	const $formRadio = $formBox.find('.radio_group_wrap');
	// 	const $formCheck = $formBox.find('.checkbox_group_wrap');

	// 	if ($formRadio.length) {
	// 		const labelId = 'label_radio_' + (index + 1);
	// 		$formLabel.attr('id', labelId);
	// 		$formRadio.attr('aria-labelledby', labelId);
	// 	}

	// 	if ($formCheck.length) {
	// 		const labelId = 'label_check_' + (index + 1);
	// 		$formLabel.attr('id', labelId);
	// 		$formCheck.attr('aria-labelledby', labelId);
	// 	}
	// });
});

$(function(){
	// tab Scroll
	tabScroll();

	currentPlan();
	fixedMenuPlay();
	
	nbList();//알릴고지 넘버링

	// 펼치기/접히기 - 담보한번에변경하기(MPRMTPS10004001000)
	moreLngChk();

	// 스크롤 이벤트 초기화 및 동적 생성시 재 호출
	$('.position_event_wrap').each(function () {
		initPositionEventWrap($(this));
	});

	simpleInfo();


	//input disabled&readonly
	/*
	$('.input_text input').each(function() {
		const $this = $(this),
			  $wrapBox = $this.closest('.comp_wrap'),
			  $wrapCard = $this.closest('.card'),
			  $inpBox = $this.closest('.input_text'),
			  $wrapCalendar = $this.closest('.calendar'),
			  isDisabled = $this.prop('disabled'),
			  isReadonly = $this.prop('readonly');
	
		if (isReadonly) {
			if($wrapCard.length) {
				$wrapBox.addClass('readonly');
			} else if($wrapCalendar.length) {
				$this.siblings('.calendar_call').prop('disabled', true);
			} 
			if(!$wrapBox.length) {
				$inpBox.addClass('readonly');
			} else if ($wrapBox.length) {
				$inpBox.addClass('readonly');
			}
		} 
		if (isDisabled) {
			if($wrapCard.length) {
			  	$wrapBox.addClass('disabled');
			} else if($wrapCalendar.length) {
				$this.siblings('.calendar_call').prop('disabled', true);
			}
			if(!$wrapBox.length) {
				$inpBox.addClass('disabled');
			} else if ($wrapBox.length) {
				$inpBox.addClass('disabled');
			}
		}
	});
	*/

	// 달력 호출
	// let $lastCalendarCallBtn = null;
	$.datepicker.setDefaults({
		dateFormat: 'yy.mm.dd',
		prevText: '이전 달',
		nextText: '다음 달',
		showOn: "none",
		showOtherMonths: true,
		showMonthAfterYear: true,
		yearSuffix: "년",
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
		// showAnim: "slideDown",
		duration: 300,

		// 닫기 버튼 추가
		showButtonPanel: true,
		closeText: "닫기",
		currentText: "오늘",
		// 닫기 버튼 추가

		beforeShow: function () { 
			$("body").addClass('modal_open');
		},
	});

	$(".inp_picker").datepicker();

	$(".calendar_call").on("click", function (e) {
		e.preventDefault();	
		const $btn = $(this);
		const $input = $btn.siblings(".inp_picker");
		$input.datepicker("show");
	});	
	// 달력 호출

	// 라디오 약관 동의
	$('.ag_groups').each(function () {
		const $groups = $(this);
		const $totalCheck = $groups.find('.ag_total');
	
		// 전체 그룹 체크 제어
		$totalCheck.on('change', function () {
			const isChecked = $(this).is(':checked');
			$groups.find('.agw_all').prop('checked', isChecked).trigger('change'); // 각 그룹에 위임
		});
	
		// 그룹 단위로 동작 유지
		$groups.find('.ag_group_wrap').each(function () {
			const $groupWrap = $(this);
			const $allCheck = $groupWrap.find('.agw_all');
	
			// 그룹 전체 라디오 제어
			$allCheck.on('change', function () {
				const isChecked = $(this).is(':checked');
				$groupWrap.find('.agr_dept1.ag').prop('checked', isChecked);
				$groupWrap.find('.agr_dept1.noag').prop('checked', !isChecked);
				$groupWrap.find('.ags_sub_all, .ags_sub_chk').prop('checked', isChecked).prop('disabled', !isChecked);
				$groupWrap.find('.agr_dept2').prop('checked', isChecked);
	
				updateTotalCheckState(); // 상위 전체동의 상태도 반영
			});
	
			// 하위 전체 체크 제어
			$groupWrap.on('change', '.ags_sub_all', function () {
				const isChecked = $(this).is(':checked');
				const $agrdoGroupSub = $(this).closest('.agrdo_group_sub');
	
				$agrdoGroupSub.find('.ags_sub_chk').prop('checked', isChecked);
	
				if (isChecked) {
					$agrdoGroupSub.prev('.agrdo_group').find('.agr_dept1.ag').prop('checked', true);
				}
			});
	
			// 개별 체크 -> 전체 체크 상태 반영
			$groupWrap.on('change', '.ags_sub_chk', function () {
				const $agrdoGroupSub = $(this).closest('.agrdo_group_sub');
				const allSubChk = $agrdoGroupSub.find('.ags_sub_chk');
				const isAllSubChecked = allSubChk.length === allSubChk.filter(':checked').length;
	
				$agrdoGroupSub.find('.ags_sub_all').prop('checked', isAllSubChecked);
	
				if (isAllSubChecked) {
					$agrdoGroupSub.prev('.agrdo_group').find('.agr_dept1.ag').prop('checked', true);
				}
			});
	
			// 라디오 변경 -> 하위 체크박스 제어
			$groupWrap.on('change', '.agr_dept1', function () {
				const $this = $(this);
				const $agrdoGroup = $this.closest('.agrdo_group');
				const $subGroup = $agrdoGroup.next('.agrdo_group_sub');
	
				if ($subGroup.length) {
					if ($this.hasClass('noag') && $this.is(':checked')) {
						$subGroup.find('input[type="checkbox"]').prop('checked', false).prop('disabled', true);
					} else if ($this.hasClass('ag') && $this.is(':checked')) {
						$subGroup.find('input[type="checkbox"]').prop('disabled', false).prop('checked', true);
					}
				}
	
				updateGroupCheckState();
				updateTotalCheckState(); // 그룹 갱신 시 전체도 갱신
			});

			// ag_group_cont 하위 체크박스 제어
			$groupWrap.on('change', '.agr_dept2', function () {
				const $this = $(this);
	
				updateGroupCheckState();
				updateTotalCheckState(); // 그룹 갱신 시 전체도 갱신
			});

			$groupWrap.on('change', '.agr_r_group', function () {
				// console.log('1');
				const $this = $(this);
				if (!$this.is(':checked')) return;

				const index = $this.closest('.inp_radio').index();
				// console.log(index);
			
				const $agGroupCont = $this.closest('.ag_group_cont');

				$agGroupCont.find('.agc_item').each(function () {
					$(this).find('.radio_group_wrap .inp_radio').eq(index).find('.agr_r_group').prop('checked', true);;
				});

				updateGroupCheckState();
				updateTotalCheckState(); // 그룹 갱신 시 전체도 갱신

			});
	
			// 그룹 단위 전체 동의 상태 갱신
			function updateGroupCheckState() {
				const totalAgr = $groupWrap.find('.agr_dept1.ag');
				const totalNoAgr = $groupWrap.find('.agr_dept1.noag');
				const totalDpt2 = $groupWrap.find('.agr_dept2');
	
				let isAllAgreed = true;
	
				totalAgr.each(function () {
					if (!$(this).is(':checked')) {
						isAllAgreed = false;
						return false;
					}
				});
	
				totalNoAgr.each(function () {
					if ($(this).is(':checked')) {
						isAllAgreed = false;
						return false;
					}
				});

				totalDpt2.each(function () {
					if (!$(this).is(':checked')) {
						// console.log('단위체크중?');
						isAllAgreed = false;
						return false;
					}
				});
	
				$groupWrap.find('.agw_all').prop('checked', isAllAgreed);
			}
		});
	
		// 상위 전체 동의 체크 상태 갱신
		function updateTotalCheckState() {
			const allGroups = $groups.find('.ag_group_wrap');
			const agreedGroups = allGroups.filter(function () {
				const ag = $(this).find('.agr_dept1.ag');
				const noag = $(this).find('.agr_dept1.noag');
				const dpt2 = $(this).find('.agr_dept2');
	
				let isAgreed = true;
	
				ag.each(function () {
					if (!$(this).is(':checked')) {
						isAgreed = false;
						//console.log('ag : ' + isAgreed);
						return false;
					}
				});
				noag.each(function () {
					if ($(this).is(':checked')) {
						isAgreed = false;
						//console.log('noag : ' + isAgreed);
						return false;
					}
				});
				dpt2.each(function () {
					if (!$(this).is(':checked')) {
						isAgreed = false;
						//console.log('확인중? : ' + isAgreed);
						return false;
					}
				});
				return isAgreed;
			});
	
			const isAllAgreed = allGroups.length === agreedGroups.length;
			// console.log('체크 : ' + allGroups.length + ' : ', + agreedGroups.length);
			$totalCheck.prop('checked', isAllAgreed);
			// console.log('$totalCheck : ' + $totalCheck);
		}
	});
	// 라디오 약관 동의
	
	/* 광고성 정보의 수신동의 - 개별 Case */
	$(".sep_chk_box").on("change", '.sep_sub_chk', function () {
		const $agrdoGroupSub = $(this).closest(".sep_chk_box");
		const allSubChk = $agrdoGroupSub.find(".sep_sub_chk");
		const isAllSubChecked = allSubChk.length === allSubChk.filter(":checked").length;

		$agrdoGroupSub.find(".sep_sub_all").prop("checked", isAllSubChecked);
	});

	$(".sep_chk_box").on("change", '.sep_sub_all', function(){
		const isChecked = $(this).is(":checked");
		const $agrdoGroupSub = $(this).closest(".sep_chk_box");

		$agrdoGroupSub.find(".sep_sub_chk").prop("checked", isChecked);
	});
	/* 광고성 정보의 수신동의 - 개별 Case */

	// 큰글씨 모드
	// 확대 버튼 클릭 이벤트
	$('.z_up').on('click', function() {
		const zContent = $(this).closest('.zoom_wrap').find('.zoom_content');
		// var currentFontSize = parseFloat($('.zoom_content').css('zoom'));
		var currentFontSize = parseFloat(zContent.css('zoom'));
		var newFontSize = currentFontSize + 0.1;
		zContent.css('zoom', newFontSize);
	});

	// 축소 버튼 클릭 이벤트
	$('.z_down').on('click', function() {
		const zContent = $(this).closest('.zoom_wrap').find('.zoom_content');
		var currentFontSize = parseFloat(zContent.css('zoom'));
		var newFontSize = currentFontSize - 0.1;
		if (newFontSize >= 1) {
			zContent.css('zoom', newFontSize);
		}
	});
	// 큰글씨 모드	

	//이메일 자동완성
	function autoCompleteEmail() {
		let $inputContainer = $(".input_text");
		let $inputEmail = $("input.email_auto");
		let $autoCont = $(".mail_list_cont");
		let $mailList = $(".mail_list");

		const etcWord = "직접입력";
		const domainArr = [
			"naver.com",
			"gmail.com",
			"hanmail.net",
			"daum.net",
			"kakao.com",
			"nate.com",
			"yahoo.co.kr",
		];

		$inputEmail.on("keyup", function () {
			removeAutoCont();
			const $selfThis = $(this);
			const value = $selfThis.val();
			const listhtml = "<div class='mail_list_cont' tabindex='0'><ul class='mail_list' tabindex='0'></ul></div>";
			$(this).closest(".inp").after(listhtml);
			$inputContainer = $(this).closest(".input_text");
			$autoCont = $inputContainer.find(".mail_list_cont");
			$mailList =  $inputContainer.find(".mail_list");

			$mailList.on("focusout", function (e) {
				detectFocus(e);
			});

			if (value.includes("@") || value.length < 3) {
				removeAutoCont();
				return;
			}

			if (value.length >= 3) {
				showAutoCont(value,$selfThis);
			}
		});

		//메서드 영역
		function showAutoCont(value,_self) {

			domainArr.forEach(domain => {
				const $listItem = $(`<li><button type='button' class='text'>` + value + `<span class='mark'>@` + domain + `</span></button></li>`);
				$listItem.on("click", function () {
					const item = $(this).text();
					_self.val(item);
					removeAutoCont();
				});
				$mailList.append($listItem);
				
			});

			const $etcItem = $("<li><button type='button' class='text'>" + etcWord + "</button></li>");
			$mailList.append($etcItem);
			$etcItem.on("click", function () {
				removeAutoCont();
			});

			$autoCont.addClass("on");
		}

		function removeAutoCont() {
			if ($autoCont.length > 0) {
				$autoCont.remove();
			}
		}

		function detectFocus(e) {
			setTimeout(() => {
				const target = $(document.activeElement);
				if ($inputContainer.length && !$inputContainer.is(target) && $inputContainer.has(target).length == 0) {
					removeAutoCont();
				}
			}, 0);
		}

		//이벤트 리스너 영역
		$(document).on("click", function (e) {
			const target = $(e.target);
			const isEmailContainer = $inputEmail.is(target) || $inputEmail.has(target).length > 0 || $autoCont.is(target) || $autoCont.has(target).length > 0;
			if (!isEmailContainer) removeAutoCont();
		});

		$inputEmail.on("blur", function (e) {
			detectFocus(e);
		});
	}
	autoCompleteEmail();


	// 진입 시 전화번호 포맷 - readonly만 적용
	// $('.input_text').each(function() {
	// 	if( $(this).hasClass('phone') && $(this).hasClass('readonly') ){
	// 		const $inp = $(this).children('.inp').find('input');
	// 		let val = $inp.val();
	// 		// console.log(val);
	// 		// val = val.replace(/[^0-9]/g, '');
	// 		// newVal = ' - ' + val.replace(/(\d{4})(?=\d)/g, '$1 - ');
	// 		$inp.val(newVal).addClass('isVal');
	// 	}
	// });


	/* 페이지 내 스크롤 이벤트 */
	// 모바일 - MY Page - 보험진단 서비스 - 보험 진단 결과 페이지에서만 사용 중
	$('.container').on('scroll', function(){
		const $this = $(this),
					scrollTop = $this.scrollTop();
		if($('.anchor_wrap').length){
			$('.anchor_move').each(function(idx){
				const sectionOffset = $(this).offset().top,
							anchorH = $('.anchor_wrap').innerHeight(),
							headerH = $('.header').innerHeight(),
							compareVal = scrollTop + sectionOffset - anchorH - headerH - 48;
				if(scrollTop > compareVal){
					$('.anchor_wrap').find('.anchor_btn').removeClass('active');
					$('.anchor_wrap').find('.anchor_btn').eq(idx).addClass('active');
				}
			})
		}
	});

	// ready

	//MY - 대출신청금액입력 MMYLOAN10002010000 접고 펼치기 
	$('.bottom_panel').each(function () {
		const $bottomPanel = $(this);
		const $btnToggle = $bottomPanel.find('.bottom_panel_toggle');
		const $itemHiddens = $bottomPanel.find('.item_hidden');

		// 초기 설정
		$btnToggle.attr('aria-expanded', 'false');
		$itemHiddens.attr('aria-hidden', 'true');

		$btnToggle.on('click', function () {
			togglePanel($bottomPanel, $btnToggle, $itemHiddens);
		});

		function togglePanel($panel, $button, $items) {
			const isExpanded = $panel.hasClass('active');
		
			// 상태 토글
			$panel.toggleClass('active', !isExpanded);
			$button.attr('aria-expanded', !isExpanded);
			$button.text(!isExpanded ? '접기' : '펼치기');
			$items.attr('aria-hidden', !!isExpanded);
			!isExpanded ? $items.slideDown() : $items.slideUp();

			const eventNamespace = '.focusLoop';
			$panel.off('keydown' + eventNamespace); // 기존 이벤트 제거

			if (isExpanded) return; // 접히는 상태일 때만 포커스 트랩 적용하지 않음

			// 포커스 트랩 설정 (펼쳐질 때만)
			const $focusable = $panel.find('a, button, [tabindex="0"], input, textarea, select').filter(':visible');
			if ($focusable.length === 0) return;

			const $first = $focusable.first();
			const $last = $focusable.last();

			$panel.on('keydown' + eventNamespace, function (e) {
				if (e.key !== 'Tab') return;

				const $active = $(document.activeElement);
				if (e.shiftKey && $active.is($first)) {
					e.preventDefault();
					$last.focus();
				} else if (!e.shiftKey && $active.is($last)) {
					e.preventDefault();
					$first.focus();
				}
			});
		}
	});

	// s: 상품설명서 주요 내용 스크롤 이동 버튼
	const $popupCont = $('.popup_cont');
  const $fixedButton = $('.scroll_down');
  const $moveTarget = $popupCont.find('.move');

	let moveTargetPosition = 0;
	if ($moveTarget.length) {
		moveTargetPosition = $moveTarget.position().top;
	}

	let scrollingChk = false; // 스크롤 중복 실행 방지 플래그	

  // 스크롤 이벤트
  $popupCont.on('scroll', function() {
		if (scrollingChk) return;
		// if ( $(this).find('.move').length === 0 ) return; // .move가 없으면 실행하지 않음
		const $thisPopupCont = $(this); // 현재 스크롤된 .popup_cont
		const $popupWrap = $thisPopupCont.closest('.popup_wrap');
		const $fixedButton = $popupWrap.find('.scroll_down');
		const $doneButton = $popupWrap.find('.done');
	
		const currentScrollTopInPopup = $thisPopupCont.scrollTop();
		const scrollHeight = this.scrollHeight; // DOM element 접근
		const clientHeight = $thisPopupCont.height();
	
		// console.log('currentScrollTopInPopup: ' + currentScrollTopInPopup);
	
		// 스크롤이 최하단에 도달했는지 확인
		if (currentScrollTopInPopup + clientHeight >= scrollHeight - 80) {
			$fixedButton.hide();
			$doneButton.show();
		}
	});

  // 하단 고정 버튼 클릭 이벤트	
  $fixedButton.on('click', function() {
		if (scrollingChk) return; // 이미 스크롤 중이면 중복 실행 방지
		scrollingChk = true; // 스크롤 시작 시 플래그 설정
		// 스크롤 애니메이션
		const $popupContThis = $(this).closest('.popup_wrap').find('.popup_cont');
    const currentScrollTopInPopup = $popupContThis.scrollTop();
    if (currentScrollTopInPopup < moveTargetPosition - 88) {
      $popupContThis.animate({
        scrollTop: moveTargetPosition - 88
      }, 800, function(){
				moveTargetPosition = $popupContThis.scrollTop();
				scrollingChk = false; // 스크롤 완료 후 플래그 해제
			});
			// console.log('event 1');
    } else {
      $popupContThis.animate({
        scrollTop: $popupContThis[0].scrollHeight - $popupContThis.outerHeight()
      }, 800, function(){
				scrollingChk = false; // 스크롤 완료 후 플래그 해제
				$(this).closest('.popup_wrap').find('.scroll_down').hide();
				$(this).closest('.popup_wrap').find('.done').show();
			});
			// console.log('event 2');
    }
  });
	// e: 상품설명서 주요 내용 스크롤 버튼

	// ready

});

function moreLngChk() {
	// 펼치기/접히기 - 담보한번에변경하기(MPRMTPS10004001000)
	$('.acd_tg_bottom').each(function(){
		const $this = $(this),
					$item = $this.find('.select_radio_item'),
					$btn = $item.find('.rd_btn');
		let btnLength = $btn.length;

		if(btnLength <= 4){
			$this.find('.btn_area').remove();
		}
	});
}

// 상품설명서 주요 내용 reset
function resetProDesc() {
	moveTargetPosition = 0; // 스크롤 위치 초기화
	$('.popup_wrap').find('.done').hide();
	$('.popup_wrap').find('.scroll_down').show();
}
// 상품설명서 주요 내용 reset

//알릴고지 숫자 표기
function nbList() {
	$('ol.form_list > li').each(function (index) {
		const $labels = $(this).find('> .form_group_wrap > .form_line > .label_tit'); // 여러 개일 수 있음
		const num = (index + 1).toString().padStart(2, '0');
		
		$labels.find('.num').remove(); // 기존 번호 삭제

		$labels.each(function (i) {
			let numStr = num;
			if ($labels.length > 1 && i > 0) {
			  numStr += `-${i}`;
			}
			$(this).prepend(`<span class="num">${numStr}</span>`);
		});
	});
}

$(window).resize(function(){
	// prograssBar();
})

//window click이벤트
$(window).on('click', function(e) {
	var $target = $(e.target);

	// 범용 테스트
	var $test_item = $('.test_item, .test_item2');
	if (!$target.closest($test_item).length) {
		$test_item.removeClass('active');
	}

	// footer sns 링크 팝업 외부 클릭 시 닫기
	if ( !$target.closest('.ftr_sns_list').length && !$target.closest('.ftr_sns_open').length ) {
		$('.ftr_sns_list').removeClass('active');
		$('.ftr_sns_open').attr('title', '다이렉트 SNS 목록보기');
	}

	// 메뉴 검색 팝업 외부 클릭 시 닫기
	var $asm = $('.hsu_search');
	var $asm_text = $('.hsu_search .text');
	var $asm_wrap = $('.all_menu_search_wrap');
	if (!$target.closest($asm).length && !$target.closest($asm_wrap).length) {
		// console.log('외부 클릭 감지:', $target);
		$asm_wrap.removeClass('active');
		$asm.attr('aria-expanded', false).removeClass('active');
		$asm_text.text('메뉴검색 팝업 열기');
		// $('.wrap').removeClass('scroll_lock');
		
		if(!$target.hasClass('hus_btn')) {
			// 추후 알림, 장바구니 팝업 완료 시 사용
			// $('.wrap').removeClass('scroll_lock');
		}
	}
});