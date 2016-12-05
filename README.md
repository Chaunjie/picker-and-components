# picker-and-components
Website
======================
https://chaunjie.github.io/picker-and-components/picker/index.html
https://chaunjie.github.io/picker-and-components/picker/dtpicker.html

Introduction
======================
Transition effect of some CSS3 pages cool, you can also customize their Transition effect.

How to use this library.
=======================
Picker dependent libraries have these.

 - Css library: 
 
 ```
    <link rel="stylesheet" type="text/css" href="./css/picker.css"/>
 ```
 - Javascript library: 

```
	<script src="./js/jquery.js"></script>
	<script src="./js/picker.js"></script>
	<script src="./js/popPicker.js"></script>
	or
	<script src="./js/datePicker.js"></script>
```

Useage
=======================
PopPicker


			var userPicker = new PopPicker();
            userPicker.setData([{
                value: '90',
                text: '优秀'
            }, {
                value: '80',
                text: '良好'
            }, {
                value: '70',
                text: '中等'
            }, {
                value: '60',
                text: '及格'
            }, {
                value: '50',
                text: '不及格'
            }, {
                value: '<50',
                text: '回家吃点补脑液'
            }]);

            var showUserPickerButton = 	   doc.getElementById('showUserPicker');
            var userResult = doc.getElementById('userResult');
            showUserPickerButton.addEventListener('click', function (event) {
                userPicker.show(function (items) {
                    userResult.innerText = JSON.stringify(items[0]);
                    //返回 false 可以阻止选择框的关闭
                    //return false;
                });
            }, false);
    
 DatePicker
 
 			var picker = new DatePicker(options);
                picker.show(function(rs) {
                    //result.innerText = '选择结果: ' + rs.text;
                    alert('选择结果: ' + rs.text);
                    picker.dispose();
                });           
            
            
            
            
