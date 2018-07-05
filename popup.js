
function query(){
	console.log("query")
}

let confirmBtn = document.getElementById('confirm');
let nameInput = document.getElementById('film_input');
let messageDiv = document.getElementById('message');
confirmBtn.onclick = function(){
	const filmname = nameInput.value;
	console.log("confirm,filmname:"+filmname)
	chrome.runtime.sendMessage({"filmName":filmname},function(data){
		console.log(JSON.stringify(data))
		// messageDiv.innerText(JSON.stringify(data));
		if (data.code === 200) {
			// 下载成功
			messageDiv.innerText = ""
		}else{
			// 下载失败
			messageDiv.innerText = data.msg;
		}
	})

}

nameInput.onfocus = function(){
	this.value = '';
	messageDiv.innerText = '';
}

document.onkeydown = function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if (e && e.keyCode === 13) {
		confirmBtn.click();
		e.preventDefault();
	}
}