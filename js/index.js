var showMsgNum = 3; // 显示消息条数目
var refreshTime = 1000; // 刷新时间
var iconList = ['&#xe600',
	'&#xe602',
	'&#xe603',
	'&#xe604',
	'&#xe606',
	'&#xe607',
	'&#xe608',
	'&#xe609',
	'&#xe60a',
	'&#xe60b',
	'&#xe60c',
	'&#xe60e',
	'&#xe60f',
	'&#xe610',
	'&#xe611',
	'&#xe613',
	'&#xe86e',
	'&#xe685',
	'&#xe68d',
	'&#xe7f8',
	'&#xe82e',
	'&#xe830',
	'&#xe84a',
	'&#xe84b',
	'&#xe84d',
	'&#xe8f3',
	'&#xe601',
	'&#xe605',
	'&#xe632',
	'&#xe648',
	'&#xe652',
	'&#xe6b3',
	'&#xe623',
	'&#xe64b',
	'&#xe6bc',
	'&#xe6c3',
	'&#xe6db',
	'&#xe6dc',
	'&#xe618',
	'&#xe61f',
	'&#xe64a',
	'&#xe617',
	'&#xe642',
	'&#xe680'
];
var colorList = ["yellow", "red", "green", "blue", "pink"]; // 颜色数组
var styleObjs = {
	yellow: {
		color: "#ffff00",
		shadow: "rgba(255, 255, 0, 0.6)"
	},
	red: {
		color: "#ff4c4c",
		shadow: "rgba(255, 0, 0, 0.6)"
	},
	green: {
		color: "#79d279",
		shadow: "rgba(179, 230, 179, 0.6)"
	},
	purple: {
		color: "#862d69",
		shadow: "rgba(204,50,153, 0.6)"
	},
	blue: {
		color: "#5bd0ff",
		shadow: "rgba(162,236,255, 0.6)"
	},
	pink: {
		color: "#ff8fff",
		shadow: "rgba(255,118,255, 0.6)"
	}
};
var pageDataList = []; // 热榜数据列表
var reachBottomCount = 1; // 列表触底次数

function colorRGB2Hex(color) { // 颜色rgb转16进制
	var rgb = color.split(',');
	var r = parseInt(rgb[0].split('(')[1]);
	var g = parseInt(rgb[1]);
	var b = parseInt(rgb[2].split(')')[0]);

	var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	return hex;
}

function colorHex2Rgb(color) { // 颜色16进制转rgb
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	var sColor = color.toLowerCase();
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			var sColorNew = "#";
			for (var i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for (var i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
		}
		return "RGB(" + sColorChange.join(",") + ")";
	} else {
		return sColor;
	}
}

// function functionbindObjPropToDomElem(obj, property, domElem) {// Dom数据绑定
// 	Object.observe(obj, function(changes) {
// 		changes.forEach(function(change) {
// 			$(domElem).text(obj[property]);
// 		});
// 	});
// }

function getData(successFn, errFn) {
	var topicUrl = 'https://www.tophub.fun:8888/v2/GetAllInfoGzip';
	var reqData = {
		id: 85,
		page: 0
	};
	$.ajax({
		url: topicUrl,
		type: 'GET',
		contentType: "application/json",
		data: reqData,
		success: function(res) {
			console.log(res);

			successFn(res);
		},
		error: function(err) {
			// console.log(err);
			errFn(e);
		}
	})
}

function initPage() {
	getData((res) => {
		pageDataList = res.Data.data;
		drawPageList(pageDataList);
		initSwiper();
	})
}

function initSwiper() {
	if(mySwiper) {
		mySwiper.destroy(true,true);
	}
	mySwiper = new Swiper('.swiper-container', {
		direction: 'vertical', // 垂直切换选项
		// loop: true, // 循环模式选项
		autoplay: { // 自动播放
			delay: 10000,
			stopOnLastSlide: false,
			disableOnInteraction: false, // 用户操作后是否禁止自动播放
		},
		slidesPerView: showMsgNum,
		centeredSlides: true,
		mousewheel: true,
		spaceBetween: 90,
		initialSlide: 1,
		on: {
			reachEnd: function() {
				console.log('到了最后一个slide' + '，触底次数：' + reachBottomCount);
				if(reachBottomCount > 3) {
					initPage();
				}else{
					reachBottomCount++;
				}
			},
		},
	})
}

function updateList() {
	var newDataList = [];
	getData((res => {
		newDataList = res.Data.data;
	}), err => {
		console.log(err);
	});
}

function drawPageList(dataList) {
	var swiper = document.getElementById("swiper-wrapper");
	$("#swiper-wrapper").empty(); // empty() 方法移除被选元素的所有子节点和内容。

	//动态的创建li,加入到ul中
	for (let i = 0; i < dataList.length; i++) {
		var msgItemMainNode = document.createElement("div");
		msgItemMainNode.setAttribute("id", dataList[i]['id']);
		msgItemMainNode.classList.add("swiper-slide", "item-container");

		var msgItemIconNode = document.createElement("div");
		var msgItemTextNode = document.createElement("div");
		msgItemIconNode.classList.add("arrow");
		msgItemTextNode.classList.add("text-box");
		msgItemTextNode.setAttribute("data-index", i);
		msgItemTextNode.setAttribute("data-src", dataList[i]['Url']);

		var randomIndex = Math.floor(Math.random() * colorList.length);
		var randomStyle = styleObjs[colorList[randomIndex]];
		msgItemIconNode.style.backgroundColor = randomStyle['color'];
		msgItemIconNode.style.boxShadow = randomStyle['shadow'];

		msgItemTextNode.onclick = msgItemClicked;
		msgItemIconNode.ondblclick = updateList;

		var title = dataList[i]['Title'].trim();
		var desc = dataList[i]['Desc'] ? dataList[i]['Desc'].trim() : "No Desc.";

		var randomIconIndex = Math.floor(Math.random() * iconList.length);
		var randomIconCode = iconList[randomIconIndex];

		var iconNodeStr = "<i class='iconfont";
		if (colorList[randomIndex] == 'yellow') {
			iconNodeStr += " gray-icon'> " + randomIconCode + "</i>";
		} else {
			// iconNodeStr += "'> " + randomIconCode.substr(-3) + randomIconCode + "</i>";
			iconNodeStr += "'> " + randomIconCode + "</i>";
		}
		msgItemIconNode.innerHTML += iconNodeStr;
		msgItemTextNode.innerHTML += "<div class='text-title'> " + title + "</div>" + "<div class='text-info'>" + desc +
			"</div>";

		// msgItemTextNode.mouseenter(handlerIn).mouseleave(handlerOut);
		msgItemTextNode.onmouseenter = handlerIn;
		msgItemTextNode.onmouseleave = handlerOut;
		msgItemIconNode.ondblclick = toggleAutoPlay;

		msgItemMainNode.appendChild(msgItemIconNode);
		msgItemMainNode.appendChild(msgItemTextNode);

		//将li追加到ul中
		swiper.appendChild(msgItemMainNode);
	}
}

function msgItemClicked(ev) {
	var oEvent = ev || event;

	//js阻止事件冒泡
	oEvent.cancelBubble = true;
	oEvent.stopPropagation();

	var target = oEvent.target.parentNode;
	var clickIndex = target.dataset.index;
	var copyStr = target.dataset.src;

	var transfer = $("<input type='text' id='copy_text'>");
	$('body').append(transfer); //form-container是复制按钮的祖先节点
	transfer.val(copyStr)
	transfer.focus();
	transfer.select();
	document.execCommand('Copy', false, null);
	$('#copy_text').remove();
	$('.click-tip').addClass("click-tip-show");
	setTimeout(() => {
		$('.click-tip').removeClass("click-tip-show");
	}, 1600)
}

function handlerIn(e) {
	$(e.currentTarget).children(".text-info").css("animation", "openUp 0.4s forwards")
}

function handlerOut(e) {
	$(e.currentTarget).children(".text-info").css("animation", "fadeUp 0.3s forwards")
}

function toggleAutoPlay() {
	var swiper = document.querySelector('.swiper-container').swiper;
	if (swiper.autoplay.running) {
		swiper.autoplay.stop();
		console.log('停止自动播放');
	} else {
		swiper.autoplay.start();
		console.log('开始自动播放');
	}
}
