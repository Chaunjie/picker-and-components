/**
 * 弹出选择列表插件
 * varstion 1.0.0
 * by Chaunjie
 */

(function ($, window) {
    //创建 DOM
    $.dom = function (str) {
        if (typeof(str) !== 'string') {
            if ((str instanceof Array) || (str[0] && str.length)) {
                return [].slice.call(str);
            } else {
                return [str];
            }
        }
        if (!$.__create_dom_div__) {
            $.__create_dom_div__ = document.createElement('div');
        }
        $.__create_dom_div__.innerHTML = str;

        return [].slice.call($.__create_dom_div__.childNodes);
    };

    var panelBuffer = '<div class="poppicker">\
		<div class="poppicker-header">\
			<button class="picker-btn poppicker-btn-cancel">取消</button>\
			<button class="picker-btn picker-btn-info poppicker-btn-ok">确定</button>\
			<div class="poppicker-clear"></div>\
		</div>\
		<div class="poppicker-body">\
		</div>\
	</div>';

    var pickerBuffer = '<div class="picker">\
		<div class="picker-inner">\
			<div class="pciker-rule pciker-rule-ft"></div>\
			<ul class="pciker-list">\
			</ul>\
			<div class="pciker-rule pciker-rule-bg"></div>\
		</div>\
	</div>';

    //定义弹出选择器类
    function PopPicker(options){
        this.init(options);
    }

    PopPicker.prototype.options = {

    };

    PopPicker.prototype.init = function(options){
        var self = this;
        self.options = options || {};
        self.options.buttons = self.options.buttons || ['取消', '确定'];
        self.panel = $.dom(panelBuffer)[0];
        document.body.appendChild(self.panel);
        self.ok = self.panel.querySelector('.poppicker-btn-ok');
        self.cancel = self.panel.querySelector('.poppicker-btn-cancel');
        self.body = self.panel.querySelector('.poppicker-body');
        self.mask = this.createMask();
        self.cancel.innerText = self.options.buttons[0];
        self.ok.innerText = self.options.buttons[1];
        self.cancel.addEventListener('touchstart', function(event) {
            self.hide();
        }, false);
        self.ok.addEventListener('touchstart', function(event) {
            if (self.callback) {
                var rs = self.callback(self.getSelectedItems());
                if (rs !== false) {
                    self.hide();
                }
            }
        }, false);
        self.mask[0].addEventListener('touchstart', function() {
            self.hide();
        }, false);
        self._createPicker();
        //防止滚动穿透
        self.panel.addEventListener('touchstart', function(event) {
            event.preventDefault();
        }, false);
        self.panel.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, false);
    };

    PopPicker.prototype.createMask = function(callback){
        var element = document.createElement('div');
        element.classList.add('backdrop');
        element.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });
        element.addEventListener('touchstart', function() {
            mask.close();
        });
        var mask = [element];
        mask._show = false;
        mask.show = function() {
            mask._show = true;
            element.setAttribute('style', 'opacity:1');
            document.body.appendChild(element);
            return mask;
        };
        var self = this;
        mask._remove = function() {
            if (mask._show) {
                mask._show = false;
                element.setAttribute('style', 'opacity:0');
                self.later(function() {
                    var body = document.body;
                    element.parentNode === body && body.removeChild(element);
                }, 350);
            }
            return mask;
        };
        mask.close = function() {
            if (callback) {
                if (callback() !== false) {
                    mask._remove();
                }
            } else {
                mask._remove();
            }
        };
        return mask;
    };

    PopPicker.prototype.later = function(fn, when, context, data) {
        when = when || 0;
        var m = fn;
        var d = data;
        var f;
        var r;

        if (typeof fn === 'string') {
            m = context[fn];
        }

        f = function() {
            m.apply(context, $.isArray(d) ? d : [d]);
        };

        r = setTimeout(f, when);

        return {
            id: r,
            cancel: function() {
                clearTimeout(r);
            }
        };
    };

    PopPicker.prototype._createPicker = function(){
        var self = this;
        var layer = self.options.layer || 1;
        var width = (100 / layer) + '%';
        self.pickers = [];
        for (var i = 1; i <= layer; i++) {
            var pickerElement = $.dom(pickerBuffer)[0];
            pickerElement.style.width = width;
            self.body.appendChild(pickerElement);
            var picker = $(pickerElement).picker();
            self.pickers.push(picker);
            pickerElement.addEventListener('change', function(event) {
                var nextPickerElement = this.nextSibling;
                if (nextPickerElement && nextPickerElement.picker) {
                    var eventData = event.detail || {};
                    var preItem = eventData.item || {};
                    nextPickerElement.picker.setItems(preItem.children);
                }
            }, false);
        }
    };

    PopPicker.prototype.setData = function(data) {
        var self = this;
        data = data || [];
        self.pickers[0].setItems(data);
    };

    PopPicker.prototype.getSelectedItems = function() {
        var self = this;
        var items = [];
        for (var i in self.pickers) {
            var picker = self.pickers[i];
            items.push(picker.getSelectedItem() || {});
        }
        return items;
    };
    //显示
    PopPicker.prototype.show = function(callback) {
        var self = this;
        self.callback = callback;
        self.mask.show();
        document.body.classList.add('poppicker-active-for-page');
        self.panel.classList.add('active');
        //处理物理返回键
        self.__back = function() {
            self.hide();
        };
    };
    //隐藏
    PopPicker.prototype.hide = function() {
        var self = this;
        if (self.disposed) return;
        self.panel.classList.remove('active');
        self.mask.close();
        document.body.classList.remove('poppicker-active-for-page');
        //处理物理返回键
        $.back = self.__back;
    };
    PopPicker.prototype.dispose = function() {
        var self = this;
        self.hide();
        setTimeout(function() {
            self.panel.parentNode.removeChild(self.panel);
            for (var name in self) {
                self[name] = null;
                delete self[name];
            };
            self.disposed = true;
        }, 300);
    };

    window.PopPicker = PopPicker;

})(jQuery, window);
