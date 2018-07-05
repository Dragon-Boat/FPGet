
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
	console.log(sender.tab?"from a content script":"from the extension")

	console.log(JSON.stringify(request));
	var filmName = request.filmName;
	var baseUrl = "https://api.douban.com/v2/movie/search";
	var imgUrlPrefix = "https://img3.doubanio.com/view/photo/l/public/p";
	var imgUrlSuffix = ".jpg";
	$.ajax({
		url:baseUrl,
		type:'GET',
		dataType:'json',
		data:{'q':encodeURIComponent(filmName)
		,'count':1},
	}).then(function(response){
		console.log(JSON.stringify(response));
		if (response && response.subjects && response.subjects.length > 0) {
			let title = response.subjects[0].title;
			
			let thumbImgUrl = response.subjects[0].images.small;

			if (title.indexOf(filmName) >=0 && thumbImgUrl) {
				// 保证搜索结果符合预期
				// "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2519070834.webp"
				// https://img3.doubanio.com/view/photo/l/public/p2519070834.webp
				var id = thumbImgUrl.replace(/.+p(\d+).jpg/,'$1');
				var imgUrl = imgUrlPrefix+id+imgUrlSuffix;
				console.log("final imgUrl:"+imgUrl);
				chrome.downloads.download({
					url:imgUrl,
					conflictAction:'prompt',
					saveAs:true,
					filename:title+'.jpg'
				},function(){
					sendResponse({'code':200,'msg':'下载成功'});
				})
			}else{
				sendResponse({'code':400,'msg':'未搜索到相关电影'})
			}
		}else{
sendResponse({'code':400,'msg':'未搜索到相关电影'})
		}
	},function(error){
		console.log(error);
		sendResponse({'code':400,'msg':'请求失败，请稍后再试'})
	});
	return true;
});