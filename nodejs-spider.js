var fs = require('fs'), /* 使用fs模块存储txt文本文件 */
	http = require("http"), /* 使用http模块进行内容抓取 */
	cheerio = require("cheerio"), /* 使用cheerio模块实现对抓取到的内容以JQuery选择器形式内容匹配 */
	iconv = require('iconv-lite'); /* 使用iconv-lite模块进行内容转码（解决GBK乱码） */
/* 将txt追加到文件'message.txt'尾部 */
function appendTxtFile(txt,callback){
	fs.appendFile('message.txt', txt, callback);
}
/* 核心方法：获取指定URL内容 */
function getContentByUrl(url,callback,errCallback,isGbk){
	http.get(url, function(res){
		var chunks = [], size = 0;
		res.on("data" , function(chunk){
			chunks.push(chunk);
			size += chunk.length;
		});

		res.on("end" , function(){
			//拼接buffer
			var data = Buffer.concat(chunks , size);

			var html = '';
			if(isGbk){
				html = iconv.decode(data, 'GBK');
			}else{
				html = data.toString();
			}
			var $ = cheerio.load(html);
			var titleEl = $('h1'), contentEl = $('#content');

			var title='', txt = '';
			if(titleEl.length>0 && contentEl.length>0){
				title = titleEl.text();
				txt = contentEl.text().replace(/    /g,'\n    ');
			}
			if(txt=='' || title=='服务器错误'){
				var errmsg = txt==''?'is empty':title;
				console.log('【content err】:',errmsg);
				errCallback(errmsg,html);
			}else{
				console.log('【content ok】:',title);
				callback('\n\n'+title+'\n'+txt);
			}

		})
	}).on('error' , function(e){
		console.log('【http get err】:',e);
		errCallback('http get err',e);
	});
}

/* 基于有序索引URL的抓取 sta */
function __(){
	var emptyCount = 0, staPageNum = 1630885, endPageNum = 1978756;

	function nextPage(){
		staPageNum++;
		start();
	}

	function start(){
		var url = 'http://www.biquge.la/book/2918/'+staPageNum+'.html';
		console.log('get by :',url);
		getContentByUrl(
			url,
			function(txt){
				emptyCount = 0;
				appendTxtFile(txt,function (err) {
					if (err) throw err;
					console.log('It\'s saved!'); //文件被保存
					nextPage();
				});
			},
			function(errmsg){
				if(staPageNum<endPageNum){
					if(emptyCount<3){
						emptyCount++;
						nextPage();
					}else{
						console.log("【连续错误URL超过3个，请检查。】");
					}
				}else{
					console.log("【抓取完毕】");
				}
				//console.log(errmsg);
			},
			true
		);
	}
	//start();
}
/* 基于有序索引URL的抓取 end */


/* 基于设定URL集合的抓取 sta */
(function(){
	var urls = ["http://www.biquge.la/book/2918/1630885.html", "http://www.biquge.la/book/2918/1634362.html", "http://www.biquge.la/book/2918/1638806.html", "http://www.biquge.la/book/2918/1642334.html", "http://www.biquge.la/book/2918/1657538.html", "http://www.biquge.la/book/2918/1659124.html", "http://www.biquge.la/book/2918/1668843.html", "http://www.biquge.la/book/2918/1675707.html", "http://www.biquge.la/book/2918/1677800.html", "http://www.biquge.la/book/2918/1683459.html", "http://www.biquge.la/book/2918/1691984.html", "http://www.biquge.la/book/2918/1694644.html", "http://www.biquge.la/book/2918/1697318.html", "http://www.biquge.la/book/2918/1699240.html", "http://www.biquge.la/book/2918/1706463.html", "http://www.biquge.la/book/2918/1706649.html", "http://www.biquge.la/book/2918/1978756.html"];
	var emptyCount = 0, staPageNum = 0, endPageNum = urls.length-1;

	function nextPage(){
		staPageNum++;
		start();
	}

	function start(){
		var url = urls[staPageNum];
		console.log('get by :',url);
		getContentByUrl(
			url,
			function(txt){
				emptyCount = 0;
				appendTxtFile(txt,function (err) {
					if (err) throw err;
					console.log('【It\'s saved!】'); //文件被保存
					nextPage();
				});
			},
			function(errmsg){
				if(staPageNum<endPageNum){
					if(emptyCount<3){
						emptyCount++;
						nextPage();
					}else{
						console.log("【连续错误URL超过3个，请检查。】");
					}
				}else{
					console.log("【抓取完毕】");
				}
				//console.log(errmsg);
			},
			true
		);
	}
	//start();
})();

/* 基于设定URL集合的抓取 end */
