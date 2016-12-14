 function lnbControls(){
	  if ($(".content-wrapper").hasClass("wide-expand") == false){
		$(".content-wrapper").addClass("wide-expand").css("z-index");
		$(".content-wrapper").animate({"marginLeft":"0"}, 250, function(){
			$(".main-sidebar .sidebar-menu").animate({"width":"0", "opacity":"0"}, 100);
		});
		$(".main-footer").animate({"marginLeft":"0"}, 250);
	  }else{
		$(".main-footer").animate({"marginLeft":"285px"}, 200);
		$(".content-wrapper").animate({"marginLeft":"285px"}, 200, function(){
			$(".content-wrapper").removeClass("wide-expand");
			$(".main-sidebar .sidebar-menu").animate({"width":"285px","opacity":"1"}, 300);
		});
	  }
  }
   $(".ichkbox").click(function(){
	if ($(this).hasClass("on") == false){
		$(this).addClass("on");
		$(this).find("input").attr("checked", true); 
	}else{
		$(this).removeClass("on");
		$(this).find("input").attr("checked", false); 
	}
  });