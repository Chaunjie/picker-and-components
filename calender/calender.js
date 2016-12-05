(function(root, factory) {
	if ( typeof define === 'function' && define.amd) {
		// AMD
		define(['exports'], factory);
	} else if ( typeof exports === 'object' && typeof exports.nodeName !== 'string') {
		// Node, CommonJS-like
		factory(module.exports);
	} else {
		factory(root);
	}
})(this, function(exports) {"use strict";

	function chargeSupportTouch() {
		var supportsTouch = false;
		if ('ontouchstart' in window) {
			//iOS & android
			supportsTouch = true;
		} else if (window.navigator.msPointerEnabled) {
			//Win8
			supportsTouch = true;
		}
		
		return supportsTouch;
	}


	calender.prototype.options = {
		wrap : 'calender-container',
		dayContainer : '',
		weekDay : ["日", "一", "二", "三", "四", "五", "六"],
		year : 2016,
		month : 12,
		day : 1,
		todayString : '2016-12-1',
		todayYear : 2016,
		todayMonth : 12,
		today : 1,
		days : 31,
		afterClick : '',
		eventName: chargeSupportTouch() ? 'touchstart' : 'click'
	};
	calender.prototype.init = function(options) {
		for (var i in options) {
			this.options[i] = options[i];
		}
		this.options.todayString = this.format(new Date(), "yyyy-MM-dd");
		this.options.day = this.options.today = new Date().getDate();
		this.options.todayYear = this.options.year = new Date().getFullYear();
		this.options.todayMonth = this.options.month = new Date().getMonth() + 1;
		this.options.days = this.getCountDays(this.options.todayString);
		var dayContainer = document.createElement("div");
		dayContainer.className = 'day-container';
		this.options.dayContainer = dayContainer;
		this.renderHtml();
		document.querySelector('.today').click();
	};
	calender.prototype.getWeekByDay = function(dayValue) {
		var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));
		var today = this.options.weekDay;
		return today[day.getDay()];
	};
	calender.prototype.getCountDays = function(dayValue) {
		var curDate = new Date(Date.parse(dayValue.replace(/-/g, '/')));
		var curMonth = curDate.getMonth();
		curDate.setMonth(curMonth + 1);
		curDate.setDate(0);
		return curDate.getDate();
	};
	calender.prototype.format = function(date, fmt) {
		var o = {
			"M+" : date.getMonth() + 1,
			"d+" : date.getDate(),
			"h+" : date.getHours(),
			"m+" : date.getMinutes(),
			"s+" : date.getSeconds(),
			"q+" : Math.floor((date.getMonth() + 3) / 3),
			"S" : date.getMilliseconds()
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};
	calender.prototype.renderDayComponent = function(str) {
		var day = document.createElement("div"), className = '', number = document.createElement("div"), week = document.createElement("div"), dayStr = this.options.year + '-' + this.options.month + '-' + str, weekDay = this.getWeekByDay(dayStr);
		if (this.options.todayYear == this.options.year && this.options.todayMonth == this.options.month && this.options.today == str) {
			className = 'day today';
		} else {
			className = 'day';
		}
		day.className = className;
		number.className = 'text-center day-number';
		number.innerHTML = str;
		week.className = 'text-center day-week';
		week.innerHTML = weekDay;
		day.appendChild(number);
		day.appendChild(week);
		var self = this;
		if (day.addEventListener) {
			//所有主流浏览器，除了 IE 8 及更早 IE版本
			day.addEventListener(this.options.eventName, function() {
				self.setDay(str)
			});
		} else if (day.attachEvent) {
			// IE 8 及更早 IE 版本
			day.attachEvent("onclick", function() {
				self.setDay(str)
			});
		}

		return day;
	};
	calender.prototype.renderHtml = function() {
		var calenderHeader = this.renderHeader();
		this.options.dayContainer.innerHTML = '';
		for (var i = 1; i <= this.options.days; i++) {
			var str = this.options.year + '-' + this.options.month + '-' + i;
			var day = this.renderDayComponent(i);
			this.options.dayContainer.appendChild(day);
		}
		var wrap = document.querySelector(this.options.wrap);
		wrap.innerHTML = '';
		wrap.appendChild(calenderHeader);
		wrap.appendChild(this.options.dayContainer);
	};
	calender.prototype.renderHeader = function() {
		var headerContainer, centerControl, leftBack, leftControl, rightControl, monthText, yearText, self = this, monthArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
		headerContainer = document.createElement('div');
		centerControl = document.createElement('div');
		leftBack = document.createElement('div');
		leftControl = document.createElement('span');
		rightControl = document.createElement('span');
		monthText = document.createElement('span');
		yearText = document.createElement('span');
		headerContainer.className = 'calender-header';
		leftBack.className = 'left-back';
		leftBack.innerHTML = '回到今天';
		if (leftBack.addEventListener) {
			leftBack.addEventListener(this.options.eventName, function() {
				self.backDay();
			});
		} else if (leftBack.attachEvent) {
			leftBack.attachEvent("onclick", function() {
				self.backDay();
			});
		}

		centerControl.className = 'center-control';
		monthText.className = 'text-date month-text';
		monthText.innerText = monthArr[this.options.month - 1];
		yearText.className = 'text-date year-text';
		yearText.innerText = this.options.year;
		leftControl.className = rightControl.className = 'control';
		leftControl.innerHTML = '<';
		rightControl.innerHTML = '>';
		if (leftControl.addEventListener) {
			leftControl.addEventListener(this.options.eventName, function() {
				self.changeMonth('pre');
			});
		} else if (leftControl.attachEvent) {
			leftControl.attachEvent("onclick", function() {
				self.changeMonth('pre');
			});
		}

		if (rightControl.addEventListener) {
			rightControl.addEventListener(this.options.eventName, function() {
				self.changeMonth('next');
			});
		} else if (rightControl.attachEvent) {
			rightControl.attachEvent("onclick", function() {
				self.changeMonth('next');
			});
		}

		centerControl.appendChild(leftControl);
		centerControl.appendChild(monthText);
		centerControl.appendChild(yearText);
		centerControl.appendChild(rightControl);
		headerContainer.appendChild(leftBack);
		headerContainer.appendChild(centerControl);
		return headerContainer;
	};
	calender.prototype.backDay = function() {
		this.options.year = this.options.todayYear;
		this.options.month = this.options.todayMonth;
		this.options.day = this.options.today;
		this.options.days = this.getCountDays(this.options.todayString);
		this.renderHtml();
	};
	calender.prototype.changeMonth = function(preOrNext) {
		preOrNext == "pre" && (--this.options.month == 0) && (this.options.month = 12) && (--this.options.year < 1970) && (this.options.year = 1970);
		preOrNext == "next" && (++this.options.month > 12) && (this.options.month = 1) && (++this.options.year > 2099) && (this.options.year = 2099);
		var str = this.options.year + '-' + this.options.month + '-' + this.options.day;
		var days = this.getCountDays(str);
		this.options.days = days;
		this.renderHtml();
	};
	calender.prototype.setDay = function(day) {
		var domArr = document.querySelectorAll('.day-container > .day');
		var dom = domArr[day - 1];
		var lastDom = domArr[this.options.day - 1];
		if (dom.className.indexOf('today') > 0) {
			if (lastDom.className.indexOf('today') < 0) {
				lastDom.classList.remove('active');
			}
		} else {
			if (lastDom.className.indexOf('today') < 0) {
				lastDom.classList.remove('active');
				dom.classList.add('active');
			} else {
				dom.classList.add('active');
			}
		}

		this.options.day = day;
		var returnData = {};
		returnData.date = this.options.year + '-' + this.options.month + '-' + day;

		returnData.week = '周' + this.getWeekByDay(returnData.date);
		this.options.afterClick && this.options.afterClick(returnData);
	};
	function calender(options) {
		this.init(options)
	}


	exports.calender = calender;
})